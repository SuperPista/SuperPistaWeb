import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
import activation from "models/activation.js";
import passwordReset from "models/passwordReset.js";
import auditLog from "models/auditLog.js";
import { ValidationError } from "infra/errors.js";

// A mesma resposta para conta nova e para email que já tem conta: se fossem
// diferentes, o cadastro diria a qualquer um quem é cliente da Super Pista.
const GENERIC_SIGNUP_RESPONSE = {
  message:
    "Enviamos um email para o endereço informado. Abra o link dele para continuar.",
};

const DUPLICATE_EMAIL_MESSAGE = "O email informado já está sendo utilizado.";

export default createRouter()
  .use(controller.injectAnonymousOrUser)
  .post(controller.canRequest("create:user"), postHandler)
  .handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;
  const ip = controller.getClientIp(request);

  let newUser;
  try {
    newUser = await user.create(userInputValues);
  } catch (error) {
    if (
      error instanceof ValidationError &&
      error.message === DUPLICATE_EMAIL_MESSAGE
    ) {
      await handleDuplicateEmail(userInputValues.email, ip);
      return response.status(201).json(GENERIC_SIGNUP_RESPONSE);
    }
    throw error;
  }

  const activationToken = await activation.create(newUser.id);
  await activation.sendEmailToUser(newUser, activationToken);

  await auditLog.record({
    action: "user.created",
    actorUserId: newUser.id,
    targetUserId: newUser.id,
    ip,
  });

  return response.status(201).json(GENERIC_SIGNUP_RESPONSE);
}

// Quem cadastra de novo um email que já tem conta recebe nele o caminho de
// volta: link de ativação se a conta não foi ativada, link para criar uma
// senha nova se foi. Qualquer falha aqui fica em silêncio, porque um erro só
// neste caminho revelaria que o email já tem conta.
async function handleDuplicateEmail(email, ip) {
  try {
    const existingUser = await user.findOneByEmail(email);
    await passwordReset.sendAccessEmailToUser(existingUser, {
      reason: "signup",
    });
    await auditLog.record({
      action: "user.signup_duplicate_email",
      targetUserId: existingUser.id,
      ip,
    });
  } catch (error) {
    console.error({
      name: "DuplicateSignupEmailError",
      underlyingErrorName: error?.name,
    });
  }
}
