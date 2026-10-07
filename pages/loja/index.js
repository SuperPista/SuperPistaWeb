import { useState } from "react";
import Head from "next/head";

import landing from "components/landing/landing.module.css";
import estilos from "components/loja/loja.module.css";
import Faixa from "components/landing/Faixa.js";
import Moldura from "components/conta/Moldura.js";
import Prateleira from "components/loja/Prateleira.js";
import { KITS, TABULEIROS, todosOsProdutos } from "components/loja/catalogo.js";

const FILTROS = [
  { rotulo: "Tudo", colecao: null },
  { rotulo: "Tabuleiros", colecao: TABULEIROS },
  { rotulo: "Kits", colecao: KITS },
];

// A loja inteira numa página só, para onde voltam a sacola e a página do
// produto. É a mesma prateleira da home, com os botões que separam tabuleiros
// de kits.
function Loja() {
  const [colecao, setColecao] = useState(null);
  const todos = todosOsProdutos();
  const daColecao = (qual) =>
    qual ? todos.filter((produto) => produto.colecao === qual) : todos;

  return (
    <Moldura titulo="Loja" indexar classe={estilos.pagina}>
      <Head>
        <meta
          name="description"
          content="A loja do Super Pista: quatro tabuleiros de mini cidade com pista de carrinhos, cada um com uma cidade diferente, e os kits de carrinhos e de blocos de montar."
        />
      </Head>

      <section className={estilos.lojaTopo}>
        <div className={landing.container}>
          <h1 className={estilos.tituloDaTela}>Loja</h1>
          <p className={`${landing.corpo} ${estilos.lojaTexto}`}>
            Quatro tabuleiros, cada um com uma cidade diferente, e os kits para
            completar a brincadeira.
          </p>

          <ul className={estilos.filtros} aria-label="Mostrar">
            {FILTROS.map((filtro) => (
              <li key={filtro.rotulo}>
                <button
                  className={estilos.filtro}
                  type="button"
                  aria-pressed={filtro.colecao === colecao}
                  onClick={() => setColecao(filtro.colecao)}
                >
                  {filtro.rotulo}
                  <span className={estilos.filtroConta}>
                    {daColecao(filtro.colecao).length}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Prateleira
        id="produtos"
        titulo="Produtos"
        produtos={daColecao(colecao)}
        oculto
      />
      <Faixa />
    </Moldura>
  );
}

export default Loja;
