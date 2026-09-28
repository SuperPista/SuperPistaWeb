import authorization from "models/authorization.js";
import user from "models/user.js";
import email from "infra/email.js";
import database from "infra/database.js";
import webserver from "infra/webserver.js";
import { NotFoundError, ForbiddenError } from "infra/errors.js";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000; // 15 minutes
const RESEND_INTERVAL_IN_MILLISECONDS = 60 * 5 * 1000; // 5 minutes

async function findOneValidById(tokenId) {
  const activationTokenObject = await runSelectQuery(tokenId);

  return activationTokenObject;

  async function runSelectQuery(tokenId) {
    const results = await database.query({
      text: `
       SELECT
         *
       FROM
         user_activation_tokens
       WHERE
         id = $1
         AND expires_at > NOW()
         AND used_at IS NULL
       LIMIT
         1
     ;`,
      values: [tokenId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message:
          "O token de ativação utilizado não foi encontrado no sistema ou expirou.",
        action:
          "Peça um novo link em Esqueci minha senha. Se a conta ainda não foi ativada, o link que chega é de ativação.",
      });
    }

    return results.rows[0];
  }
}

async function create(userId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newToken = await runInsertQuery(userId, expiresAt);
  return newToken;

  async function runInsertQuery(userId, expiresAt) {
    const results = await database.query({
      text: `
        INSERT INTO
          user_activation_tokens (user_id, expires_at)
        VALUES
          ($1, $2)
        RETURNING
          *
      ;`,
      values: [userId, expiresAt],
    });

    return results.rows[0];
  }
}

async function markTokenAsUsed(activationTokenId) {
  const usedActivationToken = await runUpdateQuery(activationTokenId);
  return usedActivationToken;

  async function runUpdateQuery(activationTokenId) {
    const results = await database.query({
      text: `
       UPDATE
         user_activation_tokens
       SET
         used_at = timezone('utc', now()),
         updated_at = timezone('utc', now())
       WHERE
         id = $1
       RETURNING
         *
     `,
      values: [activationTokenId],
    });

    return results.rows[0];
  }
}

async function activateUserByUserId(userId) {
  const userToActivate = await user.findOneById(userId);

  if (!authorization.can(userToActivate, "read:activation_token")) {
    throw new ForbiddenError({
      message: "Você não pode mais utilizar tokens de ativação.",
      action: "Entre em contato com o suporte.",
    });
  }

  const activatedUser = await user.setFeatures(userId, [
    "create:session",
    "read:session",
    "update:user",
    "delete:user",
  ]);
  return activatedUser;
}

// Diz se um link de ativação saiu há pouco para esta conta. Quem pede um link
// novo (pelo cadastro repetido ou por Esqueci minha senha) digita só um email,
// e qualquer um pode digitar o email dos outros: sem esta checagem, cada pedido
// virava mais um email na caixa de alguém.
async function wasSentRecentlyToUser(userId) {
  const results = await database.query({
    text: `
      SELECT
        1
      FROM
        user_activation_tokens
      WHERE
        user_id = $1
        AND created_at > NOW() - make_interval(secs => $2)
      LIMIT
        1
    ;`,
    values: [userId, RESEND_INTERVAL_IN_MILLISECONDS / 1000],
  });

  return results.rowCount > 0;
}

async function sendEmailToUser(user, activationToken) {
  await email.send({
    from: "Super Pista <contato@superpista.com>",
    to: user.email,
    subject: "Ative seu cadastro na Super Pista!",
    text: `${user.username}, clique no link abaixo para ativar seu cadastro na Super Pista:

${webserver.origin}/cadastro/ativar/${activationToken.id}

Atenciosamente,
Equipe Super Pista`,
  });
}

const activation = {
  findOneValidById,
  create,
  markTokenAsUsed,
  activateUserByUserId,
  wasSentRecentlyToUser,
  sendEmailToUser,
  EXPIRATION_IN_MILLISECONDS,
  RESEND_INTERVAL_IN_MILLISECONDS,
};

export default activation;
