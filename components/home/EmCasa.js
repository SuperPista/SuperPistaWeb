import Image from "next/image";
import landing from "components/landing/landing.module.css";
import estilos from "components/home/home.module.css";

const FOTOS = [
  {
    arquivo: "/home/casa-tablets.webp",
    descricao:
      "Três crianças sentadas em volta do tabuleiro montado no tapete, com celulares e um tablet mostrando o logo do Super Pista.",
    grande: true,
  },
  {
    arquivo: "/home/casa-celular.webp",
    descricao:
      "Menino sorrindo com um celular numa mão e um foguete de blocos de montar na outra.",
  },
  {
    arquivo: "/home/casa-sacola.webp",
    descricao:
      "Pai e dois filhos deitados no chão entre carrinhos e blocos, segurando a sacola do Super Pista.",
  },
];

function EmCasa() {
  return (
    <section className={landing.secao} id="em-casa">
      <div className={landing.container}>
        <div className={estilos.introLado}>
          <h2 className={landing.h2}>
            Brinquedo de sempre, celular quando quiser
          </h2>
          <p className={landing.corpo}>
            O celular é opcional. Sem ele, o Super Pista continua sendo uma
            pista de carrinhos e uma cidade para ocupar com os brinquedos da
            casa. Indicado a partir de 4 anos.
          </p>
        </div>

        <div className={estilos.galeria}>
          {FOTOS.map((foto) => (
            <div
              className={
                foto.grande
                  ? `${estilos.fotoCasa} ${estilos.fotoGrande}`
                  : estilos.fotoCasa
              }
              key={foto.arquivo}
            >
              <Image
                className={estilos.cobrir}
                src={foto.arquivo}
                alt={foto.descricao}
                fill
                sizes={
                  foto.grande
                    ? "(min-width: 760px) 700px, 92vw"
                    : "(min-width: 760px) 440px, 92vw"
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EmCasa;
