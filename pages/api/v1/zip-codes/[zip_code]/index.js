import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import address from "models/address.js";

// O checkout pergunta o endereço aqui, e não direto à ViaCEP, para o IP de
// quem compra não sair do site: a ViaCEP só vê o CEP, vindo do servidor.
export default createRouter().get(getHandler).handler(controller.errorHandlers);

// O endereço de um CEP quase nunca muda, então a resposta fica uma semana no
// cache da CDN. Isso também poupa a ViaCEP, que bloqueia quem pergunta demais.
const CACHE_IN_SECONDS = 7 * 24 * 60 * 60;

async function getHandler(request, response) {
  const foundAddress = await address.findByZipCode(request.query.zip_code);

  response.setHeader(
    "Cache-Control",
    `public, max-age=0, s-maxage=${CACHE_IN_SECONDS}`,
  );
  return response.status(200).json(foundAddress);
}
