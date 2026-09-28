import Image from "next/image";
import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";
import BotaoComprar from "components/landing/BotaoComprar.js";
import VideoEmLoop from "components/midia/VideoEmLoop.js";

const FOTOS = [
  {
    arquivo: "/landing/junto-avo.webp",
    descricao:
      "Avó deitada no tabuleiro montado com os dois netos, segurando a sacola do Super Pista e sorrindo.",
  },
  {
    arquivo: "/landing/junto-mae.webp",
    descricao:
      "Mãe deitada no chão ao lado do tabuleiro, rindo com os dois filhos no meio dos carrinhos.",
  },
];

// A dobra do convite: o tabuleiro no tapete chama os adultos para o chão.
function BrincarJunto() {
  return (
    <section className={`${estilos.secao} ${estilos.claro}`} id="junto">
      <div className={estilos.container}>
        <div className={estilos.introLado}>
          <h2 className={estilos.h2}>Senta aqui e brinca comigo</h2>
          <p className={estilos.corpoEscuro}>
            É o convite que toda criança faz e que a correria faz a gente adiar.
            Com a cidade montada no tapete, sobra lugar para o pai, a mãe, os
            avós e até para o irmão mais velho que jura que já cresceu.
          </p>
        </div>

        <div className={estilos.mosaico}>
          <div
            className={`${estilos.caixaMidia} ${estilos.ladrilho} ${estilos.ladrilhoGrande}`}
          >
            <VideoEmLoop
              className={estilos.preencher}
              src="/landing/junto-avos.mp4"
              poster="/landing/junto-avos-poster.webp"
              rotulo="Avós sentados no sofá olham os netos brincando no tabuleiro montado no tapete, cercado de blocos de montar."
            />
          </div>

          {FOTOS.map((foto) => (
            <div
              className={`${estilos.caixaMidia} ${estilos.ladrilho}`}
              key={foto.arquivo}
            >
              <Image
                className={estilos.cobrir}
                src={foto.arquivo}
                alt={foto.descricao}
                fill
                sizes="(min-width: 760px) 440px, 92vw"
              />
            </div>
          ))}
        </div>

        <div className={estilos.chamada}>
          <BotaoComprar>Quero mais tardes assim</BotaoComprar>
        </div>
      </div>

      <Descer destino="#o-que-vem" rotulo="o que vem na sacola" />
    </section>
  );
}

export default BrincarJunto;
