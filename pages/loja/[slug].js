import Head from "next/head";
import Link from "next/link";

import landing from "components/landing/landing.module.css";
import estilos from "components/loja/loja.module.css";
import Faixa from "components/landing/Faixa.js";
import Perguntas from "components/landing/Perguntas.js";
import Aplicativo from "components/home/Aplicativo.js";
import ComoBrinca from "components/home/ComoBrinca.js";
import EmCasa from "components/home/EmCasa.js";
import NomeDaCrianca from "components/home/NomeDaCrianca.js";
import Moldura from "components/conta/Moldura.js";
import Galeria from "components/loja/Galeria.js";
import Compra from "components/loja/Compra.js";
import Prateleira from "components/loja/Prateleira.js";
import {
  SLUG_DO_TABULEIRO,
  produtoPorSlug,
  todosOsProdutos,
} from "components/loja/catalogo.js";
import { LINK_LOJA } from "components/loja/links.js";

export function getStaticPaths() {
  return {
    paths: todosOsProdutos().map((produto) => ({
      params: { slug: produto.slug },
    })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  return { props: { produto: produtoPorSlug(params.slug) } };
}

// Página de um produto: as fotos e a compra em cima, embaixo o que ajuda a
// decidir e, no fim, os outros produtos da loja.
//
// Todo tabuleiro vem com o aplicativo de Realidade Aumentada, então a seção
// dele entra na página de todos; o vídeo é o do tabuleiro vermelho, e a
// legenda avisa disso nas outras cidades.
//
// Como se brinca, as fotos em casa e os vídeos das crianças com o nome mostram
// o tabuleiro vermelho e falam da cidade dele, então só entram na página dele.
// Cada um dos outros tabuleiros é outra cidade e ganha as próprias quando
// tiver fotos.
//
// Todos os produtos usam esta mesma rota. A `key` no bloco de cima faz a
// galeria e a coluna da compra recomeçarem ao ir de um produto para outro, em
// vez de levarem a foto escolhida e a quantidade junto.
function PaginaDoProduto({ produto }) {
  const temHistoria = produto.slug === SLUG_DO_TABULEIRO;
  const outros = todosOsProdutos().filter(
    (outro) => outro.slug !== produto.slug,
  );

  return (
    <Moldura titulo={produto.nome} indexar classe={estilos.pagina}>
      <Head>
        <meta name="description" content={produto.resumo} />
      </Head>

      <section className={estilos.produtoTopo}>
        <div className={landing.container}>
          <nav aria-label="Você está em">
            <ol className={`${estilos.trilha} ${landing.dado}`}>
              <li>
                <Link href={LINK_LOJA}>Loja</Link>
              </li>
              <li aria-current="page">{produto.nome}</li>
            </ol>
          </nav>

          <div className={estilos.produto} key={produto.slug}>
            <Galeria produto={produto} />
            <Compra produto={produto} />
          </div>
        </div>
      </section>

      <Faixa />

      {temHistoria && <ComoBrinca />}

      {produto.itens && (
        <section className={`${landing.secao} ${landing.claro}`} id="o-que-vem">
          <div className={`${landing.container} ${estilos.oQueVem}`}>
            <div className={landing.sacolaTexto}>
              <h2 className={landing.h2}>O que vem na sacola</h2>
              <p className={landing.corpoEscuro}>
                Cada Super Pista é feito sob encomenda para a sua família. É
                abrir no tapete da sala e a brincadeira começa ali mesmo.
              </p>
            </div>

            <div className={landing.sacolaLista}>
              <ul className={landing.itens}>
                {produto.itens.map((item) => (
                  <li className={landing.item} key={item.descricao}>
                    <span className={`${landing.itemQtd} ${landing.dado}`}>
                      {item.quantidade}
                    </span>
                    <span>{item.descricao}</span>
                  </li>
                ))}
              </ul>
              <p className={`${landing.nota} ${landing.dado}`}>
                Celular, tablet e brinquedos que aparecem nas fotos e nos vídeos
                são ilustrativos e não acompanham o produto.
              </p>
            </div>
          </div>
        </section>
      )}

      {produto.comAplicativo && (
        <Aplicativo
          legenda={
            temHistoria
              ? undefined
              : "No vídeo, a cidade do tabuleiro vermelho."
          }
        />
      )}

      {temHistoria && (
        <>
          <EmCasa />
          <NomeDaCrianca previa={false} />
        </>
      )}

      <Prateleira id="mais" titulo="Mais na loja" produtos={outros} />
      <Faixa />

      <Perguntas comSeta={false} />
      <Faixa />
    </Moldura>
  );
}

export default PaginaDoProduto;
