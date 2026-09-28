import orchestrator from "tests/orchestrator.js";
import user from "models/user.js";
import password from "models/password.js";
import webserver from "infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

const GENERIC_SIGNUP_RESPONSE = {
  message:
    "Enviamos um email para o endereço informado. Abra o link dele para continuar.",
};

function postUser(body) {
  return fetch(`${webserver.origin}/api/v1/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      await orchestrator.deleteAllEmails();

      const response = await postUser({
        username: "superpistauser",
        email: "contato@gmail.com",
        password: "senha12345",
        privacy_accepted: true,
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toEqual(GENERIC_SIGNUP_RESPONSE);

      const userInDatabase = await user.findOneByUsername("superpistauser");
      expect(userInDatabase.email).toBe("contato@gmail.com");
      expect(userInDatabase.features).toEqual(["read:activation_token"]);
      expect(Date.parse(userInDatabase.privacy_accepted_at)).not.toBeNaN();

      const correctPasswordMatch = await password.compare(
        "senha12345",
        userInDatabase.password,
      );

      const incorrectPasswordMatch = await password.compare(
        "SenhaErrada",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);

      const lastEmail = await orchestrator.getLastEmail();
      expect(lastEmail.subject).toBe("Ative seu cadastro na Super Pista!");
    });

    describe("With duplicated `email`", () => {
      test("Of an account not activated yet", async () => {
        const response1 = await postUser({
          username: "emailduplicado1",
          email: "duplicado@gmail.com",
          password: "senha12345",
          privacy_accepted: true,
        });

        expect(response1.status).toBe(201);

        const response2 = await postUser({
          username: "emailduplicado2",
          email: "Duplicado@gmail.com",
          password: "outrasenha",
          privacy_accepted: true,
        });

        // A mesma resposta de uma conta nova: o cadastro não revela quem já
        // tem conta.
        expect(response2.status).toBe(201);
        expect(await response2.json()).toEqual(GENERIC_SIGNUP_RESPONSE);

        // Nenhuma conta nova, e a original continua com a senha dela.
        const userInDatabase = await user.findOneByEmail("duplicado@gmail.com");
        expect(userInDatabase.username).toBe("emailduplicado1");
        const originalPasswordIntact = await password.compare(
          "senha12345",
          userInDatabase.password,
        );
        expect(originalPasswordIntact).toBe(true);
      });

      test("Of an account not activated, after the first link got old", async () => {
        const createdUser = await orchestrator.createUser({
          email: "ativacaovencida@gmail.com",
        });
        await orchestrator.createOldActivationToken(createdUser);
        await orchestrator.deleteAllEmails();

        const response = await postUser({
          username: "outronome",
          email: "ativacaovencida@gmail.com",
          password: "outrasenha",
          privacy_accepted: true,
        });

        expect(response.status).toBe(201);
        expect(await response.json()).toEqual(GENERIC_SIGNUP_RESPONSE);

        // Sem este email, quem perdeu o primeiro link ficava sem saída: o
        // email já estava em uso e não dava para cadastrar de novo.
        const lastEmail = await orchestrator.getLastEmail();
        expect(lastEmail.recipients[0]).toBe("<ativacaovencida@gmail.com>");
        expect(lastEmail.subject).toBe("Ative seu cadastro na Super Pista!");
        expect(lastEmail.text).toContain(createdUser.username);
        expect(lastEmail.text).toContain(
          `${webserver.origin}/cadastro/ativar/`,
        );
      });

      test("Of an activated account", async () => {
        const createdUser = await orchestrator.createUser({
          email: "jatemconta@gmail.com",
        });
        await orchestrator.activateUser(createdUser);
        await orchestrator.deleteAllEmails();

        const response = await postUser({
          username: "outronome2",
          email: "jatemconta@gmail.com",
          password: "outrasenha",
          privacy_accepted: true,
        });

        expect(response.status).toBe(201);
        expect(await response.json()).toEqual(GENERIC_SIGNUP_RESPONSE);

        const lastEmail = await orchestrator.getLastEmail();
        expect(lastEmail.recipients[0]).toBe("<jatemconta@gmail.com>");
        expect(lastEmail.subject).toBe("Você já tem uma conta na Super Pista");
        expect(lastEmail.text).toContain(`${webserver.origin}/login`);
        expect(
          orchestrator.extractPasswordResetToken(lastEmail.text),
        ).not.toBeNull();
      });

      test("Sends at most one email per account every few minutes", async () => {
        const createdUser = await orchestrator.createUser({
          email: "variasvezes@gmail.com",
        });
        await orchestrator.activateUser(createdUser);
        await orchestrator.deleteAllEmails();

        for (const attempt of [1, 2, 3]) {
          const response = await postUser({
            username: `tentativa${attempt}`,
            email: "variasvezes@gmail.com",
            password: "outrasenha",
            privacy_accepted: true,
          });

          expect(response.status).toBe(201);
          expect(await response.json()).toEqual(GENERIC_SIGNUP_RESPONSE);
        }

        // Qualquer um pode digitar o email dos outros: sem este teto, cada
        // cadastro repetido virava mais um email na caixa do dono.
        const emails = await orchestrator.getAllEmails();
        expect(emails).toHaveLength(1);
      });
    });

    test("Without `username`", async () => {
      const response = await postUser({
        email: "semnome@gmail.com",
        password: "senha12345",
        privacy_accepted: true,
      });

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        name: "ValidationError",
        message: "É necessário informar um nome de usuário.",
        action: "Preencha o nome de usuário e tente novamente.",
        status_code: 400,
      });
    });

    test("With `username` longer than 30 characters", async () => {
      const response = await postUser({
        username: "a".repeat(31),
        email: "nomelongo@gmail.com",
        password: "senha12345",
        privacy_accepted: true,
      });

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        name: "ValidationError",
        message: "O nome de usuário deve ter no máximo 30 caracteres.",
        action: "Escolha um nome de usuário mais curto.",
        status_code: 400,
      });
    });

    test("With password longer than 72 characters", async () => {
      const response = await postUser({
        username: "senhalonga",
        email: "senhalonga@gmail.com",
        password: "a".repeat(73),
        privacy_accepted: true,
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "A senha deve ter no máximo 72 caracteres.",
        action: "Reduza o tamanho da senha.",
        status_code: 400,
      });
    });

    test("With password shorter than 8 characters", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "senhacurta",
          email: "senhacurta@gmail.com",
          password: "abc123",
          privacy_accepted: true,
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "A senha deve ter no mínimo 8 caracteres.",
        action: "Escolha uma senha com pelo menos 8 caracteres.",
        status_code: 400,
      });
    });

    test("With malformed `email`", async () => {
      // Formato inválido é rejeitado antes de qualquer consulta de DNS, então
      // este caso é determinístico. A checagem de MX do domínio é coberta pelo
      // unit test de infra/emailValidation.
      const response = await fetch(`${webserver.origin}/api/v1/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "emailmalformado",
          email: "nao-eh-um-email",
          password: "senha12345",
          privacy_accepted: true,
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Email inválido.",
        action: "Informe um endereço de email válido.",
        status_code: 400,
      });
    });

    test("Without privacy acceptance", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "semaceite",
          email: "semaceite@gmail.com",
          password: "senha12345",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "É necessário aceitar os Termos de Uso e a Política de Privacidade para criar a conta.",
        action: "Marque a opção de aceite e tente novamente.",
        status_code: 400,
      });
    });

    test("With duplicated `username`", async () => {
      const response1 = await fetch(`${webserver.origin}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameduplicado",
          email: "usernameduplicado1@gmail.com",
          password: "senha12345",
          privacy_accepted: true,
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch(`${webserver.origin}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "UsernameDuplicado",
          email: "usernameduplicado2@gmail.com",
          password: "senha12345",
          privacy_accepted: true,
        }),
      });

      expect(response2.status).toBe(400);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar esta operação.",
        status_code: 400,
      });
    });
  });

  describe("Default user", () => {
    test("With unique and valid data", async () => {
      const user1 = await orchestrator.createUser();
      await orchestrator.activateUser(user1);
      const user1SessionObject = await orchestrator.createSession(user1);

      const user2Response = await fetch(`${webserver.origin}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${user1SessionObject.token}`,
        },
        body: JSON.stringify({
          username: "usuariologado",
          email: "usuariologado@gmail.com",
          password: "senha12345",
          privacy_accepted: true,
        }),
      });

      expect(user2Response.status).toBe(403);

      const user2ResponseBody = await user2Response.json();

      expect(user2ResponseBody).toEqual({
        name: "ForbiddenError",
        message: "Você não possui permissão para executar esta ação.",
        action: 'Verifique se o seu usuário possui a feature "create:user"',
        status_code: 403,
      });
    });
  });
});
