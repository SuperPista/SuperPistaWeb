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
import DescricaoCompleta from "components/loja/DescricaoCompleta.js";
import Prateleira from "components/loja/Prateleira.js";
import { esquemaDoProduto } from "components/loja/Seo.js";
import {
  SLUG_DO_TABULEIRO,
  produtoPorSlug,
  todosOsProdutos,
} from "components/loja/catalogo.js";
import { LINK_LOJA, linkDoProduto } from "components/loja/links.js";

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

// A compra fica no início; os detalhes completos seguem abaixo do produto.
function PaginaDoProduto({ produto }) {
  const temHistoria = produto.slug === SLUG_DO_TABULEIRO;
  const outros = todosOsProdutos().filter(
    (outro) => outro.slug !== produto.slug,
  );

  const titulo = `${produto.nome} com Realidade Aumentada`;
  const foto = produto.fotos?.[0]?.src;

  return (
    <Moldura
      titulo={titulo}
      descricao={produto.resumo}
      caminho={linkDoProduto(produto.slug)}
      imagem={foto}
      tipo="product"
      dadosEstruturados={esquemaDoProduto(produto)}
      indexar
      classe={`${estilos.pagina} ${estilos.paginaDoProduto}`}
    >
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
            <div className={estilos.colunaGaleria}>
              <Galeria produto={produto} />
              {temHistoria && (
                <section
                  className={estilos.fichaGaleria}
                  aria-label="Medidas e indicação de uso"
                >
                  <dl>
                    <div>
                      <dt>Tabuleiro montado</dt>
                      <dd>76 × 76 cm</dd>
                    </div>
                    <div>
                      <dt>Brincadeira sem tela</dt>
                      <dd>A partir de 4 anos</dd>
                    </div>
                    <div>
                      <dt>Com celular ou tablet</dt>
                      <dd>A partir de 6 anos</dd>
                    </div>
                  </dl>
                  <p>
                    Com celular ou tablet, sempre com um adulto responsável por
                    perto. Depois de ativado, o aplicativo funciona sem
                    internet.
                  </p>
                  <p>
                    <strong>Cuidados com o tabuleiro:</strong> a impressão
                    recebe uma camada protetora; a tinta não é tóxica e não
                    solta. Guarde em lugar seco, longe da umidade.
                  </p>
                </section>
              )}
            </div>
            <div className={estilos.apresentacao}>
              <h1 className={estilos.produtoTitulo}>{produto.nome}</h1>
              {!temHistoria && (
                <p className={estilos.compraResumo}>{produto.resumo}</p>
              )}
              <section id="comprar" aria-label="Personalizar e comprar">
                <Compra produto={produto} compacto key={produto.slug} />
              </section>
            </div>
          </div>
        </div>
      </section>

      <Faixa />

      {temHistoria && (
        <>
          <DescricaoCompleta />
          <Faixa />
        </>
      )}

      {temHistoria && <ComoBrinca />}

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

      <Perguntas comSeta={false} />
      <Faixa />

      <Prateleira id="mais" titulo="Mais na loja" produtos={outros} />
      <Faixa />
    </Moldura>
  );
}

export default PaginaDoProduto;
