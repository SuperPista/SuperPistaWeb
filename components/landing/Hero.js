import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";
import BotaoComprar from "components/landing/BotaoComprar.js";
import VideoEmLoop from "components/midia/VideoEmLoop.js";

// 1ª dobra: a cena que a família quer ter em casa. As crianças estão paradas
// na frente da TV, a sacola chega e elas largam tudo para abrir.
function Hero() {
  return (
    <section className={estilos.heroi}>
      <div className={estilos.container}>
        <h1 className={estilos.h1}>Hoje a tarde é no chão da sala</h1>

        <div className={estilos.heroiCorpo}>
          <div className={estilos.heroiTexto}>
            <p className={estilos.lead}>
              Uma cidade com pista de carrinhos e o nome do seu filho impresso
              nela. Os carrinhos, bonecos e blocos esquecidos no quarto ganham
              ruas, hospital e estádio, e a TV fica esperando.
            </p>
            <BotaoComprar>Quero fazer essa surpresa</BotaoComprar>
            <p className={estilos.reforco}>
              Feito sob encomenda, com o nome da criança sem custo a mais.
            </p>
          </div>

          <figure className={estilos.heroiMidia}>
            <div className={`${estilos.caixaMidia} ${estilos.moldura}`}>
              <VideoEmLoop
                className={estilos.preencher}
                src="/landing/sacola-chegou.mp4"
                poster="/landing/sacola-chegou-poster.webp"
                rotulo="Duas crianças sentadas no tapete da sala recebem a sacola do Super Pista e abrem sorrindo."
              />
            </div>
            <figcaption className={`${estilos.legenda} ${estilos.dado}`}>
              A TV estava ligada. Aí a sacola chegou.
            </figcaption>
          </figure>
        </div>
      </div>

      <Descer destino="#lembranca" rotulo="a lembrança da sua infância" />
    </section>
  );
}

export default Hero;
