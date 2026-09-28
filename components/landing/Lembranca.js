import Image from "next/image";
import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";
import BotaoComprar from "components/landing/BotaoComprar.js";
import VideoEmLoop from "components/midia/VideoEmLoop.js";

// A infância de quem compra ao lado da cena de hoje. A de antes se mexe no
// vídeo; a de hoje é uma foto parada, com as crianças paradas na frente da tela.
function Lembranca() {
  return (
    <section className={`${estilos.secao} ${estilos.escuro}`} id="lembranca">
      <div className={estilos.container}>
        <div className={estilos.introLado}>
          <h2 className={estilos.h2}>
            Lembra quando a tarde inteira cabia no chão da sala?
          </h2>
          <p className={estilos.corpo}>
            Carrinho riscando o tapete, cidade inventada com o que tinha em casa
            e ninguém querendo ir embora. Hoje a tela chega primeiro, e a caixa
            de brinquedos fica parada no canto do quarto.
          </p>
        </div>

        <div className={estilos.antesHoje}>
          <figure className={`${estilos.quadro} ${estilos.quadroAntes}`}>
            <div className={`${estilos.caixaMidia} ${estilos.quadroMidia}`}>
              <VideoEmLoop
                className={estilos.preencher}
                src="/landing/lembranca-antes.mp4"
                poster="/landing/lembranca-antes-poster.webp"
                rotulo="Filme em preto e branco de três crianças agachadas no chão, empurrando carrinhos de madeira e rindo."
              />
            </div>
            <figcaption className={`${estilos.quadroLegenda} ${estilos.dado}`}>
              Do jeito que você brincava
            </figcaption>
          </figure>

          <figure className={estilos.quadro}>
            <div className={`${estilos.caixaMidia} ${estilos.quadroMidia}`}>
              <Image
                className={estilos.cobrir}
                src="/landing/lembranca-hoje.webp"
                alt="Duas crianças sentadas no tapete com controles de videogame na mão, olhando fixo para a tela."
                fill
                sizes="(min-width: 760px) 520px, 92vw"
              />
            </div>
            <figcaption className={`${estilos.quadroLegenda} ${estilos.dado}`}>
              Do jeito que eles brincam hoje
            </figcaption>
          </figure>
        </div>

        <div className={estilos.virada}>
          <p className={estilos.lead}>
            O Super Pista foi feito para devolver esse chão para eles, sem
            precisar brigar com a tela.
          </p>
          <BotaoComprar>Quero essa infância para eles</BotaoComprar>
        </div>
      </div>

      <Descer
        destino="#demonstracao"
        rotulo="como a tela entra na brincadeira"
        direita
      />
    </section>
  );
}

export default Lembranca;
