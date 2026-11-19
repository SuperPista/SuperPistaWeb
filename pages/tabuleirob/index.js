import { archivo } from "components/midia/fontes.js";
import landing from "components/landing/landing.module.css";
import estilos from "components/landingPresente/presente.module.css";
import Faixa from "components/landing/Faixa.js";
import Perguntas from "components/landing/Perguntas.js";
import CabecalhoPresente from "components/landingPresente/CabecalhoPresente.js";
import HeroPresente from "components/landingPresente/HeroPresente.js";
import PilaresPresente from "components/landingPresente/PilaresPresente.js";
import DoisJeitos from "components/landingPresente/DoisJeitos.js";
import ProvasESacola from "components/landingPresente/ProvasESacola.js";
import HistoriaCompacta from "components/landingPresente/HistoriaCompacta.js";
import FechamentoPresente from "components/landingPresente/FechamentoPresente.js";
import Seo from "components/loja/Seo.js";

// Variante B da landing page para teste A/B (/tabuleirob).
// Mantida fora da indexação orgânica para não competir com /tabuleiro.
function LandingTabuleiroB() {
  return (
    <>
      <Seo
        titulo="Super Pista | Presente Personalizado com Mini Cidade em 3D"
        descricao="Dê uma cidade inteira com o nome da criança impresso em MDF e Realidade Aumentada 3D no celular. Frete grátis para todo o Brasil."
        caminho="/tabuleirob"
        indexar={false}
      />

      <div
        className={`${archivo.variable} ${landing.pagina} ${estilos.paginaPresente}`}
      >
        <CabecalhoPresente />
        <main>
          <HeroPresente />
          <PilaresPresente />
          <DoisJeitos />
          <Faixa />
          <ProvasESacola />
          <HistoriaCompacta />
          <Faixa />
          <Perguntas comSeta={false} />
          <Faixa chegada />
          <FechamentoPresente />
        </main>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          background-color: #fff;
        }

        html {
          scroll-behavior: smooth;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }
      `}</style>
    </>
  );
}

export default LandingTabuleiroB;
