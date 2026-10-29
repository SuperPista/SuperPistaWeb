import http from "node:http";
import crypto from "node:crypto";
import payment from "models/payment.js";
import { todosOsProdutos } from "components/loja/catalogo.js";

// A AbacatePay de mentira dos testes de integração. O `npm test` sobe o Next
// com ABACATEPAY_API_URL apontando para cá (package.json), e cada arquivo de
// teste liga e desliga a sua com start() e stop().
//
// Ela nasce com os produtos da loja já cadastrados, como no painel da de
// verdade: cada produto à venda com o id que o ambiente dá a ele e o preço do
// catálogo.
const apiUrl = new URL(process.env.ABACATEPAY_API_URL);
const PORT = Number(apiUrl.port);
const BASE_PATH = apiUrl.pathname;

function createAbacatepayFake() {
  let server;
  let state;

  reset();

  function registeredProducts() {
    return new Map(
      todosOsProdutos().flatMap((produto) => {
        const id = process.env[payment.productIdVariable(produto)];

        if (produto.emBreve || !id) {
          return [];
        }

        const product = {
          id,
          name: produto.nome,
          price: produto.preco,
          currency: "BRL",
          status: "ACTIVE",
          devMode: true,
        };
        return [[id, product]];
      }),
    );
  }

  function reset() {
    state = {
      products: registeredProducts(),
      checkouts: new Map(),
      requests: [],
      failures: new Map(),
      amountOffset: 0,
    };
  }

  function reply(response, statusCode, data, error = null) {
    response.writeHead(statusCode, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ data, success: error === null, error }));
  }

  // Como a de verdade, responde 400 (e não 404) quando não acha o produto ou o
  // checkout, com a mesma mensagem que ela manda.
  const routes = {
    "GET /products/get": (query) => {
      const product = state.products.get(query.get("id"));
      return product ? [200, product] : [400, null, "Product not found"];
    },

    "POST /customers/create": (_query, body) => [
      200,
      { id: `cust_${crypto.randomUUID()}`, devMode: true, ...body },
    ],

    "POST /checkouts/create": (_query, body) => {
      if (!body.items.every((item) => state.products.has(item.id))) {
        return [400, null, "Product not found"];
      }

      const id = `bill_${crypto.randomUUID()}`;
      const amount = body.items.reduce(
        (sum, item) => sum + state.products.get(item.id).price * item.quantity,
        state.amountOffset,
      );
      const checkout = {
        ...body,
        id,
        url: `https://app.abacatepay.com/pay/${id}`,
        amount,
        paidAmount: null,
        status: "PENDING",
        devMode: true,
      };
      state.checkouts.set(id, checkout);
      return [200, checkout];
    },

    "GET /checkouts/get": (query) => {
      const checkout = state.checkouts.get(query.get("id"));
      return checkout ? [200, checkout] : [400, null, "Billing not found"];
    },
  };

  async function handle(request, response) {
    const url = new URL(request.url, `http://localhost:${PORT}`);
    const path = url.pathname.slice(BASE_PATH.length);
    const route = `${request.method} ${path}`;

    let rawBody = "";
    for await (const chunk of request) {
      rawBody += chunk;
    }
    const body = rawBody ? JSON.parse(rawBody) : null;

    state.requests.push({ route, query: url.searchParams, body });

    if (
      request.headers.authorization !==
      `Bearer ${process.env.ABACATEPAY_API_KEY}`
    ) {
      return reply(response, 401, null, "Invalid API key");
    }

    if (state.failures.has(route)) {
      return reply(response, 500, null, "Internal error");
    }

    if (!routes[route]) {
      return reply(response, 404, null, "Route not found");
    }

    return reply(response, ...routes[route](url.searchParams, body));
  }

  return {
    start() {
      reset();
      server = http.createServer(handle);
      return new Promise((resolve) => server.listen(PORT, resolve));
    },

    stop() {
      return new Promise((resolve) => server.close(resolve));
    },

    reset,

    // As chamadas que o site fez a uma rota, como "POST /checkouts/create".
    requestsTo(route) {
      return state.requests.filter((request) => request.route === route);
    },

    failRoute(route) {
      state.failures.set(route, true);
    },

    // Faz o checkout somar um total diferente do que o site calculou.
    shiftCheckoutAmount(offset) {
      state.amountOffset = offset;
    },

    setCheckoutStatus(id, status) {
      state.checkouts.get(id).status = status;
    },
  };
}

export default createAbacatepayFake;
