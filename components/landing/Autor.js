import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";

// TODO: conferir a história com o Alexander e trocar o espaço da foto pelo
// retrato dele. Mostrar o rosto é o que faz esta seção funcionar.
function Autor() {
  return (
    <section className={`${estilos.secao} ${estilos.secaoColada}`} id="autor">
      <div className={estilos.container}>
        <div className={estilos.autor}>
          <div className={`${estilos.foto} ${estilos.autorFoto}`} />
          <div className={estilos.autorTexto}>
            <h2 className={estilos.h2}>Quem faz o Super Pista</h2>
            <p className={estilos.corpo}>
              Sou o Alexander. O Super Pista começou de uma cena que se repetia
              em casa: a criança montando cidade no chão com peça de encaixe e,
              do lado, o tablet ligado sem ninguém olhar. Em vez de disputar com
              a tela, resolvi fazer as duas coisas trabalharem juntas.
            </p>
            <p className={estilos.corpo}>
              O tabuleiro tem quatro peças e mais nada. A criança encaixa, monta
              a cidade do jeito dela e só depois pega o celular, para ver de pé
              o que acabou de montar. Cada peça foi testada com crianças de
              cinco a dez anos antes de ir para a produção, e o que não aguentou
              uma tarde de brincadeira ficou de fora da caixa.
            </p>
          </div>
        </div>
      </div>

      <Descer destino="#perguntas" rotulo="as perguntas" />
    </section>
  );
}

export default Autor;
