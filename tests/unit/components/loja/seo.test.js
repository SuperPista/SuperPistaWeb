import fs from "node:fs";
import path from "node:path";
import {
  esquemaDoProduto,
  esquemaFaq,
  esquemaOrganizacaoEWebsite,
} from "components/loja/Seo.js";
import { DOMINIO, urlAbsoluta } from "components/loja/links.js";
import {
  SLUG_DO_TABULEIRO,
  produtoPorSlug,
  todosOsProdutos,
} from "components/loja/catalogo.js";
import { PERGUNTAS } from "components/landing/Perguntas.js";

describe("SEO e Metadados", () => {
  describe("urlAbsoluta", () => {
    test("retorna o domínio quando nenhum caminho é passado", () => {
      expect(urlAbsoluta()).toBe(DOMINIO);
      expect(urlAbsoluta("")).toBe(DOMINIO);
    });

    test("adiciona barra inicial se necessário", () => {
      expect(urlAbsoluta("loja")).toBe(`${DOMINIO}/loja`);
      expect(urlAbsoluta("/loja")).toBe(`${DOMINIO}/loja`);
    });

    test("mantém URLs absolutas externas intactas", () => {
      expect(urlAbsoluta("https://outro.com/imagem.png")).toBe(
        "https://outro.com/imagem.png",
      );
    });
  });

  describe("esquemaDoProduto", () => {
    test("gera dados estruturados Schema.org para o tabuleiro vermelho", () => {
      const produto = produtoPorSlug(SLUG_DO_TABULEIRO);
      const esquema = esquemaDoProduto(produto);

      expect(esquema["@context"]).toBe("https://schema.org");
      expect(esquema["@type"]).toBe("Product");
      expect(esquema.name).toBe(produto.nome);
      expect(esquema.brand.name).toBe("Super Pista");
      expect(esquema.offers).toBeDefined();
      expect(esquema.offers["@type"]).toBe("Offer");
      expect(esquema.offers.priceCurrency).toBe("BRL");
      expect(esquema.offers.price).toBe((produto.preco / 100).toFixed(2));
      expect(esquema.offers.availability).toBe("https://schema.org/InStock");
    });

    test("marca produtos em breve com PreOrder", () => {
      const produto = produtoPorSlug("tabuleiro-amarelo");
      const esquema = esquemaDoProduto(produto);

      expect(esquema.offers.availability).toBe("https://schema.org/PreOrder");
    });
  });

  describe("esquemaFaq", () => {
    test("gera dados estruturados Schema.org para a lista de dúvidas", () => {
      const esquema = esquemaFaq(PERGUNTAS);

      expect(esquema["@context"]).toBe("https://schema.org");
      expect(esquema["@type"]).toBe("FAQPage");
      expect(esquema.mainEntity.length).toBe(PERGUNTAS.length);
      expect(esquema.mainEntity[0]["@type"]).toBe("Question");
      expect(esquema.mainEntity[0].name).toBe(PERGUNTAS[0].pergunta);
      expect(esquema.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
      expect(esquema.mainEntity[0].acceptedAnswer.text).toBe(
        PERGUNTAS[0].resposta,
      );
    });
  });

  describe("esquemaOrganizacaoEWebsite", () => {
    test("gera entidades Organization e WebSite", () => {
      const esquemas = esquemaOrganizacaoEWebsite();

      expect(Array.isArray(esquemas)).toBe(true);
      expect(esquemas[0]["@type"]).toBe("Organization");
      expect(esquemas[0].name).toBe("Super Pista");
      expect(esquemas[0].contactPoint.email).toBe("contato@superpista.com");
      expect(esquemas[1]["@type"]).toBe("WebSite");
    });
  });

  describe("Arquivos estáticos de rastreamento", () => {
    const raiz = process.cwd();

    test("robots.txt existe e aponta para o sitemap oficial", () => {
      const caminhoRobots = path.join(raiz, "public", "robots.txt");
      expect(fs.existsSync(caminhoRobots)).toBe(true);

      const conteudo = fs.readFileSync(caminhoRobots, "utf-8");
      expect(conteudo).toContain("User-agent: *");
      expect(conteudo).toContain("Sitemap: https://superpista.com/sitemap.xml");
      expect(conteudo).toContain("Disallow: /api/");
      expect(conteudo).toContain("Disallow: /checkout");
    });

    test("sitemap.xml lista todas as rotas públicas e produtos do catálogo", () => {
      const caminhoSitemap = path.join(raiz, "public", "sitemap.xml");
      expect(fs.existsSync(caminhoSitemap)).toBe(true);

      const conteudo = fs.readFileSync(caminhoSitemap, "utf-8");
      expect(conteudo).toContain("<loc>https://superpista.com/</loc>");
      expect(conteudo).toContain("<loc>https://superpista.com/tabuleiro</loc>");
      expect(conteudo).toContain("<loc>https://superpista.com/loja</loc>");

      todosOsProdutos().forEach((produto) => {
        expect(conteudo).toContain(
          `<loc>https://superpista.com/loja/${produto.slug}</loc>`,
        );
      });
    });
  });
});
