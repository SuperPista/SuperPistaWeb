import crypto from "node:crypto";
import email from "infra/email.js";
import abacatepay from "infra/abacatepay.js";
import webserver from "infra/webserver.js";
import order from "models/order.js";
import orderEmail from "models/orderEmail.js";
import payment from "models/payment.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

beforeEach(async () => {
  await orchestrator.deleteAllEmails();
});

afterEach(() => {
  jest.restoreAllMocks();
});

async function createOrder(slugs = ["tabuleiro-vermelho"]) {
  const prepared = order.prepare(orchestrator.buildOrderInput());
  // Exercita cores e kits persistidos sem mudar os produtos à venda na loja.
  prepared.items = slugs.map((slug) => ({ ...prepared.items[0], slug }));
  return order.create(prepared, {
    id: crypto.randomUUID(),
    url: "https://example.com/pay",
    devMode: true,
  });
}

function paidEvent(created) {
  return {
    event: "checkout.completed",
    data: {
      checkout: { id: created.abacatepay_checkout_id, status: "PAID" },
      customer: { email: "outro@example.com" },
    },
  };
}

test("envia os códigos existentes ao e-mail da compra só após pagamento", async () => {
  const created = await createOrder(["tabuleiro-vermelho", "tabuleiro-azul"]);
  await orderEmail.sendActivationCodes(created.abacatepay_checkout_id);
  expect(await orchestrator.getAllEmails()).toHaveLength(0);

  await payment.handleWebhookEvent(paidEvent(created));

  const message = await orchestrator.getLastEmail();
  expect(message.sender).toBe("<contato@superpista.com>");
  expect(message.recipients).toEqual([`<${created.customer_email}>`]);
  expect(message.subject).toBe(
    `Seu acesso ao aplicativo Super Pista — pedido ${created.code}`,
  );
  expect(message.text).toContain(created.customer_name);
  expect(message.text).toContain(created.activation_codes[0].code);
  expect(message.text).toContain("Tabuleiros vermelho, azul");
  expect(message.text).toContain("até 2 aparelhos");
  expect(message.text).toContain(`${webserver.origin}/pedido/${created.id}`);
  expect(message.text).toContain(`${webserver.origin}/cadastro`);
  expect(message.text).not.toContain(created.customer_tax_id);
  expect(message.text).not.toContain(created.shipping_address.street);

  const updated = await order.findOneById(created.id);
  expect(updated.activation_email_sent_at).toBeInstanceOf(Date);
  expect(updated.activation_codes[0].code).toBe(
    created.activation_codes[0].code,
  );
});

test("webhooks e consultas simultâneos enviam apenas um e-mail por pedido", async () => {
  const created = await createOrder();
  const paid = await order.transitionByCheckoutId(
    created.abacatepay_checkout_id,
    "paid",
  );

  await Promise.all(
    Array.from({ length: 6 }, (_, index) =>
      index % 2 === 0
        ? payment.handleWebhookEvent(paidEvent(created))
        : payment.refresh(paid),
    ),
  );
  await payment.handleWebhookEvent(paidEvent(created));
  const sendActivationCodes = jest.spyOn(orderEmail, "sendActivationCodes");
  await payment.refresh(await order.findOneById(created.id));

  expect(sendActivationCodes).not.toHaveBeenCalled();
  expect(await orchestrator.getAllEmails()).toHaveLength(1);
});

test("falha de envio preserva o pagamento e a reentrega do webhook tenta de novo", async () => {
  const created = await createOrder();
  const send = jest
    .spyOn(email, "send")
    .mockRejectedValueOnce(new Error("SMTP indisponível"));

  await expect(payment.handleWebhookEvent(paidEvent(created))).rejects.toThrow(
    "SMTP indisponível",
  );
  const paid = await order.findOneById(created.id);
  expect(paid.status).toBe("paid");
  expect(paid.activation_email_sent_at).toBeNull();
  expect(await orchestrator.getAllEmails()).toHaveLength(0);

  await payment.handleWebhookEvent(paidEvent(created));
  expect(await orchestrator.getAllEmails()).toHaveLength(1);
  expect(send.mock.calls[0][0].messageId).toBe(send.mock.calls[1][0].messageId);
  expect(
    (await order.findOneById(created.id)).activation_email_sent_at,
  ).not.toBeNull();
});

test("consulta que confirma pagamento mantém o código disponível mesmo se o SMTP falhar", async () => {
  const created = await createOrder();
  const getCheckout = jest
    .spyOn(abacatepay, "getCheckout")
    .mockResolvedValue({ status: "PAID" });
  jest
    .spyOn(email, "send")
    .mockRejectedValueOnce(new Error("SMTP indisponível"));
  const log = jest.spyOn(console, "error").mockImplementation(() => {});

  const paid = await payment.refresh(created);
  expect(paid.status).toBe("paid");
  expect(order.toPublic(paid).activation_codes[0].code).toBe(
    created.activation_codes[0].code,
  );
  expect(
    (await order.findOneById(created.id)).activation_email_sent_at,
  ).toBeNull();
  expect(log).toHaveBeenCalledWith({
    name: "ActivationEmailError",
    orderId: created.id,
    underlyingErrorName: "Error",
  });

  await payment.refresh(paid);
  expect(getCheckout).toHaveBeenCalledTimes(1);
  expect(await orchestrator.getAllEmails()).toHaveLength(1);
});

test.each(["pending", "expired", "cancelled", "refunded"])(
  "não envia código de pedido %s",
  async (status) => {
    const created = await createOrder();
    if (status === "refunded") {
      await order.transitionByCheckoutId(
        created.abacatepay_checkout_id,
        "paid",
      );
    }
    if (status !== "pending") {
      await order.transitionByCheckoutId(
        created.abacatepay_checkout_id,
        status,
      );
    }

    expect(
      await orderEmail.sendActivationCodes(created.abacatepay_checkout_id),
    ).toBe(false);
    expect(await orchestrator.getAllEmails()).toHaveLength(0);
    expect(
      (await order.findOneById(created.id)).activation_email_sent_at,
    ).toBeNull();
  },
);

test("não envia após estorno, mesmo se a notificação de pagamento chegar atrasada", async () => {
  const created = await createOrder();
  jest
    .spyOn(email, "send")
    .mockRejectedValueOnce(new Error("SMTP indisponível"));
  await expect(
    payment.handleWebhookEvent(paidEvent(created)),
  ).rejects.toThrow();

  await payment.handleWebhookEvent({
    event: "checkout.refunded",
    data: { checkout: { id: created.abacatepay_checkout_id } },
  });
  await payment.handleWebhookEvent(paidEvent(created));
  await payment.refresh(await order.findOneById(created.id));

  expect((await order.findOneById(created.id)).status).toBe("refunded");
  expect(await orchestrator.getAllEmails()).toHaveLength(0);
});

test("não envia e-mail de código para compra só de kits ou checkout desconhecido", async () => {
  const created = await createOrder(["kit-de-carrinhos"]);
  await payment.handleWebhookEvent(paidEvent(created));
  await orderEmail.sendActivationCodes("checkout-desconhecido");

  expect((await order.findOneById(created.id)).status).toBe("paid");
  expect(created.activation_codes).toEqual([]);
  expect(await orchestrator.getAllEmails()).toHaveLength(0);
});
