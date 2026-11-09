import http from "node:http";

// A ViaCEP de mentira dos testes de integração. O `npm test` sobe o Next com
// VIACEP_API_URL apontando para cá (package.json), e cada arquivo de teste
// liga e desliga a sua com start() e stop().
//
// Ela conhece só os CEPs abaixo e responde no formato da de verdade, que
// devolve mais campos do que o site usa.
const apiUrl = new URL(process.env.VIACEP_API_URL);
const PORT = Number(apiUrl.port);
const BASE_PATH = apiUrl.pathname;

export const CEP_DE_RUA = "01310100";
export const CEP_DA_CIDADE_TODA = "69945000";

const ADDRESSES = new Map([
  [
    CEP_DE_RUA,
    {
      cep: "01310-100",
      logradouro: "Avenida Paulista",
      complemento: "de 612 a 1510 - lado par",
      unidade: "",
      bairro: "Bela Vista",
      localidade: "São Paulo",
      uf: "SP",
      estado: "São Paulo",
      ibge: "3550308",
      ddd: "11",
    },
  ],
  [
    CEP_DA_CIDADE_TODA,
    {
      cep: "69945-000",
      logradouro: "",
      complemento: "",
      unidade: "",
      bairro: "",
      localidade: "Acrelândia",
      uf: "AC",
      estado: "Acre",
      ibge: "1200013",
      ddd: "68",
    },
  ],
]);

function createViacepFake() {
  let server;
  let state;

  reset();

  function reset() {
    state = { requests: [], failing: false };
  }

  function reply(response, statusCode, data) {
    response.writeHead(statusCode, { "Content-Type": "application/json" });
    response.end(JSON.stringify(data));
  }

  function handle(request, response) {
    const url = new URL(request.url, `http://localhost:${PORT}`);
    const path = url.pathname.slice(BASE_PATH.length);
    const [, zipCode] = path.match(/^\/(\d{8})\/json\/$/) || [];

    state.requests.push(path);

    if (state.failing) {
      response.writeHead(503, { "Content-Type": "text/html" });
      return response.end("<h1>Serviço indisponível</h1>");
    }

    // Como a de verdade: CEP mal escrito volta 400 em HTML, e CEP que não
    // existe volta 200 com { "erro": "true" }.
    if (!zipCode) {
      response.writeHead(400, { "Content-Type": "text/html" });
      return response.end("<h1>ViaCEP 400</h1>");
    }

    return reply(response, 200, ADDRESSES.get(zipCode) || { erro: "true" });
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

    // Os caminhos que o site pediu, como "/01310100/json/".
    requests() {
      return state.requests;
    },

    fail() {
      state.failing = true;
    },
  };
}

export default createViacepFake;
