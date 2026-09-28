import crypto from "node:crypto";
import authorization from "models/authorization.js";
import activation from "models/activation.js";
import email from "infra/email.js";
import database from "infra/database.js";
import webserver from "infra/webserver.js";
import { NotFoundError } from "infra/errors.js";

const EXPIRATION_IN_MILLISECONDS = 60 * 30 * 1000; // 30 minutes
const RESEND_INTERVAL_IN_MILLISECONDS = 60 * 5 * 1000; // 5 minutes

// O token só existe no link do email. O banco guarda o hash dele, então quem
// lê a tabela não consegue trocar a senha de ninguém.
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function create(userId) {
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newResetToken = await runInsertQuery(
    hashToken(token),
    userId,
    expiresAt,
  );
  return { ...newResetToken, token };

  async function runInsertQuery(tokenHash, userId, expiresAt) {
    const results = await database.query({
      text: `
        INSERT INTO
          password_reset_tokens (token_hash, user_id, expires_at)
        VALUES
          ($1, $2, $3)
        RETURNING
          id, user_id, expires_at, created_at
      ;`,
      values: [tokenHash, userId, expiresAt],
    });

    return results.rows[0];
  }
}

async function findOneValidByToken(token) {
  if (typeof token !== "string" || token.length === 0) {
    throwNotFound();
  }

  const results = await database.query({
    text: `
      SELECT
        *
      FROM
        password_reset_tokens
      WHERE
        token_hash = $1
        AND expires_at > NOW()
        AND used_at IS NULL
      LIMIT
        1
    ;`,
    values: [hashToken(token)],
  });

  if (results.rowCount === 0) {
    throwNotFound();
  }

  return results.rows[0];

  function throwNotFound() {
    throw new NotFoundError({
      message:
        "O link para criar uma senha nova não foi encontrado ou expirou.",
      action: "Peça um novo link em Esqueci minha senha.",
    });
  }
}

// Depois da troca, nenhum link pendente da conta pode ser usado de novo, nem o
// que acabou de servir nem outro pedido antes dele.
async function markAllAsUsedByUserId(userId) {
  await database.query({
    text: `
      UPDATE
        password_reset_tokens
      SET
        used_at = timezone('utc', now()),
        updated_at = timezone('utc', now())
      WHERE
        user_id = $1
        AND used_at IS NULL
    ;`,
    values: [userId],
  });
}

async function wasSentRecentlyToUser(userId) {
  const results = await database.query({
    text: `
      SELECT
        1
      FROM
        password_reset_tokens
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

/*
 * Ponto único para mandar a alguém um jeito de voltar à conta, usado por
 * Esqueci minha senha (`reason: "recovery"`) e pelo cadastro repetido com um
 * email que já tem conta (`reason: "signup"`).
 *
 * Conta ainda não ativada recebe um link de ativação novo, porque o primeiro
 * vence em 15 minutos e, sem isto, quem o perdesse ficava sem saída: o email
 * já estava em uso e não dava para cadastrar de novo. Conta ativada recebe o
 * link para criar uma senha nova. Conta que não pode mais entrar não recebe
 * nada.
 *
 * Quem pede digita só um email, e qualquer um pode digitar o email dos
 * outros. Por isso sai no máximo um email a cada RESEND_INTERVAL por conta; os
 * pedidos no meio do intervalo terminam em silêncio, com a mesma resposta.
 */
async function sendAccessEmailToUser(user, { reason }) {
  if (authorization.can(user, "read:activation_token")) {
    if (await activation.wasSentRecentlyToUser(user.id)) {
      return;
    }

    const activationToken = await activation.create(user.id);
    await activation.sendEmailToUser(user, activationToken);
    return;
  }

  if (!authorization.can(user, "create:session")) {
    return;
  }

  if (await wasSentRecentlyToUser(user.id)) {
    return;
  }

  const resetToken = await create(user.id);

  if (reason === "signup") {
    await sendDuplicateSignupEmailToUser(user, resetToken.token);
    return;
  }

  await sendEmailToUser(user, resetToken.token);
}

async function sendEmailToUser(user, token) {
  await email.send({
    from: "Super Pista <contato@superpista.com>",
    to: user.email,
    subject: "Crie uma senha nova na Super Pista",
    text: `${user.username}, recebemos um pedido para trocar a senha da sua conta Super Pista.

Para criar uma senha nova, abra o link abaixo. Ele vale por 30 minutos e funciona uma vez só:

${webserver.origin}/recuperar-senha/${token}

Se não foi você que pediu, pode ignorar este email. Sua senha continua a mesma.

Atenciosamente,
Equipe Super Pista`,
  });
}

async function sendDuplicateSignupEmailToUser(user, token) {
  await email.send({
    from: "Super Pista <contato@superpista.com>",
    to: user.email,
    subject: "Você já tem uma conta na Super Pista",
    text: `${user.username}, alguém tentou criar uma conta na Super Pista com este email, mas ele já está na sua conta.

Se foi você, é só entrar com seu email e sua senha em ${webserver.origin}/login.

Esqueceu a senha? Crie uma nova por este link. Ele vale por 30 minutos e funciona uma vez só:

${webserver.origin}/recuperar-senha/${token}

Se não foi você, pode ignorar este email. Ninguém entra na sua conta sem a sua senha.

Atenciosamente,
Equipe Super Pista`,
  });
}

const passwordReset = {
  create,
  findOneValidByToken,
  markAllAsUsedByUserId,
  wasSentRecentlyToUser,
  sendAccessEmailToUser,
  EXPIRATION_IN_MILLISECONDS,
  RESEND_INTERVAL_IN_MILLISECONDS,
};

export default passwordReset;
