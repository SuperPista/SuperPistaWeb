import {
  LIMITE_DE_LETRAS,
  limparNome,
  nomeImprimivel,
} from "components/nome/regras.js";

describe("components/nome/regras.js", () => {
  describe(".limparNome()", () => {
    test.each([
      ["Celinha", "Celinha"],
      ["Ana Clara", "AnaClara"],
      ["João", "Joo"],
      ["Rafa2", "Rafa"],
      ["Maria-Eduarda", "MariaEduar"],
      ["", ""],
    ])("with %p", (digitado, esperado) => {
      expect(limparNome(digitado)).toBe(esperado);
    });
  });

  describe(".nomeImprimivel()", () => {
    test.each(["Celinha", "DANIEL", "a", "A".repeat(LIMITE_DE_LETRAS)])(
      "accepts %p",
      (nome) => {
        expect(nomeImprimivel(nome)).toBe(true);
      },
    );

    test.each([
      ["empty", ""],
      ["accent", "João"],
      ["space", "Ana Clara"],
      ["digit", "Rafa2"],
      ["too long", "A".repeat(LIMITE_DE_LETRAS + 1)],
    ])("rejects %s", (_rotulo, nome) => {
      expect(nomeImprimivel(nome)).toBe(false);
    });
  });
});
