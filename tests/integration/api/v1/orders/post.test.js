import orchestrator from "tests/orchestrator.js";
import createAbacatepayFake from "tests/abacatepayFake.js";
import database from "infra/database.js";
import webserver from "infra/webserver.js";
import { SLUG_DO_TABULEIRO, produtoPorSlug } from "components/loja/catalogo.js";

const abacatepay = createAbacatepayFake();

const tabuleiro = produtoPorSlug(SLUG_DO_TABULEIRO);
const TOTAL = tabuleiro.preco * 4;

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

function postOrder(body) {
  return fetch(`${webserver.origin}/api/v1/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function countOrders() {
  const results = await database.query(
    "SELECT count(*)::int AS total FROM orders;",
  );
  return results.rows[0].total;
}

describe("POST /api/v1/orders", () => {
  describe("Anonymous user", () => {
    test("With valid data", async () => {
      const response = await postOrder(orchestrator.buildOrderInput());

      expect(response.status).toBe(201);

      const responseBody = await response.json();
      const checkout = abacatepay.requestsTo("POST /checkouts/create")[0]?.body;

      expect(responseBody).toEqual({
        id: responseBody.id,
        code: responseBody.code,
        status: "pending",
        items: [
          {
            slug: SLUG_DO_TABULEIRO,
            product_name: tabuleiro.nome,
            child_name: "Celinha",
            article: "da",
            quantity: 1,
            unit_price: tabuleiro.preco,
            amount: tabuleiro.preco,
          },
          {
            slug: SLUG_DO_TABULEIRO,
            product_name: tabuleiro.nome,
            child_name: "Daniel",
            article: "do",
            quantity: 1,
            unit_price: tabuleiro.preco,
            amount: tabuleiro.preco,
          },
          {
            slug: SLUG_DO_TABULEIRO,
            product_name: tabuleiro.nome,
            child_name: "",
            article: "",
            quantity: 2,
            unit_price: tabuleiro.preco,
            amount: tabuleiro.preco * 2,
          },
        ],
        subtotal: TOTAL,
        shipping: 0,
        total: TOTAL,
        customer_name: "Marina Albuquerque",
        shipping_address: {
          zip_code: "01310-100",
          street: "Avenida Paulista",
          number: "1000",
          complement: "Apto 12",
          neighborhood: "Bela Vista",
          city: "São Paulo",
          state: "SP",
        },
        payment_url: expect.stringMatching(
          /^https:\/\/app\.abacatepay\.com\/pay\/bill_[\w-]+\?skip_address=true$/,
        ),
        dev_mode: true,
        paid_at: null,
        created_at: responseBody.created_at,
      });
      expect(responseBody.code).toMatch(/^SP-[2-9A-HJ-NP-Z]{6}$/);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();

      // Os tabuleiros, com nomes diferentes ou sem nome, são um produto só,
      // com quantidade 4, para a AbacatePay.
      const orderUrl = `${webserver.origin}/pedido/${responseBody.id}`;
      expect(checkout).toEqual({
        items: [
          {
            id: process.env.ABACATEPAY_PRODUCT_TABULEIRO_VERMELHO,
            quantity: 4,
          },
        ],
        customerId: expect.stringMatching(/^cust_/),
        externalId: responseBody.id,
        returnUrl: orderUrl,
        completionUrl: orderUrl,
        methods: ["PIX", "CARD", "BOLETO"],
        card: { maxInstallments: 12 },
        metadata: { pedido: responseBody.code },
      });

      const [customerRequest] = abacatepay.requestsTo("POST /customers/create");
      expect(customerRequest.body).toEqual({
        email: "marina@example.com",
        name: "Marina Albuquerque",
        cellphone: "(11) 98765-4321",
        taxId: "529.982.247-25",
      });

      // O que não sai na resposta fica guardado no banco.
      const stored = await database.query({
        text: "SELECT * FROM orders WHERE id = $1;",
        values: [responseBody.id],
      });
      expect(stored.rows[0]).toMatchObject({
        customer_email: "marina@example.com",
        customer_phone: "11987654321",
        customer_tax_id: "52998224725",
        payment_url: responseBody.payment_url,
      });
      expect(stored.rows[0].abacatepay_checkout_id).toMatch(/^bill_/);
    });

    test("Does not look the products up again on the next order", async () => {
      await postOrder(orchestrator.buildOrderInput());
      abacatepay.reset();

      const response = await postOrder(orchestrator.buildOrderInput());

      expect(response.status).toBe(201);
      expect(abacatepay.requestsTo("GET /products/get")).toHaveLength(0);
    });

    // A rota lê a sessão só no GET. Um cookie vencido no navegador de quem
    // compra não pode virar 401 na compra, que nem pede conta.
    test("With a session cookie that is no longer valid", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: "session_id=sessao-que-nao-existe",
        },
        body: JSON.stringify(orchestrator.buildOrderInput()),
      });

      expect(response.status).toBe(201);
    });

    test("With an invalid CPF", async () => {
      const ordersBefore = await countOrders();
      const input = orchestrator.buildOrderInput();
      input.customer.tax_id = "111.111.111-11";

      const response = await postOrder(input);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        name: "ValidationError",
        message: "Esse CPF não confere. Veja se algum número ficou trocado.",
        action: "Confira os dados de quem recebe e o endereço.",
        status_code: 400,
      });
      expect(abacatepay.requestsTo("POST /checkouts/create")).toHaveLength(0);
      expect(await countOrders()).toBe(ordersBefore);
    });

    test("With a product that is not in the store", async () => {
      const response = await postOrder(
        orchestrator.buildOrderInput({
          items: [{ slug: "tabuleiro-roxo", quantity: 1 }],
        }),
      );

      expect(response.status).toBe(400);
      expect((await response.json()).message).toBe(
        "Um dos produtos da sacola não está mais na loja.",
      );
    });

    test("With a product that is coming soon", async () => {
      const ordersBefore = await countOrders();

      const response = await postOrder(
        orchestrator.buildOrderInput({
          items: [{ slug: "kit-de-carrinhos", quantity: 1 }],
        }),
      );

      expect(response.status).toBe(400);
      expect((await response.json()).message).toBe(
        "Um dos produtos da sacola ainda não está à venda.",
      );
      expect(abacatepay.requestsTo("POST /checkouts/create")).toHaveLength(0);
      expect(await countOrders()).toBe(ordersBefore);
    });

    test("When AbacatePay fails to create the checkout", async () => {
      const ordersBefore = await countOrders();
      abacatepay.failRoute("POST /checkouts/create");

      const response = await postOrder(orchestrator.buildOrderInput());

      expect(response.status).toBe(500);
      expect(await countOrders()).toBe(ordersBefore);
    });

    test("When AbacatePay charges a different total", async () => {
      const ordersBefore = await countOrders();
      abacatepay.shiftCheckoutAmount(100);

      const response = await postOrder(orchestrator.buildOrderInput());

      expect(response.status).toBe(500);
      expect(await countOrders()).toBe(ordersBefore);
    });
  });
});
