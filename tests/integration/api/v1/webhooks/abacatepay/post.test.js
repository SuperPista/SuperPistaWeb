import crypto from "node:crypto";
import orchestrator from "tests/orchestrator.js";
import database from "infra/database.js";
import webserver from "infra/webserver.js";

// A chave pública da documentação da AbacatePay, a mesma de infra/abacatepay.js.
const SIGNATURE_KEY =
  "t9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

function sign(rawBody) {
  return crypto
    .createHmac("sha256", SIGNATURE_KEY)
    .update(rawBody, "utf8")
    .digest("base64");
}

function buildEvent(event, checkoutId, status = "PAID") {
  return {
    id: `log_${crypto.randomUUID()}`,
    event,
    apiVersion: 2,
    devMode: true,
    data: {
      checkout: { id: checkoutId, status, amount: 61780, paidAmount: 61780 },
      customer: { id: "cust_abc", taxId: "529.***.***-**" },
    },
  };
}

function postWebhook(
  body,
  {
    secret = process.env.ABACATEPAY_WEBHOOK_SECRET,
    signature = sign(body),
  } = {},
) {
  const query = secret === null ? "" : `?webhookSecret=${secret}`;

  return fetch(`${webserver.origin}/api/v1/webhooks/abacatepay${query}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(signature !== null && { "X-Webhook-Signature": signature }),
    },
    body,
  });
}

async function findOrder(id) {
  const results = await database.query({
    text: "SELECT * FROM orders WHERE id = $1;",
    values: [id],
  });
  return results.rows[0];
}

describe("POST /api/v1/webhooks/abacatepay", () => {
  describe("AbacatePay", () => {
    test("With a payment confirmed", async () => {
      const order = await orchestrator.createOrder();
      const body = JSON.stringify(
        buildEvent("checkout.completed", order.abacatepay_checkout_id),
      );

      const response = await postWebhook(body);

      expect(response.status).toBe(200);

      const updated = await findOrder(order.id);
      expect(updated.status).toBe("paid");
      expect(updated.paid_at).not.toBeNull();
    });

    test("With the same event delivered twice", async () => {
      const order = await orchestrator.createOrder();
      const body = JSON.stringify(
        buildEvent("checkout.completed", order.abacatepay_checkout_id),
      );

      await postWebhook(body);
      const paidAt = (await findOrder(order.id)).paid_at;
      const response = await postWebhook(body);

      expect(response.status).toBe(200);
      expect((await findOrder(order.id)).paid_at).toEqual(paidAt);
    });

    test("With a checkout closed by a coupon", async () => {
      const order = await orchestrator.createOrder();
      const body = JSON.stringify(
        buildEvent(
          "checkout.completed",
          order.abacatepay_checkout_id,
          "REDEEMED",
        ),
      );

      const response = await postWebhook(body);

      expect(response.status).toBe(200);
      expect((await findOrder(order.id)).status).toBe("pending");
    });

    test("With a refund of a paid order", async () => {
      const order = await orchestrator.createOrder();
      const checkoutId = order.abacatepay_checkout_id;

      await postWebhook(
        JSON.stringify(buildEvent("checkout.completed", checkoutId)),
      );
      const response = await postWebhook(
        JSON.stringify(buildEvent("checkout.refunded", checkoutId)),
      );

      expect(response.status).toBe(200);
      expect((await findOrder(order.id)).status).toBe("refunded");
    });

    test("With a refund of an order that was never paid", async () => {
      const order = await orchestrator.createOrder();
      const body = JSON.stringify(
        buildEvent("checkout.refunded", order.abacatepay_checkout_id),
      );

      const response = await postWebhook(body);

      expect(response.status).toBe(200);
      expect((await findOrder(order.id)).status).toBe("pending");
    });

    test("With a checkout that is not an order", async () => {
      const body = JSON.stringify(
        buildEvent("checkout.completed", "bill_de_outra_loja"),
      );

      const response = await postWebhook(body);

      expect(response.status).toBe(200);
    });

    test("With an event the store does not handle", async () => {
      const order = await orchestrator.createOrder();
      const body = JSON.stringify(
        buildEvent("checkout.disputed", order.abacatepay_checkout_id),
      );

      const response = await postWebhook(body);

      expect(response.status).toBe(200);
      expect((await findOrder(order.id)).status).toBe("pending");
    });

    test("With a body that is not JSON", async () => {
      const response = await postWebhook("não é json");

      expect(response.status).toBe(400);
    });
  });

  describe("Anyone else", () => {
    test.each([
      ["a wrong secret", { secret: "chute" }],
      ["no secret", { secret: null }],
      ["a wrong signature", { signature: sign("outro corpo") }],
      ["no signature", { signature: null }],
    ])("With %s", async (_label, options) => {
      const order = await orchestrator.createOrder();
      const body = JSON.stringify(
        buildEvent("checkout.completed", order.abacatepay_checkout_id),
      );

      const response = await postWebhook(body, options);

      expect(response.status).toBe(401);
      expect((await findOrder(order.id)).status).toBe("pending");
    });
  });
});
