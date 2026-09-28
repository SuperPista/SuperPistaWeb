import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
import password from "models/password.js";
import passwordReset from "models/passwordReset.js";
import session from "models/session.js";
import authorization from "models/authorization.js";
import auditLog from "models/auditLog.js";
import { ForbiddenError } from "infra/errors.js";

export default createRouter()
  .use(controller.injectAnonymousOrUser)
  .patch(controller.canRequest("create:session"), patchHandler)
  .handler(controller.errorHandlers);

async function patchHandler(request, response) {
  const token = request.query.token;
  const { password: newPassword } = request.body || {};

  const validResetToken = await passwordReset.findOneValidByToken(token);
  const targetUser = await user.findOneById(validResetToken.user_id);

  // O link só sai para conta que pode entrar, mas ela pode ter perdido esse
  // direito depois do envio.
  if (!authorization.can(targetUser, "create:session")) {
    throw new ForbiddenError({
      message: "Esta conta não pode entrar no momento.",
      action: "Contate o suporte caso você acredite que isto seja um erro.",
    });
  }

  // Senha fora das regras cai aqui com 400, antes de gastar o link: a pessoa
  // corrige e tenta de novo com o mesmo email.
  const updatedUser = await user.updatePasswordById(targetUser.id, newPassword);

  await passwordReset.markAllAsUsedByUserId(updatedUser.id);

  // Quem pediu o link pode estar justamente tirando alguém da conta: todas as
  // sessões caem, no site e no aplicativo.
  await session.expireAllByUserId(updatedUser.id);

  await auditLog.record({
    action: "user.password_reset",
    actorUserId: updatedUser.id,
    targetUserId: updatedUser.id,
    ip: controller.getClientIp(request),
  });

  try {
    await password.sendChangedNoticeToUser(updatedUser);
  } catch (error) {
    console.error({
      name: "PasswordChangedNoticeError",
      underlyingErrorName: error?.name,
    });
  }

  response.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );
  return response.status(200).json({
    id: updatedUser.id,
    username: updatedUser.username,
    updated_at: updatedUser.updated_at,
  });
}
