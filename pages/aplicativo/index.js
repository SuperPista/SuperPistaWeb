import Head from "next/head";

import estilos from "components/home/home.module.css";
import Faixa from "components/landing/Faixa.js";
import Moldura from "components/conta/Moldura.js";
import Aplicativo from "components/home/Aplicativo.js";

// Como ativar o aplicativo, para quem já comprou o tabuleiro. É o mesmo
// caminho de quatro passos que aparece ao lado das telas da conta. O título
// da página existe para o leitor de tela; para quem vê, a seção já diz o que é.
function PaginaDoAplicativo() {
  return (
    <Moldura titulo="Aplicativo" indexar>
      <Head>
        <meta
          name="description"
          content="Como ativar o aplicativo Super Pista: baixe o app, crie a conta, digite o código do cartão que vem na sacola e veja a cidade em 3D no celular."
        />
      </Head>

      <h1 className={estilos.somenteLeitor}>Aplicativo Super Pista</h1>
      <Aplicativo />
      <Faixa />
    </Moldura>
  );
}

export default PaginaDoAplicativo;
