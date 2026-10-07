import {
  LIMITE_POR_LINHA,
  adicionarLinha,
  chaveDaLinha,
  mudarQuantidadeDaLinha,
  nomeNaPeca,
  removerLinha,
  resumirSacola,
} from "components/loja/sacola.js";
import { SLUG_DO_TABULEIRO, produtoPorSlug } from "components/loja/catalogo.js";

const tabuleiro = produtoPorSlug(SLUG_DO_TABULEIRO);

describe("components/loja/sacola.js", () => {
  describe(".adicionarLinha()", () => {
    test("with an empty bag", () => {
      const linhas = adicionarLinha([], { slug: SLUG_DO_TABULEIRO });

      expect(linhas).toEqual([
        { slug: SLUG_DO_TABULEIRO, quantidade: 1, nome: "", artigo: "" },
      ]);
    });

    test("with the same product and the same name", () => {
      const primeira = adicionarLinha([], {
        slug: SLUG_DO_TABULEIRO,
        nome: "Celinha",
        artigo: "da",
      });
      const segunda = adicionarLinha(primeira, {
        slug: SLUG_DO_TABULEIRO,
        quantidade: 2,
        nome: "CELINHA",
        artigo: "da",
      });

      expect(segunda).toHaveLength(1);
      expect(segunda[0].quantidade).toBe(3);
    });

    test("with the same product and different names", () => {
      const primeira = adicionarLinha([], {
        slug: SLUG_DO_TABULEIRO,
        nome: "Celinha",
        artigo: "da",
      });
      const segunda = adicionarLinha(primeira, {
        slug: SLUG_DO_TABULEIRO,
        nome: "Daniel",
        artigo: "do",
      });
      const terceira = adicionarLinha(segunda, { slug: SLUG_DO_TABULEIRO });

      expect(terceira).toHaveLength(3);
    });

    test("with the same name and a different article", () => {
      const primeira = adicionarLinha([], {
        slug: SLUG_DO_TABULEIRO,
        nome: "Ariel",
        artigo: "da",
      });
      const segunda = adicionarLinha(primeira, {
        slug: SLUG_DO_TABULEIRO,
        nome: "Ariel",
        artigo: "do",
      });

      expect(segunda).toHaveLength(2);
    });

    test("without a name, the article is dropped", () => {
      const linhas = adicionarLinha([], {
        slug: SLUG_DO_TABULEIRO,
        nome: "",
        artigo: "do",
      });

      expect(linhas[0].artigo).toBe("");
    });

    test("with a quantity above the limit", () => {
      const cheia = adicionarLinha([], {
        slug: SLUG_DO_TABULEIRO,
        quantidade: LIMITE_POR_LINHA,
      });
      const maisUma = adicionarLinha(cheia, { slug: SLUG_DO_TABULEIRO });

      expect(maisUma[0].quantidade).toBe(LIMITE_POR_LINHA);
    });

    test("does not change the original list", () => {
      const linhas = [];

      adicionarLinha(linhas, { slug: SLUG_DO_TABULEIRO });

      expect(linhas).toEqual([]);
    });
  });

  describe(".mudarQuantidadeDaLinha()", () => {
    const linhas = adicionarLinha([], { slug: SLUG_DO_TABULEIRO });
    const chave = chaveDaLinha(linhas[0]);

    test("with a valid quantity", () => {
      expect(mudarQuantidadeDaLinha(linhas, chave, 4)[0].quantidade).toBe(4);
    });

    test.each([0, -3, NaN])("with %s, stays at one", (quantidade) => {
      expect(
        mudarQuantidadeDaLinha(linhas, chave, quantidade)[0].quantidade,
      ).toBe(1);
    });

    test("with a quantity above the limit", () => {
      expect(mudarQuantidadeDaLinha(linhas, chave, 99)[0].quantidade).toBe(
        LIMITE_POR_LINHA,
      );
    });
  });

  describe(".removerLinha()", () => {
    test("removes only the given line", () => {
      const comNome = adicionarLinha([], {
        slug: SLUG_DO_TABULEIRO,
        nome: "Yumi",
        artigo: "da",
      });
      const duas = adicionarLinha(comNome, { slug: SLUG_DO_TABULEIRO });

      const restou = removerLinha(duas, chaveDaLinha(duas[0]));

      expect(restou).toEqual([duas[1]]);
    });
  });

  describe(".resumirSacola()", () => {
    test("with an empty bag", () => {
      expect(resumirSacola([])).toEqual({
        itens: [],
        quantidade: 0,
        subtotal: 0,
        frete: 0,
        total: 0,
        vazia: true,
      });
    });

    test("with two lines", () => {
      const comNome = adicionarLinha([], {
        slug: SLUG_DO_TABULEIRO,
        quantidade: 2,
        nome: "Yumi",
        artigo: "da",
      });
      const linhas = adicionarLinha(comNome, { slug: SLUG_DO_TABULEIRO });

      const resumo = resumirSacola(linhas);

      expect(resumo.vazia).toBe(false);
      expect(resumo.quantidade).toBe(3);
      expect(resumo.subtotal).toBe(tabuleiro.preco * 3);
      expect(resumo.total).toBe(resumo.subtotal + resumo.frete);
      expect(resumo.itens[0].valor).toBe(tabuleiro.preco * 2);
      expect(resumo.itens[0].produto).toBe(tabuleiro);
    });

    test("ignores a product that left the catalog", () => {
      const resumo = resumirSacola([
        { slug: "produto-que-saiu", quantidade: 2, nome: "", artigo: "" },
      ]);

      expect(resumo.vazia).toBe(true);
      expect(resumo.total).toBe(0);
    });
  });

  describe(".nomeNaPeca()", () => {
    test("with a name", () => {
      expect(nomeNaPeca({ nome: "Celinha", artigo: "da" })).toBe("DA CELINHA");
    });

    test("without a name", () => {
      expect(nomeNaPeca({ nome: "", artigo: "" })).toBeNull();
    });
  });
});
