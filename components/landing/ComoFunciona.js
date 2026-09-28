import Image from "next/image";
import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";

// Os fatos seguem a descrição oficial do produto.
const ETAPAS = [
  {
    titulo: "Encaixe as quatro peças",
    texto:
      "As quatro peças de MDF, de 38 × 38 cm cada, formam uma cidade de 76 × 76 cm que cabe no tapete da sala. Quando a brincadeira acaba, tudo volta para a sacola.",
  },
  {
    titulo: "Chame os brinquedos da casa",
    texto:
      "Os carrinhos ganham pista, os bonecos ganham hospital, escola e estádio. Aquele brinquedo esquecido no fundo da caixa volta a ter onde morar.",
  },
  {
    titulo: "Veja a cidade de pé",
    texto:
      "Baixe o app Super Pista na Play Store ou na App Store e use grátis por 3 dias. Para continuar, faça login e digite o código do cartão que vem na sacola. Depois é só apontar a câmera para a imagem alvo da peça 1.",
  },
];

// O produto explicado na ordem em que a criança brinca.
function ComoFunciona() {
  return (
    <section
      className={`${estilos.secao} ${estilos.secaoColada}`}
      id="como-funciona"
    >
      <div className={estilos.container}>
        <div className={estilos.comoIntro}>
          <div className={estilos.introducao}>
            <h2 className={estilos.h2}>
              Montar é rápido. Brincar leva a tarde toda.
            </h2>
            <p className={estilos.lead}>
              A cidade é feita para os brinquedos que já existem na sua casa.
            </p>
          </div>

          <Image
            className={estilos.arteImagem}
            src="/landing/tabuleiro.webp"
            alt="Tabuleiro do Super Pista montado com as quatro peças numeradas, formando uma mini cidade com pista de carrinhos, estádio, hospital, escola, praça, academia e banco, e o nome Daniel no círculo amarelo da peça 4."
            width={1400}
            height={992}
            sizes="(min-width: 860px) 600px, 92vw"
          />
        </div>

        <ol className={estilos.etapas}>
          {ETAPAS.map((etapa) => (
            <li className={estilos.etapa} key={etapa.titulo}>
              <h3 className={estilos.h3}>{etapa.titulo}</h3>
              <p className={estilos.corpo}>{etapa.texto}</p>
            </li>
          ))}
        </ol>
      </div>

      <Descer destino="#junto" rotulo="a família brincando junto" direita />
    </section>
  );
}

export default ComoFunciona;
