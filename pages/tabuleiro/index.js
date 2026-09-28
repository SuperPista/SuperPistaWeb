import Head from "next/head";
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
// A página conta uma história, da infância de quem compra até a sacola chegando
// em casa, e todo botão leva para a oferta com o gancho da dobra em que está.
function LandingDoTabuleiro() {
  return (
    <>
      <Head>
        <title>Super Pista: hoje a tarde é no chão da sala</title>
        <meta
          name="description"
          content="Uma cidade com pista de carrinhos e o nome do seu filho, para os brinquedos esquecidos no quarto voltarem à brincadeira e a família sentar junto no chão da sala. Com o app, a cidade surge em 3D no celular."
        />
      </Head>

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
