import crypto from "node:crypto";
import orchestrator from "tests/orchestrator.js";
import order from "models/order.js";
import webserver from "infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

function activate(code, deviceId, token) {
  return fetch(`${webserver.origin}/api/v1/app/activate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Cookie: `session_id=${token}` } : {}),
    },
    body: JSON.stringify({ code, device_id: deviceId }),
  });
}

function checkAccess(deviceId) {
  return fetch(
    `${webserver.origin}/api/v1/app/check-access?device_id=${encodeURIComponent(deviceId)}`,
  );
}

test("preserva o contrato do Unity, reativação, limite e estorno", async () => {
  const prepared = order.prepare(orchestrator.buildOrderInput());
  // Exercita várias cores já persistidas sem pôr produtos em breve à venda.
  prepared.items = ["vermelho", "amarelo"].map((board) => ({
    ...prepared.items[0],
    slug: `tabuleiro-${board}`,
  }));
  const created = await order.create(prepared, {
    id: crypto.randomUUID(),
    url: "https://example.com/pay",
    devMode: true,
  });
  const code = created.activation_codes[0].code;
  const device = "unity-device";

  const pending = await activate(code, device);
  expect(pending.status).toBe(403);

  await order.transitionByCheckoutId(created.abacatepay_checkout_id, "paid");
  const first = await activate(code, device);
  expect(first.status).toBe(200);
  expect(await first.json()).toEqual({
    success: true,
    board: "vermelho",
    boards: ["vermelho", "amarelo"],
    code,
    alreadyActive: false,
    devicesCount: 1,
    maxDevices: 2,
  });

  const repeated = await activate(code, device);
  expect(repeated.status).toBe(200);
  expect(await repeated.json()).toMatchObject({
    alreadyActive: true,
    devicesCount: 1,
  });

  const user = await orchestrator.createUser();
  const session = await orchestrator.createSession(user);
  const second = await activate(code, "second-device", session.token);
  expect(second.status).toBe(200);
  expect(await second.json()).toMatchObject({ devicesCount: 2 });
  const third = await activate(code, "third-device");
  expect(third.status).toBe(403);

  const access = await checkAccess(device);
  expect(access.status).toBe(200);
  expect(await access.json()).toEqual({
    success: true,
    device_id: device,
    boards: ["amarelo", "vermelho"],
  });

  await order.transitionByCheckoutId(
    created.abacatepay_checkout_id,
    "refunded",
  );
  const refunded = await checkAccess(device);
  expect(refunded.status).toBe(200);
  expect(await refunded.json()).toEqual({
    success: true,
    device_id: device,
    boards: [],
  });
  const reactivation = await activate(code, device);
  expect(reactivation.status).toBe(403);
});

test("não libera tabuleiros para um aparelho sem ativação", async () => {
  const response = await checkAccess("unknown-device");
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    success: true,
    device_id: "unknown-device",
    boards: [],
  });
});
