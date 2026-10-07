import Head from "next/head";

import estilos from "components/home/home.module.css";
import Faixa from "components/landing/Faixa.js";
import Perguntas from "components/landing/Perguntas.js";
import Moldura from "components/conta/Moldura.js";

// As perguntas de antes da compra numa página própria. A mesma lista aparece
// no fim da página de cada produto e na landing do tabuleiro.
function Duvidas() {
  return (
    <Moldura titulo="Dúvidas" indexar>
      <Head>
        <meta
          name="description"
          content="Dúvidas sobre o Super Pista: idade indicada, material do tabuleiro, nome da criança, aplicativo, prazo de entrega e devolução."
        />
      </Head>

      <h1 className={estilos.somenteLeitor}>Dúvidas sobre o Super Pista</h1>
      <Perguntas comSeta={false} />
      <Faixa />
    </Moldura>
  );
}

export default Duvidas;
