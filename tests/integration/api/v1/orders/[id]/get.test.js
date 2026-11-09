import orchestrator from "tests/orchestrator.js";
import createAbacatepayFake from "tests/abacatepayFake.js";
import webserver from "infra/webserver.js";

const abacatepay = createAbacatepayFake();

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await abacatepay.start();
});

afterAll(async () => {
  await abacatepay.stop();
});

beforeEach(() => {
  abacatepay.reset();
});

// O pedido nasce pela rota, para o checkout existir na AbacatePay de mentira.
async function createOrderThroughApi() {
  const response = await fetch(`${webserver.origin}/api/v1/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orchestrator.buildOrderInput()),
  });
  const order = await response.json();
  const checkoutId = new URL(order.payment_url).pathname.split("/").pop();

  return { order, checkoutId };
}

function getOrder(id) {
  return fetch(`${webserver.origin}/api/v1/orders/${id}`);
}

describe("GET /api/v1/orders/[id]", () => {
  describe("Anonymous user", () => {
    test("With an order waiting for payment", async () => {
      const { order } = await createOrderThroughApi();

      const response = await getOrder(order.id);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(order);
      expect(abacatepay.requestsTo("GET /checkouts/get")).toHaveLength(1);
    });

    test("When AbacatePay says the order was paid", async () => {
      const { order, checkoutId } = await createOrderThroughApi();
      abacatepay.setCheckoutStatus(checkoutId, "PAID");

      const response = await getOrder(order.id);

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.status).toBe("paid");
      expect(responseBody.payment_url).toBeNull();
      expect(Date.parse(responseBody.paid_at)).not.toBeNaN();

      // Pedido pago não pergunta mais nada à AbacatePay.
      abacatepay.reset();
      await getOrder(order.id);
      expect(abacatepay.requestsTo("GET /checkouts/get")).toHaveLength(0);
    });

    test("When the time to pay is over", async () => {
      const { order, checkoutId } = await createOrderThroughApi();
      abacatepay.setCheckoutStatus(checkoutId, "EXPIRED");

      const response = await getOrder(order.id);

      expect((await response.json()).status).toBe("expired");
    });

    test("When the checkout was closed with a coupon", async () => {
      const { order, checkoutId } = await createOrderThroughApi();
      abacatepay.setCheckoutStatus(checkoutId, "REDEEMED");

      const response = await getOrder(order.id);

      expect((await response.json()).status).toBe("pending");
    });

    test("When AbacatePay is down", async () => {
      const { order } = await createOrderThroughApi();
      abacatepay.failRoute("GET /checkouts/get");

      const response = await getOrder(order.id);

      expect(response.status).toBe(200);
      expect((await response.json()).status).toBe("pending");
    });

    test("With an id that does not exist", async () => {
      const response = await getOrder("6f1c2a8e-3b5d-4e7f-9a0b-1c2d3e4f5a6b");

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        name: "NotFoundError",
        message: "O pedido não foi encontrado.",
        action: "Confira o link do pedido.",
        status_code: 404,
      });
    });

    test("With the order code instead of the id", async () => {
      const { order } = await createOrderThroughApi();

      const response = await getOrder(order.code);

      expect(response.status).toBe(404);
    });
  });
});
