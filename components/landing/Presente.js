import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";
import BotaoComprar from "components/landing/BotaoComprar.js";
import VideoEmLoop from "components/midia/VideoEmLoop.js";

// Para quem compra de presente: avós, tios e padrinhos.
function Presente() {
  return (
    <section className={`${estilos.secao} ${estilos.vermelho}`} id="presente">
      <div className={`${estilos.container} ${estilos.presente}`}>
        <div className={estilos.presenteTexto}>
          <h2 className={estilos.h2}>O presente que vira lembrança</h2>
          <p className={estilos.corpo}>
            Para o neto, a afilhada ou o sobrinho: um brinquedo feito sob
            encomenda, com o nome da criança, pensado para não ir parar no fundo
            do armário depois da festa. E que ainda chama quem deu o presente
            para sentar no chão e brincar junto.
          </p>
          <p className={estilos.corpo}>
            Aniversário, Dia das Crianças, Natal ou só porque bateu saudade.
          </p>
          <div className={estilos.chamada}>
            <BotaoComprar>Quero dar esse presente</BotaoComprar>
          </div>
        </div>

        <div className={estilos.presenteVideos}>
          <div className={`${estilos.caixaMidia} ${estilos.presenteVideo}`}>
            <VideoEmLoop
              className={estilos.preencher}
              src="/landing/presente-avo.mp4"
              poster="/landing/presente-avo-poster.webp"
              rotulo="Avô de avental numa oficina, ao lado da neta que mostra a peça do tabuleiro com o nome Bernadete."
            />
          </div>
          <div className={`${estilos.caixaMidia} ${estilos.presenteVideo}`}>
            <VideoEmLoop
              className={estilos.preencher}
              src="/landing/presente-vo.mp4"
              poster="/landing/presente-vo-poster.webp"
              rotulo="Avó sentada no tapete da sala sorrindo para a neta, que brinca de blocos em cima da peça com o nome Fabiana."
            />
          </div>
        </div>
      </div>

      <Descer destino="#autor" rotulo="quem faz o Super Pista" direita />
    </section>
  );
}

export default Presente;
