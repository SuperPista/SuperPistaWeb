const { Client } = require("pg");

// Libera a página de vendas (/vendas) para uma conta: dá a ela a feature
// `read:order:all`. O site não tem conta de administrador, então quem cuida da
// loja ganha a permissão por aqui, uma conta de cada vez, pelo e-mail.
//
// A conta precisa estar ativada: a ativação troca a lista inteira de features
// (models/activation.js) e apagaria a que fosse dada antes.
const FEATURE = "read:order:all";

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return { ca: process.env.POSTGRES_CA };
  }
  return process.env.NODE_ENV === "production" ? true : false;
}

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error(
      "🔴 Informe o e-mail da conta: ... grant-orders-access.js <e-mail>",
    );
    process.exit(1);
  }

  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  try {
    await client.connect();

    const found = await client.query({
      text: "SELECT id, username, features FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1;",
      values: [email],
    });
    const account = found.rows[0];

    if (!account) {
      console.error(`🔴 Nenhuma conta com o e-mail ${email}.`);
      process.exitCode = 1;
      return;
    }

    if (!account.features.includes("read:session")) {
      console.error(
        `🔴 A conta ${account.username} ainda não foi ativada. Ative pelo link do e-mail e rode de novo.`,
      );
      process.exitCode = 1;
      return;
    }

    if (account.features.includes(FEATURE)) {
      console.log(`🟢 A conta ${account.username} já vê as vendas.`);
      return;
    }

    await client.query({
      text: "UPDATE users SET features = array_append(features, $2), updated_at = timezone('utc', now()) WHERE id = $1;",
      values: [account.id, FEATURE],
    });

    console.log(
      `🟢 A conta ${account.username} agora vê as vendas em /vendas.`,
    );
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("🔴 Falha ao liberar as vendas:", error);
  process.exit(1);
});
