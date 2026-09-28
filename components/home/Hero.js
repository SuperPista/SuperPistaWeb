import Image from "next/image";
import Link from "next/link";
import landing from "components/landing/landing.module.css";
import estilos from "components/home/home.module.css";
import { CORES_DAS_LETRAS } from "components/nome/Medalhao.js";
import VideoEmLoop from "components/midia/VideoEmLoop.js";
import { LINK_LOGIN } from "components/conta/links.js";

// O "É HORA" do logo escrito do jeito que o nome da criança sai impresso no
// tabuleiro: cada letra com uma cor, na mesma ordem, e um pouco acima ou abaixo
// da linha. O relógio da marca entra no lugar do O.
const LEMA = [
  { letra: "É", cor: CORES_DAS_LETRAS[0], desvio: "-0.04em" },
  { letra: "H", cor: CORES_DAS_LETRAS[1], desvio: "0.03em" },
  { relogio: true, desvio: "-0.03em" },
  { letra: "R", cor: CORES_DAS_LETRAS[2], desvio: "0.05em" },
  { letra: "A", cor: CORES_DAS_LETRAS[3], desvio: "-0.02em" },
];

function Hero() {
  return (
    <section className={estilos.heroi}>
      <div className={`${landing.container} ${estilos.heroiGrade}`}>
        <div className={estilos.heroiTexto}>
          <h1 className={estilos.lema}>
            <span className={estilos.somenteLeitor}>
              É hora das brincadeiras saudáveis!
            </span>
            <span className={estilos.hora} aria-hidden="true">
              {LEMA.map((item, indice) =>
                item.relogio ? (
                  <Image
                    key={indice}
                    className={estilos.relogio}
                    style={{ "--desvio": item.desvio }}
                    src="/home/relogio.webp"
                    alt=""
                    width={440}
                    height={380}
                    priority
                  />
                ) : (
                  <span
                    key={indice}
                    className={estilos.letra}
                    data-letra={item.letra}
                    style={{ color: item.cor, "--desvio": item.desvio }}
                  >
                    {item.letra}
                  </span>
                ),
              )}
            </span>
            <span className={estilos.lemaResto} aria-hidden="true">
              das brincadeiras saudáveis!
            </span>
          </h1>

          <p className={landing.lead}>
            O Super Pista é um tabuleiro de mini cidade com pista de carrinhos.
            A criança brinca com os brinquedos que já tem em casa e, quando
            quiser, aponta o celular para ver a cidade de pé em 3D.
          </p>

          <div className={estilos.heroiAcoes}>
            <a className={landing.botao} href="#como-brinca">
              Conhecer o tabuleiro
            </a>
            <p className={estilos.jaTenho}>
              Já tem o seu? <Link href={LINK_LOGIN}>Fazer login</Link>
            </p>
          </div>
        </div>

        <figure className={estilos.heroiVideo}>
          <div className={estilos.moldura}>
            <VideoEmLoop
              className={estilos.videoMidia}
              src="/home/cidade-montando.mp4"
              poster="/home/cidade-montando-poster.webp"
            />
          </div>
          <figcaption className={`${estilos.legenda} ${landing.dado}`}>
            As quatro peças se encaixam e a cidade sobe em cima do tabuleiro.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export default Hero;
