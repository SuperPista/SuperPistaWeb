import Head from "next/head";
import { Archivo } from "next/font/google";

import landing from "components/landing/landing.module.css";
import Faixa from "components/landing/Faixa.js";
import Perguntas from "components/landing/Perguntas.js";
import estilos from "components/home/home.module.css";
import Cabecalho from "components/home/Cabecalho.js";
import Hero from "components/home/Hero.js";
import ComoBrinca from "components/home/ComoBrinca.js";
import NomeDaCrianca from "components/home/NomeDaCrianca.js";
import Aplicativo from "components/home/Aplicativo.js";
import EmCasa from "components/home/EmCasa.js";
import Chamada from "components/home/Chamada.js";
import Rodape from "components/home/Rodape.js";

// A mesma Archivo da landing do tabuleiro, nas mesmas três larguras.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--fonte-pista",
});

// Home do site: apresenta a marca e leva para os dois caminhos que o site tem,
// a loja do tabuleiro e a conta usada no aplicativo.
function Home() {
  return (
    <>
      <Head>
        <title>Super Pista: é hora das brincadeiras saudáveis</title>
        <meta
          name="description"
          content="Tabuleiro de mini cidade com pista de carrinhos, em MDF e com o nome da criança. A criança brinca com os brinquedos que já tem e, se quiser, vê a cidade em 3D na tela do celular."
        />
      </Head>

      <div
        className={`${archivo.variable} ${landing.pagina} ${estilos.pagina}`}
      >
        <Cabecalho />
        <main>
          <Hero />
          <Faixa />
          <ComoBrinca />
          <NomeDaCrianca />
          <Faixa />
          <Aplicativo />
          <EmCasa />
          <Faixa />
          <Perguntas comSeta={false} />
          <Faixa chegada />
          <Chamada />
        </main>
        <Rodape />
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

export default Home;
