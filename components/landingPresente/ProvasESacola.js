import Image from "next/image";
import landing from "components/landing/landing.module.css";
import estilos from "components/landingPresente/presente.module.css";
import VideoEmLoop from "components/midia/VideoEmLoop.js";
import { DESCRICOES_POR_PRODUTO } from "components/loja/DescricaoCompleta.js";
import { SLUG_DO_TABULEIRO, produtoPorSlug } from "components/loja/catalogo.js";

export const VIDEOS_PROVA = [
  {
    src: "/landing/nome-celinha.mp4",
    poster: "/landing/nome-celinha-poster.webp",
    rotulo: "Menina sorrindo com a peça do tabuleiro que tem o nome Celinha.",
    legenda: "Celinha com a peça que leva o nome dela.",
  },
  {
    src: "/home/nome-rafinha.mp4",
    poster: "/home/nome-rafinha-poster.webp",
    rotulo: "Menino segurando a peça do tabuleiro com o nome Rafinha.",
    legenda: "Rafinha mostrando a cidade personalizada.",
  },
  {
    src: "/landing/presente-vo.mp4",
    poster: "/landing/presente-vo-poster.webp",
    rotulo:
      "Avó sentada no tapete da sala sorrindo para a neta, que brinca com a peça personalizada.",
    legenda: "Presente de avó que vira tarde no tapete.",
  },
  {
    src: "/landing/nome-amanda.mp4",
    poster: "/landing/nome-amanda-poster.webp",
    rotulo: "Menina mostrando a peça do tabuleiro com o nome Amanda.",
    legenda: "Amanda com o tabuleiro que é só dela.",
  },
];

function ProvasESacola() {
  const tabuleiro = produtoPorSlug(SLUG_DO_TABULEIRO);
  const cenarios = DESCRICOES_POR_PRODUTO[SLUG_DO_TABULEIRO].tema.itens;

  return (
    <section className={estilos.secaoEscura} id="provas-e-sacola">
      <div className={landing.container}>
        <header className={estilos.cabecalhoSecao}>
          <h2 className={landing.h2}>
            A reação de quem recebe uma cidade com o próprio nome
          </h2>
          <p className={`${landing.lead} ${estilos.textoSuave}`}>
            Para filho, neto, afilhada ou sobrinho: feito sob encomenda para não
            ir parar no fundo do armário depois da festa.
          </p>
        </header>

        <ul className={estilos.gradeVideos}>
          {VIDEOS_PROVA.map((video) => (
            <li key={video.src}>
              <figure className={estilos.cartaoVideo}>
                <div className={estilos.molduraVideo}>
                  <VideoEmLoop
                    className={estilos.midiaPreencher}
                    src={video.src}
                    poster={video.poster}
                    rotulo={video.rotulo}
                  />
                </div>
                <figcaption className={landing.dado}>
                  {video.legenda}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className={estilos.sacolaGrade} id="o-que-vem">
          <div className={estilos.sacolaFoto}>
            <Image
              className={estilos.midiaPreencher}
              src="/loja/tabuleiro-vermelho-sacola.webp"
              alt="Sacola oficial do Super Pista em cima do tabuleiro montado, cercada por brinquedos, blocos e carrinhos."
              fill
              sizes="(min-width: 880px) 480px, 92vw"
            />
          </div>

          <div className={estilos.sacolaDetalhes}>
            <h2 className={landing.h2}>Tudo o que chega pronto na sacola</h2>

            <ul className={estilos.itensLista}>
              {tabuleiro.itens.map((item) => (
                <li className={estilos.itemLinha} key={item.descricao}>
                  <span className={`${estilos.itemQtd} ${landing.dado}`}>
                    {item.quantidade}
                  </span>
                  <span>{item.descricao}</span>
                </li>
              ))}
            </ul>

            <div className={estilos.cenariosCaixa}>
              <h3>9 cenários na cidade vermelha (físico e 3D)</h3>
              <ul className={estilos.cenariosTags}>
                {cenarios.map((cenario) => (
                  <li key={cenario}>{cenario}</li>
                ))}
              </ul>
            </div>

            <p className={`${estilos.notaSacola} ${landing.dado}`}>
              Celular, tablet e brinquedos das fotos são ilustrativos e não
              acompanham o produto. O código de ativação do app vai por e-mail
              assim que o pagamento é confirmado e também fica no seu pedido e
              em Minha conta.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProvasESacola;
