import fs from "node:fs";
import path from "node:path";
import DescricaoCompleta, {
  DESCRICOES_POR_PRODUTO,
  temDescricaoCompleta,
} from "components/loja/DescricaoCompleta.js";
import { produtoPorSlug } from "components/loja/catalogo.js";
import PaginaDoProduto from "pages/loja/[slug].js";

function encontrarNaArvore(no, predicado) {
  if (!no || typeof no !== "object") return null;
  if (Array.isArray(no)) {
    for (const item of no) {
      const achado = encontrarNaArvore(item, predicado);
      if (achado) return achado;
    }
    return null;
  }
  if (predicado(no)) return no;
  return encontrarNaArvore(no.props?.children, predicado);
}

describe("components/loja/DescricaoCompleta.js", () => {
  test("ativa descrição completa apenas para os tabuleiros vermelho e amarelo", () => {
    expect(temDescricaoCompleta("tabuleiro-vermelho")).toBe(true);
    expect(temDescricaoCompleta("tabuleiro-amarelo")).toBe(true);
    expect(temDescricaoCompleta("tabuleiro-verde")).toBe(false);
    expect(temDescricaoCompleta("tabuleiro-azul")).toBe(false);
    expect(temDescricaoCompleta("kit-de-carrinhos")).toBe(false);
    expect(temDescricaoCompleta("desconhecido")).toBe(false);
  });

  test("todas as ilustrações referenciadas existem em public/ com dimensões válidas", () => {
    Object.values(DESCRICOES_POR_PRODUTO).forEach((detalhes) => {
      Object.values(detalhes.ilustracoes).forEach((ilustracao) => {
        const caminho = path.join(process.cwd(), "public", ilustracao.src);
        expect(fs.existsSync(caminho)).toBe(true);
        expect(ilustracao.largura).toBeGreaterThan(0);
        expect(ilustracao.altura).toBeGreaterThan(0);
        expect(ilustracao.descricao).toEqual(expect.any(String));
      });
    });
  });

  test("contém a lista oficial de artes do tema amarelo", () => {
    expect(DESCRICOES_POR_PRODUTO["tabuleiro-amarelo"].tema.nome).toBe(
      "Tema amarelo",
    );
    expect(DESCRICOES_POR_PRODUTO["tabuleiro-amarelo"].tema.itens).toEqual([
      "Polícia",
      "Apartamentos",
      "Pet shop",
      "Mecânica e guincho",
      "Posto de serviços",
      "Lava rápido",
      "Prédios comerciais",
      "Praça, sol e nuvens",
      "Semáforos, radar",
      "Helicóptero",
    ]);
  });

  test("renderiza a seção de detalhes para vermelho e amarelo e null para os demais", () => {
    const vermelho = DescricaoCompleta({ slug: "tabuleiro-vermelho" });
    const amarelo = DescricaoCompleta({ slug: "tabuleiro-amarelo" });

    expect(vermelho.props.id).toBe("descricao-completa");
    expect(amarelo.props.id).toBe("descricao-completa");
    expect(DescricaoCompleta({ slug: "tabuleiro-verde" })).toBeNull();
  });

  test("página do produto exibe ficha e descrição completa no vermelho e no amarelo", () => {
    ["tabuleiro-vermelho", "tabuleiro-amarelo"].forEach((slug) => {
      const pagina = PaginaDoProduto({ produto: produtoPorSlug(slug) });
      const ficha = encontrarNaArvore(
        pagina,
        (no) => no.props?.["aria-label"] === "Medidas e indicação de uso",
      );
      const descricao = encontrarNaArvore(
        pagina,
        (no) => no.type === DescricaoCompleta,
      );

      expect(ficha).not.toBeNull();
      expect(descricao).not.toBeNull();
      expect(descricao.props.slug).toBe(slug);
    });

    const paginaVerde = PaginaDoProduto({
      produto: produtoPorSlug("tabuleiro-verde"),
    });
    expect(
      encontrarNaArvore(
        paginaVerde,
        (no) => no.props?.["aria-label"] === "Medidas e indicação de uso",
      ),
    ).toBeNull();
    expect(
      encontrarNaArvore(paginaVerde, (no) => no.type === DescricaoCompleta),
    ).toBeNull();
  });
});
