import Image from "next/image";
import Link from "next/link";
import landing from "components/landing/landing.module.css";
import estilos from "components/home/home.module.css";
import BotaoComprar from "components/landing/BotaoComprar.js";
import { LINK_LOGIN } from "components/home/links.js";

// Fechamento da home e destino dos botões de compra dela, até existir checkout.
function Chamada() {
  return (
    <section className={`${landing.secao} ${landing.escuro}`} id="comprar">
      <div className={`${landing.container} ${landing.oferta}`}>
        <Image
          className={landing.marca3d}
          src="/landing/logo-super-pista-3d.webp"
          alt=""
          width={900}
          height={614}
          sizes="260px"
        />

        <h2 className={landing.h2}>
          A primeira cidade começa com quatro peças
        </h2>
        <p className={landing.lead}>
          Feito sob encomenda em MDF, com a sacola reforçada, o cartão que ativa
          o aplicativo e o nome da criança se você quiser.
        </p>

        <BotaoComprar />

        <p className={estilos.jaTenho}>
          Já comprou? <Link href={LINK_LOGIN}>Fazer login</Link>
        </p>
      </div>
    </section>
  );
}

export default Chamada;
