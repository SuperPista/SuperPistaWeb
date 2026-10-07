import { artigoDoNome } from "components/nome/artigo.js";

describe("components/nome/artigo.js", () => {
  describe(".artigoDoNome()", () => {
    test.each([
      "Helena",
      "Valentina",
      "Celinha",
      "Amanda",
      "Vitoria",
      "Heloisa",
      "Duda",
    ])("with feminine name ending in A: %s", (nome) => {
      expect(artigoDoNome(nome)).toBe("da");
    });

    test.each([
      "Alice",
      "Beatriz",
      "Liz",
      "Yumi",
      "Esther",
      "Isabel",
      "Raquel",
      "Sarah",
      "Ruth",
      "Lais",
      "Yasmin",
      "Emilly",
      "Nicole",
      "Maite",
      "Jaqueline",
      "Evelyn",
      "Aiko",
      "Malu",
      "Carmen",
      "Ingrid",
      "Zoe",
    ])("with feminine name not ending in A: %s", (nome) => {
      expect(artigoDoNome(nome)).toBe("da");
    });

    test.each([
      "Daniel",
      "Sandrinho",
      "Miguel",
      "Arthur",
      "Davi",
      "Lucas",
      "Luiz",
      "Enzo",
      "Joaquim",
      "Felipe",
      "Henrique",
      "Kaique",
      "Guilherme",
      "Jose",
      "Yuri",
      "Anthony",
    ])("with masculine name: %s", (nome) => {
      expect(artigoDoNome(nome)).toBe("do");
    });

    test.each([
      "Rafinha",
      "Luca",
      "Gianluca",
      "Kaua",
      "Caua",
      "Joshua",
      "Noah",
      "Abel",
      "Eli",
      "Rene",
      "Kiko",
    ])("with masculine name that looks feminine: %s", (nome) => {
      expect(artigoDoNome(nome)).toBe("do");
    });

    test("ignores letter case", () => {
      expect(artigoDoNome("ALICE")).toBe("da");
      expect(artigoDoNome("rafinha")).toBe("do");
    });
  });
});
