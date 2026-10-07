import Head from "next/head";
import { Archivo } from "next/font/google";

import landing from "components/landing/landing.module.css";
import home from "components/home/home.module.css";
import estilos from "components/conta/conta.module.css";
import Cabecalho from "components/home/Cabecalho.js";
import Rodape from "components/home/Rodape.js";

// A mesma Archivo da home e da landing, nas mesmas três larguras.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--fonte-pista",
});

// Casca das páginas fora da home que fazem parte do site: o mesmo cabeçalho,
// com o menu, e o mesmo rodapé. O miolo vem de quem usa.
function Moldura({ titulo, indexar = false, classe = "", children }) {
  return (
    <>
      <Head>
        <title>{`${titulo} | Super Pista`}</title>
        {!indexar && <meta name="robots" content="noindex" />}
      </Head>

      <div
        className={`${archivo.variable} ${landing.pagina} ${home.pagina} ${estilos.pagina} ${classe}`}
      >
        <Cabecalho />
        <main>{children}</main>
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

export default Moldura;
