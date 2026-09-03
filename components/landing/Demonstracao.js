import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";

function Demonstracao() {
  return (
    <section className={`${estilos.secao} ${estilos.escuro}`} id="demonstracao">
      <div className={`${estilos.container} ${estilos.demonstracao}`}>
        <div className={estilos.demonstracaoTexto}>
          <h2 className={estilos.h2}>Veja a brincadeira acontecer</h2>
          <p className={estilos.corpo}>
            É o tabuleiro montado na mesa, visto pela câmera do celular: os
            prédios de pé, as ruas cheias e o nome da criança no meio da cidade.
          </p>
        </div>

        <div className={estilos.video}>
          <video
            className={estilos.videoMidia}
            poster="/landing/brincadeira-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/landing/brincadeira.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <Descer destino="#como-funciona" rotulo="como funciona" direita />
    </section>
  );
}

export default Demonstracao;
