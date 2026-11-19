import fs from "node:fs";
import path from "node:path";
import LandingTabuleiroB from "pages/tabuleirob/index.js";
import Seo from "components/loja/Seo.js";
import Perguntas from "components/landing/Perguntas.js";
import CabecalhoPresente from "components/landingPresente/CabecalhoPresente.js";
import HeroPresente, {
  MIDIAS_DO_PALCO,
} from "components/landingPresente/HeroPresente.js";
import PilaresPresente from "components/landingPresente/PilaresPresente.js";
import DoisJeitos from "components/landingPresente/DoisJeitos.js";
import ProvasESacola, {
  VIDEOS_PROVA,
} from "components/landingPresente/ProvasESacola.js";
import HistoriaCompacta from "components/landingPresente/HistoriaCompacta.js";
import FechamentoPresente from "components/landingPresente/FechamentoPresente.js";

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

describe("Landing page alternativa (/tabuleirob)", () => {
  test("renderiza desindexada no SEO e com a estrutura completa da variante B", () => {
    const arvore = LandingTabuleiroB();

    const seo = encontrarNaArvore(arvore, (no) => no.type === Seo);
    expect(seo).not.toBeNull();
    expect(seo.props.caminho).toBe("/tabuleirob");
    expect(seo.props.indexar).toBe(false);

    [
      CabecalhoPresente,
      HeroPresente,
      PilaresPresente,
      DoisJeitos,
      ProvasESacola,
      HistoriaCompacta,
      Perguntas,
      FechamentoPresente,
    ].forEach((Componente) => {
      expect(
        encontrarNaArvore(arvore, (no) => no.type === Componente),
      ).not.toBeNull();
    });
  });

  test("todas as mídias do palco interativo e das provas existem em public/", () => {
    const arquivos = [
      ...MIDIAS_DO_PALCO.flatMap((item) =>
        item.poster ? [item.src, item.poster] : [item.src],
      ),
      ...VIDEOS_PROVA.flatMap((item) => [item.src, item.poster]),
      "/loja/tabuleiro-vermelho-brinquedos.webp",
      "/loja/tabuleiro-vermelho-3d.webp",
      "/loja/tabuleiro-vermelho-sacola.webp",
      "/landing/alexander.webp",
      "/landing/logo-super-pista.webp",
    ];

    arquivos.forEach((relativo) => {
      const caminho = path.join(process.cwd(), "public", relativo);
      expect(fs.existsSync(caminho)).toBe(true);
    });
  });

  test("sitemap.xml não lista a rota de teste A/B /tabuleirob", () => {
    const caminhoSitemap = path.join(process.cwd(), "public", "sitemap.xml");
    const conteudo = fs.readFileSync(caminhoSitemap, "utf-8");

    expect(conteudo).not.toContain("/tabuleirob");
  });
});
