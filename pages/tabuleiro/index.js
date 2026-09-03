import Head from "next/head";
import { Archivo } from "next/font/google";

import estilos from "components/landing/landing.module.css";
import Cabecalho from "components/landing/Cabecalho.js";
import Hero from "components/landing/Hero.js";
import Faixa from "components/landing/Faixa.js";
import Demonstracao from "components/landing/Demonstracao.js";
import ComoFunciona from "components/landing/ComoFunciona.js";
import NaCaixa from "components/landing/NaCaixa.js";
import Personalizacao from "components/landing/Personalizacao.js";
import Depoimentos from "components/landing/Depoimentos.js";
import Autor from "components/landing/Autor.js";
import Perguntas from "components/landing/Perguntas.js";
import Oferta from "components/landing/Oferta.js";

// Uma família só, em três larguras: 125 para a sinalização, 100 para o texto
// e 87 para os dados pequenos.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--fonte-pista",
});

// Landing page do tabuleiro: sem menu, sem rodapé e sem link para o site.
// Todo botão leva para o mesmo lugar.
function LandingDoTabuleiro() {
  return (
    <>
      <Head>
        <title>Super Pista: o tabuleiro que vira cidade no celular</title>
        <meta
          name="description"
          content="Um tabuleiro de quatro peças que a criança encaixa e vira uma cidade em realidade aumentada na tela do celular. Sem óculos, sem controle e sem pilha."
        />
      </Head>

      <div className={`${archivo.variable} ${estilos.pagina}`}>
        <Cabecalho />
        <main>
          <Hero />
          <Faixa />
          <Demonstracao />
          <ComoFunciona />
          <Faixa />
          <NaCaixa />
          <Personalizacao />
          <Depoimentos />
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
