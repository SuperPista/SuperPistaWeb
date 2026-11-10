import crypto from "node:crypto";
import retry from "async-retry";
import activationCode from "models/activationCode.js";
import order from "models/order.js";
import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";
import { ForbiddenError } from "infra/errors.js";

beforeAll(async () => {
  // O CI inicia o Postgres junto dos testes; espera a conexão antes de preparar
  // o banco, mesmo se esta for a primeira suíte escolhida pelo Jest.
  await retry(() => database.query("SELECT 1;"), {
    retries: 20,
    minTimeout: 100,
    maxTimeout: 1000,
  });
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

async function createOrder(boards = ["vermelho"], paid = true) {
  const prepared = order.prepare(orchestrator.buildOrderInput());
  // As outras cores ainda estão em breve no catálogo. Testa o contrato com
  // itens persistidos, sem liberar a venda desses produtos na loja.
  prepared.items = boards.map((board) => ({
    ...prepared.items[0],
    slug: `tabuleiro-${board}`,
    quantity: 2,
  }));
  const created = await order.create(prepared, {
    id: crypto.randomUUID(),
    url: "https://example.com/pay",
    devMode: true,
  });
  if (paid)
    await order.transitionByCheckoutId(created.abacatepay_checkout_id, "paid");
  return created;
}

function activate(code, deviceId) {
  return activationCode.activate({ code, deviceId });
}

test.each(
  [
    ["vermelho"],
    ["amarelo"],
    ["vermelho", "amarelo"],
    ["vermelho", "amarelo", "azul", "verde"],
  ].map((boards) => [boards]),
)("um código libera somente os tabuleiros %j", async (boards) => {
  const created = await createOrder(boards);
  expect(created.activation_codes).toHaveLength(1);
  const code = created.activation_codes[0].code;
  const device = crypto.randomUUID();
  expect((await activate(code, device)).boards).toEqual(boards);
  expect(await activationCode.findActiveBoardsByDevice(device)).toEqual(
    [...boards].sort(),
  );
  expect((await activationCode.findAllByOrderId(created.id))[0].boards).toEqual(
    boards,
  );
  expect(
    (await activationCode.findAllByOrderIds([created.id]))[0].boards,
  ).toEqual(boards);
  expect(
    await activationCode.findAllByCustomerEmail(created.customer_email),
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ code, boards, devices_count: 1 }),
    ]),
  );
});

test("gerações simultâneas para o mesmo pedido não duplicam código", async () => {
  const created = await createOrder(["vermelho", "amarelo"]);
  await database.query({
    text: "DELETE FROM activation_codes WHERE order_id = $1",
    values: [created.id],
  });
  const results = await Promise.all(
    Array.from({ length: 6 }, () =>
      activationCode.createForOrder(created.id, created.items),
    ),
  );
  expect(new Set(results.map(([code]) => code.code)).size).toBe(1);
  expect(await activationCode.findAllByOrderId(created.id)).toHaveLength(1);
});

test("ativações simultâneas não ultrapassam dois aparelhos", async () => {
  const created = await createOrder(["vermelho", "amarelo"]);
  const code = created.activation_codes[0].code;
  const results = await Promise.allSettled(
    Array.from({ length: 6 }, (_, i) => activate(code, `concurrent-${i}`)),
  );
  expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(2);
  expect(results.filter((r) => r.status === "rejected")).toHaveLength(4);
  expect(
    (await activationCode.findAllByOrderId(created.id))[0].devices_count,
  ).toBe(2);
});

test("reativações simultâneas do mesmo aparelho consomem uma vaga", async () => {
  const created = await createOrder(["vermelho", "amarelo"]);
  const code = created.activation_codes[0].code;
  const results = await Promise.all(
    Array.from({ length: 6 }, () => activate(code, "same-device")),
  );
  expect(results.every((r) => r.devicesCount === 1)).toBe(true);
  expect(results.filter((r) => !r.alreadyActive)).toHaveLength(1);
});

test("só pedidos pagos permitem ativar e sincronizar seus tabuleiros", async () => {
  const created = await createOrder(["vermelho", "amarelo"], false);
  const code = created.activation_codes[0].code;
  expect(
    order.toPublic(await order.findOneById(created.id)).activation_codes,
  ).toEqual([]);
  await expect(activate(code, "payment-device")).rejects.toBeInstanceOf(
    ForbiddenError,
  );
  const paid = await order.transitionByCheckoutId(
    created.abacatepay_checkout_id,
    "paid",
  );
  expect(order.toPublic(paid).activation_codes).toHaveLength(1);
  await activate(code, "payment-device");
  await order.transitionByCheckoutId(
    created.abacatepay_checkout_id,
    "refunded",
  );
  await expect(activate(code, "payment-device")).rejects.toBeInstanceOf(
    ForbiddenError,
  );
  expect(
    await activationCode.findActiveBoardsByDevice("payment-device"),
  ).toEqual([]);
});

test("falha na geração não deixa pedido gravado sem código", async () => {
  const prepared = order.prepare(orchestrator.buildOrderInput());
  const spy = jest
    .spyOn(activationCode, "createForOrder")
    .mockRejectedValueOnce(new Error("generation failed"));
  try {
    await expect(
      order.create(prepared, {
        id: crypto.randomUUID(),
        url: "https://example.com/pay",
        devMode: true,
      }),
    ).rejects.toThrow("generation failed");
  } finally {
    spy.mockRestore();
  }
  const found = await database.query({
    text: "SELECT id FROM orders WHERE id = $1",
    values: [prepared.id],
  });
  expect(found.rowCount).toBe(0);
});
