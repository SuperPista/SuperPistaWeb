import Image from "next/image";
import landing from "components/landing/landing.module.css";
import estilos from "components/home/home.module.css";

// Na ordem em que a criança brinca: o tabuleiro vem antes da tela.
const PASSOS = [
  {
    titulo: "Encaixe as quatro peças",
    texto:
      "São quatro peças de MDF de reflorestamento, de 38 × 38 cm cada. Juntas, formam uma cidade de 76 × 76 cm com ruas, praça, banco, hospital, academia e estádio.",
    foto: "/home/passo-pecas.webp",
    descricao:
      "As quatro peças do tabuleiro separadas sobre um piso de madeira, antes de encaixar.",
  },
  {
    titulo: "Brinque com o que já tem em casa",
    texto:
      "Carrinhos, blocos de montar, bonecos e casinhas viram moradores da cidade. Nesta parte a tela fica de fora.",
    foto: "/home/passo-brinquedos.webp",
    descricao:
      "Tabuleiro montado com carrinhos, casinhas e bonecos espalhados pelas ruas.",
  },
  {
    titulo: "Aponte o celular, se quiser",
    texto:
      "Com o aplicativo, a câmera reconhece o tabuleiro e a cidade aparece em 3D, com os prédios, os semáforos e o estádio de pé.",
    foto: "/home/passo-cidade-3d.webp",
    descricao:
      "A cidade do tabuleiro em 3D, com prédios, estádio e árvores de pé sobre as ruas.",
  },
];

function ComoBrinca() {
  return (
    <section className={landing.secao} id="como-brinca">
      <div className={landing.container}>
        <div className={estilos.introLado}>
          <h2 className={landing.h2}>Primeiro o brinquedo, depois a tela</h2>
          <p className={landing.corpo}>
            O Super Pista não é um jogo. É a base onde os brinquedos da criança
            ganham ruas, sinalização de trânsito e uma cidade inteira em volta.
          </p>
        </div>

        <ol className={estilos.passos}>
          {PASSOS.map((passo) => (
            <li className={estilos.passo} key={passo.titulo}>
              <div className={estilos.passoFoto}>
                <Image
                  className={estilos.cobrir}
                  src={passo.foto}
                  alt={passo.descricao}
                  fill
                  sizes="(min-width: 860px) 370px, 92vw"
                />
              </div>
              <h3 className={landing.h3}>{passo.titulo}</h3>
              <p className={landing.corpo}>{passo.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default ComoBrinca;
