import orchestrator from "tests/orchestrator.js";
import database from "infra/database.js";
import webserver from "infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

beforeEach(async () => {
  await orchestrator.deleteAllEmails();
});

const GENERIC_RESPONSE = {
  message:
    "Se houver uma conta com este email, enviamos um link para ele. Verifique sua caixa de entrada.",
};

function postPasswordReset(body) {
  return fetch(`${webserver.origin}/api/v1/password-resets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/v1/password-resets", () => {
  describe("Anonymous user", () => {
    test("With the email of an activated account", async () => {
      const createdUser = await orchestrator.createUser({
        email: "esqueci@gmail.com",
      });
      await orchestrator.activateUser(createdUser);

      const response = await postPasswordReset({
        email: "Esqueci@gmail.com",
      });

      expect(response.status).toBe(201);
      expect(await response.json()).toEqual(GENERIC_RESPONSE);

      const lastEmail = await orchestrator.getLastEmail();
      expect(lastEmail.sender).toBe("<contato@superpista.com>");
      expect(lastEmail.recipients[0]).toBe("<esqueci@gmail.com>");
      expect(lastEmail.subject).toBe("Crie uma senha nova na Super Pista");
      expect(lastEmail.text).toContain(createdUser.username);

      const token = orchestrator.extractPasswordResetToken(lastEmail.text);
      expect(lastEmail.text).toContain(
        `${webserver.origin}/recuperar-senha/${token}`,
      );

      // O banco guarda só o hash: o token do link não aparece em lugar nenhum
      // da tabela.
      const stored = await database.query({
        text: "SELECT * FROM password_reset_tokens WHERE user_id = $1",
        values: [createdUser.id],
      });
      expect(stored.rowCount).toBe(1);
      expect(JSON.stringify(stored.rows[0])).not.toContain(token);
    });

    test("With an email that has no account", async () => {
      const response = await postPasswordReset({
        email: "ninguem@gmail.com",
      });

      // A mesma resposta de quando a conta existe.
      expect(response.status).toBe(201);
      expect(await response.json()).toEqual(GENERIC_RESPONSE);

      expect(await orchestrator.getAllEmails()).toHaveLength(0);
    });

    test("With the email of an account not activated yet", async () => {
      const createdUser = await orchestrator.createUser({
        email: "naoativei@gmail.com",
      });
      await orchestrator.createOldActivationToken(createdUser);

      const response = await postPasswordReset({
        email: "naoativei@gmail.com",
      });

      expect(response.status).toBe(201);
      expect(await response.json()).toEqual(GENERIC_RESPONSE);

      // Sem ativar não dá para entrar, então o link útil é o de ativação.
      const lastEmail = await orchestrator.getLastEmail();
      expect(lastEmail.subject).toBe("Ative seu cadastro na Super Pista!");
      expect(lastEmail.text).toContain(`${webserver.origin}/cadastro/ativar/`);
    });

    test("Sends at most one email per account every few minutes", async () => {
      const createdUser = await orchestrator.createUser({
        email: "insistente@gmail.com",
      });
      await orchestrator.activateUser(createdUser);

      for (let attempt = 0; attempt < 3; attempt++) {
        const response = await postPasswordReset({
          email: "insistente@gmail.com",
        });

        expect(response.status).toBe(201);
        expect(await response.json()).toEqual(GENERIC_RESPONSE);
      }

      expect(await orchestrator.getAllEmails()).toHaveLength(1);
    });

    test("With a malformed email", async () => {
      const response = await postPasswordReset({ email: "nao-eh-email" });

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        name: "ValidationError",
        message: "Email inválido.",
        action: "Informe um endereço de email válido.",
        status_code: 400,
      });
    });

    test("Without body", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/password-resets`,
        { method: "POST" },
      );

      expect(response.status).toBe(400);
    });
  });
});
