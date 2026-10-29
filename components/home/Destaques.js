import { useId } from "react";
import Image from "next/image";
import Link from "next/link";
import landing from "components/landing/landing.module.css";
import estilos from "components/home/home.module.css";
import PopupDoNome from "components/home/PopupDoNome.js";
import Medalhao from "components/nome/Medalhao.js";
import useNomeDaCrianca from "components/nome/useNomeDaCrianca.js";
import { SLUG_DO_TABULEIRO } from "components/loja/catalogo.js";
import { linkDoProduto } from "components/loja/links.js";

// Depois da prateleira, o que faz o Super Pista ser o que é, em dois quadros:
// a foto de como se brinca, que leva para a página do tabuleiro, e o nome da
// criança, com o círculo mostrando o nome que a pessoa escrever no popup.
function Destaques() {
  const idNome = useId();
  const { nome, artigo } = useNomeDaCrianca();

  return (
    <section
      className={estilos.destaquesSecao}
      aria-label="Sobre o Super Pista"
    >
      <div className={`${landing.container} ${estilos.destaques}`}>
        <Link
          className={estilos.destaqueFoto}
          href={`${linkDoProduto(SLUG_DO_TABULEIRO)}#como-brinca`}
        >
          <span className={estilos.destaqueImagem}>
            <Image
              className={estilos.cobrir}
              src="/home/casa-tablets.webp"
              alt="Três crianças sentadas em volta do tabuleiro montado no tapete, entre blocos, carrinhos e bonecos."
              fill
              sizes="(min-width: 860px) 680px, 92vw"
            />
          </span>
          <span className={estilos.destaquePlaca}>
            <strong className={landing.h3}>
              Primeiro o brinquedo, depois a tela
            </strong>
            <span>
              A criança brinca com os carrinhos, blocos e bonecos que já tem. O
              celular entra depois, se ela quiser.
            </span>
            <span className={estilos.destaqueLink}>Ver como se brinca</span>
          </span>
        </Link>

        <div
          className={`${landing.claro} ${estilos.destaqueNome}`}
          role="group"
          aria-labelledby={idNome}
        >
          <div className={estilos.destaqueMedalhao}>
            <Medalhao nome={nome} artigo={artigo} />
          </div>
          <h2 className={landing.h3} id={idNome}>
            O nome da criança vai impresso no tabuleiro
          </h2>
          <p>
            Nome ou apelido, com até 10 letras, numa das quatro peças. É
            opcional e não custa nada.
          </p>
          <PopupDoNome />
        </div>
      </div>
    </section>
  );
}

export default Destaques;
