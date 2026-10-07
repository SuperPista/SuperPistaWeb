import Head from "next/head";
import { Archivo } from "next/font/google";

import landing from "components/landing/landing.module.css";
import estilos from "components/home/home.module.css";
import loja from "components/loja/loja.module.css";
import Cabecalho from "components/home/Cabecalho.js";
import Hero from "components/home/Hero.js";
import Vantagens from "components/home/Vantagens.js";
import Destaques from "components/home/Destaques.js";
import FaixaDoApp from "components/home/FaixaDoApp.js";
import Rodape from "components/home/Rodape.js";
import Prateleira from "components/loja/Prateleira.js";
import { todosOsProdutos } from "components/loja/catalogo.js";

// A mesma Archivo da landing do tabuleiro, nas mesmas três larguras.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--fonte-pista",
});

// A home é a loja: um produto com preço no topo, o que toda loja promete na
// faixa de asfalto logo abaixo e a prateleira com todos os produtos em
// seguida, tabuleiros e kits juntos. Depois dela vêm dois quadros, como se
// brinca e o nome da criança. Quem conta a história de cada tabuleiro é a
// página dele; o passo a passo do aplicativo e as dúvidas têm páginas próprias
// (/aplicativo e /duvidas).
function Home() {
  return (
    <>
      <Head>
        <title>Super Pista: é hora das brincadeiras saudáveis</title>
        <meta
          name="description"
          content="Loja do Super Pista: quatro tabuleiros de mini cidade com pista de carrinhos, em MDF e com o nome da criança, e os kits de carrinhos e de blocos de montar."
        />
      </Head>

      <div
        className={`${archivo.variable} ${landing.pagina} ${estilos.pagina} ${loja.pagina}`}
      >
        <Cabecalho />
        <main>
          <Hero />
          <Vantagens />
          <Prateleira
            id="produtos"
            titulo="Produtos"
            texto="Quatro tabuleiros, cada um com uma cidade diferente, e os kits para completar a brincadeira."
            produtos={todosOsProdutos()}
            naDobra
          />
          <Destaques />
          <FaixaDoApp />
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
