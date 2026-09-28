import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
import session from "models/session.js";
import auditLog from "models/auditLog.js";
import database from "infra/database.js";

export default createRouter()
  .use(controller.injectAnonymousOrUser)
  .get(controller.canRequest("read:session"), getHandler)
  .handler(controller.errorHandlers);

// Tudo o que o banco guarda sobre a conta, para a pessoa baixar (LGPD, art.
// 18). Hash de senha e tokens ficam de fora: não são dados sobre ela, e o
// arquivo pode acabar num lugar menos protegido que o banco.
async function getHandler(request, response) {
  const sessionToken = request.cookies.session_id;
  const sessionObject = await session.findOneValidByToken(sessionToken);
  const userFound = await user.findOneById(sessionObject.user_id);

  const sessionsResult = await database.query({
    text: `
      SELECT
        created_at,
        expires_at
      FROM
        sessions
      WHERE
        user_id = $1
      ORDER BY
        created_at DESC
    ;`,
    values: [userFound.id],
  });

  const activationTokensResult = await database.query({
    text: `
      SELECT
        used_at,
        expires_at,
        created_at
      FROM
        user_activation_tokens
      WHERE
        user_id = $1
      ORDER BY
        created_at DESC
    ;`,
    values: [userFound.id],
  });

  const passwordResetsResult = await database.query({
    text: `
      SELECT
        used_at,
        expires_at,
        created_at
      FROM
        password_reset_tokens
      WHERE
        user_id = $1
      ORDER BY
        created_at DESC
    ;`,
    values: [userFound.id],
  });

  // O registro de ações guarda o IP de cada acesso, e IP é dado pessoal.
  const auditLogsResult = await database.query({
    text: `
      SELECT
        action,
        ip,
        created_at
      FROM
        audit_logs
      WHERE
        actor_user_id = $1
        OR target_user_id = $1
      ORDER BY
        created_at DESC
    ;`,
    values: [userFound.id],
  });

  const exportData = {
    _meta: {
      exported_at: new Date().toISOString(),
      format_version: "1.0",
      description: "Exportação dos dados pessoais da conta Super Pista.",
    },
    user: {
      username: userFound.username,
      email: userFound.email,
      privacy_accepted_at: userFound.privacy_accepted_at,
      created_at: userFound.created_at,
    },
    sessions: sessionsResult.rows,
    activation_tokens: activationTokensResult.rows,
    password_resets: passwordResetsResult.rows,
    access_logs: auditLogsResult.rows,
  };

  const today = new Date().toISOString().split("T")[0];
  // O username não tem formato garantido, e aspas ou acentos quebrariam o
  // cabeçalho Content-Disposition.
  const safeUsername = userFound.username.replace(/[^A-Za-z0-9_-]/g, "");
  const filename = `superpista-dados-${safeUsername}-${today}.json`;

  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}"`,
  );
  response.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );

  await auditLog.record({
    action: "user.exported",
    actorUserId: userFound.id,
    targetUserId: userFound.id,
    ip: controller.getClientIp(request),
  });

  return response.status(200).json(exportData);
}
