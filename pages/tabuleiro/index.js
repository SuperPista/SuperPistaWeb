import { Archivo } from "next/font/google";

import estilos from "components/landing/landing.module.css";
import Cabecalho from "components/landing/Cabecalho.js";
import Hero from "components/landing/Hero.js";
import Faixa from "components/landing/Faixa.js";
import Lembranca from "components/landing/Lembranca.js";
import Demonstracao from "components/landing/Demonstracao.js";
import ComoFunciona from "components/landing/ComoFunciona.js";
import BrincarJunto from "components/landing/BrincarJunto.js";
import NaSacola from "components/landing/NaSacola.js";
import Personalizacao from "components/landing/Personalizacao.js";
import Presente from "components/landing/Presente.js";
import Autor from "components/landing/Autor.js";
import Perguntas, { PERGUNTAS } from "components/landing/Perguntas.js";
import Oferta from "components/landing/Oferta.js";
import Seo, { esquemaDoProduto, esquemaFaq } from "components/loja/Seo.js";
import { SLUG_DO_TABULEIRO, produtoPorSlug } from "components/loja/catalogo.js";

// Uma família só, em três larguras: 125 para a sinalização, 100 para o texto
// e 87 para os dados pequenos.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--fonte-pista",
});

// Landing page do tabuleiro: sem menu, sem rodapé e sem link para o site.
// A página conta uma história, da infância de quem compra até a sacola chegando
// em casa, e todo botão leva para a oferta com o gancho da dobra em que está.
function LandingDoTabuleiro() {
  const produto = produtoPorSlug(SLUG_DO_TABULEIRO);
  const dadosEstruturados = [
    esquemaDoProduto(produto),
    esquemaFaq(PERGUNTAS),
  ].filter(Boolean);

  return (
    <>
      <Seo
        titulo="Super Pista | Tabuleiro Infantil com Realidade Aumentada e Carrinhos"
        descricao="Uma mini cidade com pista de carrinhos e o nome do seu filho em MDF. Com o app em Realidade Aumentada, a cidade ganha vida em 3D no celular."
        caminho="/tabuleiro"
        dadosEstruturados={dadosEstruturados}
      />

      <div className={`${archivo.variable} ${estilos.pagina}`}>
        <Cabecalho />
        <main>
          <Hero />
          <Faixa />
          <Lembranca />
          <Demonstracao />
          <ComoFunciona />
          <Faixa />
          <BrincarJunto />
          <NaSacola />
          <Personalizacao />
          <Presente />
          <Autor />
          <Faixa />
          <Perguntas />
          <Faixa chegada />
          <Oferta />
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

export default LandingDoTabuleiro;
