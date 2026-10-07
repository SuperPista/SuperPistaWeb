import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";
import VideoEmLoop from "components/midia/VideoEmLoop.js";

// A tela chega depois do tabuleiro: a família em volta do celular e, por cima,
// o que aparece na tela quando a câmera encontra a cidade.
function Demonstracao() {
  return (
    <section className={estilos.secao} id="demonstracao">
      <div className={`${estilos.container} ${estilos.demonstracao}`}>
        <div className={estilos.demonstracaoTexto}>
          <h2 className={estilos.h2}>
            A tela entra na brincadeira, não no lugar dela
          </h2>
          <p className={estilos.corpo}>
            Primeiro eles montam a cidade e espalham os brinquedos pelas ruas.
            Depois, se quiserem, apontam o celular para o tabuleiro e veem o
            estádio, o hospital e o banco surgirem em 3D.
          </p>
          <p className={estilos.corpo}>
            É a mesma tela de sempre, só que agora com a família inteira em
            volta. E um toque no botão da câmera vira foto para mandar para a
            avó.
          </p>
        </div>

        <div className={estilos.palco}>
          <div className={`${estilos.caixaMidia} ${estilos.palcoPrincipal}`}>
            <VideoEmLoop
              className={estilos.preencher}
              src="/landing/tela-junto.mp4"
              poster="/landing/tela-junto-poster.webp"
              rotulo="Pai sentado no tapete com os filhos, que apontam o celular para o tabuleiro montado."
            />
          </div>

          <figure className={estilos.palcoTela}>
            <div className={`${estilos.caixaMidia} ${estilos.palcoTelaMidia}`}>
              <VideoEmLoop
                className={estilos.preencher}
                src="/landing/brincadeira.mp4"
                poster="/landing/brincadeira-poster.webp"
                rotulo="A cidade do tabuleiro em 3D, com prédios, estádio e árvores de pé."
              />
            </div>
            <figcaption className={`${estilos.palcoLegenda} ${estilos.dado}`}>
              O que aparece na tela do celular
            </figcaption>
          </figure>
        </div>
      </div>

      <Descer destino="#como-funciona" rotulo="como funciona" />
    </section>
  );
}

export default Demonstracao;
