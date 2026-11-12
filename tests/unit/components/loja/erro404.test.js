import fs from "node:fs";
import path from "node:path";
import PaginaNaoEncontrada from "pages/404.js";
import { todosOsProdutos } from "components/loja/catalogo.js";
import { LINK_LOJA } from "components/loja/links.js";

describe("Página 404 personalizada", () => {
  test("exporta o componente de erro 404", () => {
    expect(typeof PaginaNaoEncontrada).toBe("function");
  });

  test("renderiza a estrutura com Moldura desindexada e Prateleira da loja", () => {
    const elemento = PaginaNaoEncontrada();

    expect(elemento.type.name).toBe("Moldura");
    expect(elemento.props.titulo).toBe("Página não encontrada (404)");
    expect(elemento.props.indexar).toBe(false);

    const filhos = Array.isArray(elemento.props.children)
      ? elemento.props.children
      : [elemento.props.children];

    // Localiza a seção de aviso amigável
    const secaoAviso = filhos.find((filho) =>
      filho?.props?.className?.includes("secaoErro"),
    );
    expect(secaoAviso).toBeDefined();

    // Localiza a Prateleira de produtos
    const prateleira = filhos.find(
      (filho) => filho?.props?.id === "produtos-404",
    );
    expect(prateleira).toBeDefined();
    expect(prateleira.props.produtos).toEqual(todosOsProdutos());
    expect(prateleira.props.titulo).toBe("Produtos");

    // Verifica se os botões apontam para a loja e para o início
    const placa = secaoAviso.props.children;
    const divAcoes = placa.props.children.find((bloco) =>
      bloco?.props?.className?.includes("acoes"),
    );
    expect(divAcoes).toBeDefined();

    const links = divAcoes.props.children;
    const linkLoja = links.find((l) => l.props.href === LINK_LOJA);
    const linkInicio = links.find((l) => l.props.href === "/");

    expect(linkLoja).toBeDefined();
    expect(linkLoja.props.children).toBe("Ver produtos da loja");

    expect(linkInicio).toBeDefined();
    expect(linkInicio.props.children).toBe("Voltar ao início");
  });

  test("sitemap.xml não contém a rota 404", () => {
    const caminhoSitemap = path.join(process.cwd(), "public", "sitemap.xml");
    const conteudo = fs.readFileSync(caminhoSitemap, "utf-8");

    expect(conteudo).not.toContain("/404");
  });
});
