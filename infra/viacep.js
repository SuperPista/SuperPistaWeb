import { ServiceError } from "infra/errors.js";

// Conversa com a ViaCEP, que é aberta e não pede chave. A URL só muda nos
// testes automáticos, que apontam para uma ViaCEP de mentira.
const API_URL = process.env.VIACEP_API_URL || "https://viacep.com.br/ws";

// Quem espera é quem está digitando o endereço no checkout. Passado disso, é
// melhor que a pessoa escreva o endereço à mão.
const TIMEOUT_IN_MILLISECONDS = 5000;

// Devolve o endereço no formato da ViaCEP, ou null quando ela não conhece o
// CEP. O CEP chega aqui já conferido, com os 8 números e nada mais.
async function findAddress(zipCode) {
  let response;
  try {
    response = await fetch(`${API_URL}/${zipCode}/json/`, {
      signal: AbortSignal.timeout(TIMEOUT_IN_MILLISECONDS),
    });
  } catch (error) {
    throw new ServiceError({
      message: "Não foi possível falar com a ViaCEP.",
      action: "Verifique se a ViaCEP está disponível.",
      cause: error,
    });
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // corpo que não é JSON cai no erro abaixo
  }

  // CEP que não existe volta 200, com { "erro": "true" } no corpo.
  if (response.ok && payload?.erro) {
    return null;
  }

  if (!response.ok || !payload) {
    console.error({
      name: "ViaCepRequestError",
      statusCode: response.status,
    });

    throw new ServiceError({
      message: "A ViaCEP não respondeu como esperado.",
      action: "Veja o status da ViaCEP no log do servidor.",
      context: { statusCode: response.status },
    });
  }

  return payload;
}

const viacep = {
  findAddress,
};

export default viacep;
