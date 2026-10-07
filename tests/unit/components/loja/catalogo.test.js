import {
  KITS,
  SLUG_DO_TABULEIRO,
  TABULEIROS,
  produtoPorSlug,
  produtosDaColecao,
  todosOsProdutos,
} from "components/loja/catalogo.js";

describe("components/loja/catalogo.js", () => {
  describe(".todosOsProdutos()", () => {
    test("every slug is unique and fits in an address", () => {
      const slugs = todosOsProdutos().map((produto) => produto.slug);

      expect(new Set(slugs).size).toBe(slugs.length);
      slugs.forEach((slug) => expect(slug).toMatch(/^[a-z0-9-]+$/));
    });

    test("every product has its own name and description", () => {
      const produtos = todosOsProdutos();

      ["nome", "nomeCurto", "resumo"].forEach((campo) => {
        const valores = produtos.map((produto) => produto[campo]);

        expect(new Set(valores).size).toBe(produtos.length);
      });
    });

    test.each(todosOsProdutos())(
      "$slug has what the screens need",
      (produto) => {
        expect([TABULEIROS, KITS]).toContain(produto.colecao);
        expect(produto.nome).toEqual(expect.any(String));
        expect(produto.nomeCurto).toEqual(expect.any(String));
        expect(produto.resumo).toEqual(expect.any(String));
        expect(Number.isInteger(produto.preco)).toBe(true);
        expect(produto.preco).toBeGreaterThan(0);
        // os cartões, a sacola e a galeria contam com a primeira foto
        expect(produto.fotos.length).toBeGreaterThan(0);
        produto.fotos.forEach((foto) => {
          expect(foto.src).toMatch(/^\/[a-z0-9/-]+\.webp$/);
          expect(foto.descricao).toEqual(expect.any(String));
          expect(foto.largura).toBeGreaterThan(0);
          expect(foto.altura).toBeGreaterThan(0);
        });
      },
    );
  });

  describe(".produtosDaColecao()", () => {
    test("the red board comes first, with the photo of the showcase", () => {
      const [destaque] = produtosDaColecao(TABULEIROS);

      expect(destaque.slug).toBe(SLUG_DO_TABULEIRO);
      expect(destaque.fotos[0].src).toEqual(expect.any(String));
    });

    test("every board is a city of its own, with a color", () => {
      const tabuleiros = produtosDaColecao(TABULEIROS);

      expect(tabuleiros.map((produto) => produto.cor.nome)).toEqual([
        "Vermelho",
        "Amarelo",
        "Verde",
        "Azul",
      ]);
      tabuleiros.forEach((produto) => {
        expect(produto.aceitaNome).toBe(true);
        expect(produto.comAplicativo).toBe(true);
        expect(produto.resumo).toContain("Realidade Aumentada");
        expect(produto.cor.tinta).toMatch(/^#[0-9a-f]{6}$/);
      });
    });

    test("only the red board has real photos", () => {
      const comFotoDeVerdade = todosOsProdutos()
        .filter((produto) => !produto.fotos[0].ilustrativa)
        .map((produto) => produto.slug);

      expect(comFotoDeVerdade).toEqual([SLUG_DO_TABULEIRO]);
    });

    test("the kits do not take a name nor come with the app", () => {
      const kits = produtosDaColecao(KITS);

      expect(kits.map((produto) => produto.slug)).toEqual([
        "kit-de-carrinhos",
        "kit-de-blocos",
      ]);
      kits.forEach((produto) => {
        expect(produto.aceitaNome).toBe(false);
        expect(produto.comAplicativo).toBe(false);
      });
    });

    test("the two collections hold the whole catalog", () => {
      expect([
        ...produtosDaColecao(TABULEIROS),
        ...produtosDaColecao(KITS),
      ]).toEqual(todosOsProdutos());
    });
  });

  describe(".produtoPorSlug()", () => {
    test("with a known slug", () => {
      expect(produtoPorSlug("tabuleiro-azul").nome).toBe(
        "Tabuleiro Super Pista Azul",
      );
    });

    test("with an unknown slug", () => {
      expect(produtoPorSlug("nao-existe")).toBeNull();
    });
  });
});
