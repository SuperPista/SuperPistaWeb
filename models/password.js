import bcryptjs from "bcryptjs";
import email from "infra/email.js";

async function hash(password) {
  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(password, rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providedPassword, storedPassword) {
  return await bcryptjs.compare(providedPassword, storedPassword);
}

async function sendChangedNoticeToUser(user) {
  await email.send({
    from: "Super Pista <contato@superpista.com>",
    to: user.email,
    subject: "A senha da sua conta Super Pista foi trocada",
    text: `${user.username}, a senha da sua conta Super Pista acabou de ser trocada.

As outras sessões abertas com esta conta foram encerradas, no site e no aplicativo.

Se foi você, não precisa fazer nada.

Se não foi você, alguém tem acesso à sua conta. Responda este email o quanto antes para a gente ajudar.

Atenciosamente,
Equipe Super Pista`,
  });
}

const password = {
  hash,
  compare,
  sendChangedNoticeToUser,
};

export default password;
