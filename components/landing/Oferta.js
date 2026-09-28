import Image from "next/image";
import estilos from "components/landing/landing.module.css";
import BotaoComprar from "components/landing/BotaoComprar.js";

// TODO: preço, parcelamento e prazo de garantia ainda são de exemplo.
function Oferta() {
  return (
    <section className={`${estilos.secao} ${estilos.escuro}`} id="comprar">
      <div className={`${estilos.container} ${estilos.oferta}`}>
        <div className={`${estilos.caixaMidia} ${estilos.ofertaFoto}`}>
          <Image
            className={estilos.cobrir}
            src="/landing/oferta-sacola.webp"
            alt="Menino e menina deitados no chão entre carrinhos e blocos, rindo, com a sacola do Super Pista nas mãos."
            fill
            sizes="(min-width: 600px) 520px, 92vw"
          />
        </div>

        <h2 className={estilos.h2}>Imagine essa cara quando a sacola chegar</h2>
        <p className={estilos.lead}>
          As quatro peças de MDF, a sacola reforçada, o cartão que ativa o
          aplicativo e o nome da criança impresso na cidade, sem custo a mais.
        </p>

        <p className={estilos.preco}>
          <span className={`${estilos.precoAntes} ${estilos.dado}`}>
            de R$ 349,00
          </span>
          <span className={estilos.precoAgora}>R$ 249</span>
          <span className={`${estilos.parcelas} ${estilos.dado}`}>
            ou 12x de R$ 24,30
          </span>
        </p>

        <BotaoComprar>Quero ver essa cara em casa</BotaoComprar>

        <ul className={`${estilos.garantia} ${estilos.dado}`}>
          <li>Frete grátis para todo o Brasil</li>
          <li>Sete dias para devolver</li>
          <li>Pagamento por Pix, boleto ou cartão</li>
        </ul>
      </div>
    </section>
  );
}

export default Oferta;
