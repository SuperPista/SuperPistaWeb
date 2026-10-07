import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
import passwordReset from "models/passwordReset.js";
import auditLog from "models/auditLog.js";
import emailValidation from "infra/emailValidation.js";
import { NotFoundError } from "infra/errors.js";

// A mesma resposta exista a conta ou não: se fossem diferentes, esta rota
// diria a qualquer um quais emails são clientes da Super Pista.
const GENERIC_RESPONSE = {
  message:
    "Se houver uma conta com este email, enviamos um link para ele. Verifique sua caixa de entrada.",
};

export default createRouter()
  .use(controller.injectAnonymousOrUser)
  // `create:session` é o que alguém fora da conta tem para voltar a ela: o
  // visitante anônimo tem, e quem está logado também.
  .post(controller.canRequest("create:session"), postHandler)
  .handler(controller.errorHandlers);

async function postHandler(request, response) {
  const { email } = request.body || {};
  const normalizedEmail = emailValidation.validateFormat(email);
  const ip = controller.getClientIp(request);

  let existingUser;
  try {
    existingUser = await user.findOneByEmail(normalizedEmail);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return response.status(201).json(GENERIC_RESPONSE);
    }
    throw error;
  }

  // Uma falha no envio também termina na resposta genérica: um erro que só
  // aparece quando a conta existe revelaria a conta do mesmo jeito.
  try {
    await passwordReset.sendAccessEmailToUser(existingUser, {
      reason: "recovery",
    });
  } catch (error) {
    console.error({
      name: "PasswordResetEmailError",
      underlyingErrorName: error?.name,
    });
  }

  await auditLog.record({
    action: "password_reset.requested",
    targetUserId: existingUser.id,
    ip,
  });

  return response.status(201).json(GENERIC_RESPONSE);
}
