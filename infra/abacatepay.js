import crypto from "node:crypto";
import { ServiceError } from "infra/errors.js";

// Conversa com a API v2 da AbacatePay. O ambiente (teste ou produção) vem da
// chave, não da URL: a chave do Dev mode simula os pagamentos. A URL só muda
// nos testes automáticos, que apontam para uma AbacatePay de mentira.
const API_URL =
  process.env.ABACATEPAY_API_URL || "https://api.abacatepay.com/v2";

// Cada chamada espera no máximo isso: o pedido faz até três rodadas de
// chamadas antes de responder, e a função do deploy tem limite de tempo.
const TIMEOUT_IN_MILLISECONDS = 8000;

// Chave publicada na documentação da AbacatePay, com que ela assina o corpo
// de cada webhook (HMAC-SHA256 em base64). Não é segredo e é a mesma para
// todas as lojas: a assinatura só garante que o corpo chegou inteiro. Quem
// prova que o webhook veio da AbacatePay é o secret na URL.
const WEBHOOK_SIGNATURE_KEY =
  "t9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9";

async function request(method, path, { query, body, allowNotFound } = {}) {
  const apiKey = process.env.ABACATEPAY_API_KEY;

  if (!apiKey) {
    throw new ServiceError({
      message: "O pagamento não está configurado.",
      action: "Defina ABACATEPAY_API_KEY no ambiente.",
      context: { method, path },
    });
  }

  const url = new URL(`${API_URL}${path}`);
  for (const [name, value] of Object.entries(query || {})) {
    url.searchParams.set(name, value);
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(TIMEOUT_IN_MILLISECONDS),
    });
  } catch (error) {
    throw new ServiceError({
      message: "Não foi possível falar com a AbacatePay.",
      action: "Verifique se a AbacatePay está disponível.",
      cause: error,
      context: { method, path },
    });
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // corpo que não é JSON cai no erro abaixo
  }

  // A AbacatePay responde 400, e não 404, quando não acha o que foi pedido
  // ("Product not found"). Só a mensagem separa isso de um campo recusado.
  const notFound =
    [400, 404].includes(response.status) &&
    /not found/i.test(String(payload?.error));

  if (notFound && allowNotFound) {
    return null;
  }

  if (!response.ok || !payload?.success) {
    // A mensagem da AbacatePay diz o que faltou (permissão da chave, campo
    // recusado) e não traz dados do cliente, então vai inteira para o log.
    console.error({
      name: "AbacatePayRequestError",
      method,
      path,
      statusCode: response.status,
      error: payload?.error,
    });

    throw new ServiceError({
      message: "A AbacatePay recusou o pedido.",
      action: "Veja o erro da AbacatePay no log do servidor.",
      context: { method, path, statusCode: response.status },
    });
  }

  return payload.data;
}

function getProduct(id) {
  return request("GET", "/products/get", {
    query: { id },
    allowNotFound: true,
  });
}

// Cliente é único por CPF: com um CPF que já existe, a AbacatePay devolve o
// cadastro antigo em vez de criar outro.
function createCustomer(customer) {
  return request("POST", "/customers/create", { body: customer });
}

function createCheckout(checkout) {
  return request("POST", "/checkouts/create", { body: checkout });
}

function getCheckout(id) {
  return request("GET", "/checkouts/get", { query: { id } });
}

// Compara sem vazar pelo tempo de resposta quantos caracteres bateram. O hash
// deixa os dois lados do mesmo tamanho, que o timingSafeEqual exige.
function safeEqual(received, expected) {
  const hash = (text) => crypto.createHash("sha256").update(text).digest();

  return crypto.timingSafeEqual(hash(received), hash(expected));
}

// O secret cadastrado no webhook chega em cada entrega no parâmetro
// `webhookSecret` da URL. Sem secret configurado, nenhum webhook passa.
function isWebhookSecretValid(secret) {
  const expected = process.env.ABACATEPAY_WEBHOOK_SECRET;

  if (!expected || typeof secret !== "string") {
    return false;
  }

  return safeEqual(secret, expected);
}

function isWebhookSignatureValid(rawBody, signature) {
  if (typeof signature !== "string") {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", WEBHOOK_SIGNATURE_KEY)
    .update(rawBody, "utf8")
    .digest("base64");

  return safeEqual(signature, expected);
}

const abacatepay = {
  getProduct,
  createCustomer,
  createCheckout,
  getCheckout,
  isWebhookSecretValid,
  isWebhookSignatureValid,
};

export default abacatepay;
