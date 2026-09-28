import orchestrator from "tests/orchestrator.js";
import user from "models/user.js";
import password from "models/password.js";
import passwordReset from "models/passwordReset.js";
import session from "models/session.js";
import webserver from "infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

beforeEach(async () => {
  await orchestrator.deleteAllEmails();
});

async function createActivatedUser(values) {
  const createdUser = await orchestrator.createUser(values);
  return await orchestrator.activateUser(createdUser);
}

function patchPasswordReset(token, body) {
  return fetch(`${webserver.origin}/api/v1/password-resets/${token}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("PATCH /api/v1/password-resets/[token]", () => {
  describe("Anonymous user", () => {
    test("With a valid token", async () => {
      const activatedUser = await createActivatedUser({
        password: "senhaantiga",
      });
      const resetToken = await passwordReset.create(activatedUser.id);

      const response = await patchPasswordReset(resetToken.token, {
        password: "senhanova123",
      });

      expect(response.status).toBe(200);
      expect(response.headers.get("cache-control")).toContain("no-store");

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: activatedUser.id,
        username: activatedUser.username,
        updated_at: responseBody.updated_at,
      });

      const userInDatabase = await user.findOneById(activatedUser.id);
      expect(
        await password.compare("senhanova123", userInDatabase.password),
      ).toBe(true);
      expect(
        await password.compare("senhaantiga", userInDatabase.password),
      ).toBe(false);
    });

    test("Ends every session of the account", async () => {
      const activatedUser = await createActivatedUser();
      const sessionA = await orchestrator.createSession(activatedUser);
      const sessionB = await orchestrator.createSession(activatedUser);
      const resetToken = await passwordReset.create(activatedUser.id);

      const response = await patchPasswordReset(resetToken.token, {
        password: "senhanova123",
      });

      expect(response.status).toBe(200);

      // Quem pediu o link pode estar tirando alguém da conta.
      for (const sessionObject of [sessionA, sessionB]) {
        await expect(
          session.findOneValidByToken(sessionObject.token),
        ).rejects.toThrow();
      }
    });

    test("Sends the password changed notice", async () => {
      const activatedUser = await createActivatedUser();
      const resetToken = await passwordReset.create(activatedUser.id);

      await patchPasswordReset(resetToken.token, { password: "senhanova123" });

      const lastEmail = await orchestrator.getLastEmail();
      expect(lastEmail.recipients[0]).toBe(`<${activatedUser.email}>`);
      expect(lastEmail.subject).toBe(
        "A senha da sua conta Super Pista foi trocada",
      );
    });

    test("Works only once, and voids older links too", async () => {
      const activatedUser = await createActivatedUser();
      const olderToken = await passwordReset.create(activatedUser.id);
      const usedToken = await passwordReset.create(activatedUser.id);

      const firstResponse = await patchPasswordReset(usedToken.token, {
        password: "senhanova123",
      });
      expect(firstResponse.status).toBe(200);

      for (const token of [usedToken.token, olderToken.token]) {
        const response = await patchPasswordReset(token, {
          password: "outrasenha123",
        });

        expect(response.status).toBe(404);
        expect(await response.json()).toEqual({
          name: "NotFoundError",
          message:
            "O link para criar uma senha nova não foi encontrado ou expirou.",
          action: "Peça um novo link em Esqueci minha senha.",
          status_code: 404,
        });
      }
    });

    test("With an unknown token", async () => {
      const response = await patchPasswordReset("token-que-nao-existe", {
        password: "senhanova123",
      });

      expect(response.status).toBe(404);
    });

    test("With a password shorter than 8 characters keeps the link", async () => {
      const activatedUser = await createActivatedUser();
      const resetToken = await passwordReset.create(activatedUser.id);

      const response = await patchPasswordReset(resetToken.token, {
        password: "curta",
      });

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        name: "ValidationError",
        message: "A senha deve ter no mínimo 8 caracteres.",
        action: "Escolha uma senha com pelo menos 8 caracteres.",
        status_code: 400,
      });

      // O erro de digitação não gasta o link.
      const retryResponse = await patchPasswordReset(resetToken.token, {
        password: "senhacomprida",
      });
      expect(retryResponse.status).toBe(200);
    });
  });
});
