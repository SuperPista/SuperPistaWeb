import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import abacatepay from "infra/abacatepay.js";
import payment from "models/payment.js";
import { UnauthorizedError, ValidationError } from "infra/errors.js";

// A assinatura do webhook é calculada sobre o corpo exatamente como chegou,
// então o Next não pode transformá-lo em objeto antes.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Um evento da AbacatePay tem poucos KB. Isto só barra corpo gigante.
const MAX_BODY_IN_BYTES = 1024 * 1024;

export default createRouter()
  .post(postHandler)
  .handler(controller.errorHandlers);

// Respostas 4xx encerram a entrega; 5xx fazem a AbacatePay tentar de novo,
// por até 18 horas. Por isso só uma falha nossa (banco fora do ar) responde
// 5xx, e o 200 só sai depois de o evento ser gravado.
async function postHandler(request, response) {
  // O secret vem na URL e é conferido antes de ler o corpo: quem não sabe o
  // secret não faz o servidor ler nada.
  if (!abacatepay.isWebhookSecretValid(request.query.webhookSecret)) {
    throw unauthorized();
  }

  const rawBody = await readRawBody(request);

  if (
    !abacatepay.isWebhookSignatureValid(
      rawBody,
      request.headers["x-webhook-signature"],
    )
  ) {
    throw unauthorized();
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    throw new ValidationError({
      message: "O corpo do webhook não é um JSON.",
    });
  }

  await payment.handleWebhookEvent(event);

  return response.status(200).json({ received: true });
}

function unauthorized() {
  return new UnauthorizedError({
    message: "Webhook sem secret ou assinatura válidos.",
    action: "Confira o secret cadastrado no webhook da AbacatePay.",
  });
}

async function readRawBody(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;

    if (size > MAX_BODY_IN_BYTES) {
      throw new ValidationError({
        message: "O corpo do webhook é grande demais.",
      });
    }

    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}
