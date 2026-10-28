import orchestrator from "tests/orchestrator.js";
import webserver from "infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

function getOrders(sessionObject) {
  return fetch(`${webserver.origin}/api/v1/orders`, {
    headers: sessionObject
      ? { Cookie: `session_id=${sessionObject.token}` }
      : undefined,
  });
}

const FORBIDDEN = {
  name: "ForbiddenError",
  message: "Você não possui permissão para executar esta ação.",
  action: 'Verifique se o seu usuário possui a feature "read:order:all"',
  status_code: 403,
};

describe("GET /api/v1/orders", () => {
  describe("Anonymous user", () => {
    test("Listing the orders", async () => {
      await orchestrator.createOrder();

      const response = await getOrders();

      expect(response.status).toBe(403);
      expect(await response.json()).toEqual(FORBIDDEN);
    });
  });

  describe("Default user", () => {
    test("Listing the orders", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser);
      const sessionObject = await orchestrator.createSession(activatedUser);

      const response = await getOrders(sessionObject);

      expect(response.status).toBe(403);
      expect(await response.json()).toEqual(FORBIDDEN);
    });
  });

  describe("Privileged user", () => {
    test("With `read:order:all`", async () => {
      const createdUser = await orchestrator.createUser();
      const activatedUser = await orchestrator.activateUser(createdUser);
      await orchestrator.addFeaturesToUser(createdUser, ["read:order:all"]);
      const sessionObject = await orchestrator.createSession(activatedUser);
      const newest = await orchestrator.createOrder();

      const response = await getOrders(sessionObject);

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toHaveLength(2);
      expect(responseBody[0]).toEqual({
        id: newest.id,
        code: newest.code,
        status: "pending",
        items: newest.items,
        subtotal: newest.subtotal,
        shipping: newest.shipping,
        total: newest.total,
        customer_name: "Marina Albuquerque",
        customer_email: "marina@example.com",
        customer_phone: "11987654321",
        customer_tax_id: "52998224725",
        shipping_address: newest.shipping_address,
        abacatepay_checkout_id: newest.abacatepay_checkout_id,
        dev_mode: true,
        paid_at: null,
        created_at: newest.created_at.toISOString(),
        updated_at: newest.updated_at.toISOString(),
      });
      expect(responseBody[1].created_at < responseBody[0].created_at).toBe(
        true,
      );
    });
  });
});
