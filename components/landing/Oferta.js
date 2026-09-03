import Image from "next/image";
import estilos from "components/landing/landing.module.css";
import BotaoComprar from "components/landing/BotaoComprar.js";

// TODO: preço, parcelamento e prazo de garantia ainda são de exemplo.
function Oferta() {
  return (
    <section className={`${estilos.secao} ${estilos.escuro}`} id="comprar">
      <div className={`${estilos.container} ${estilos.oferta}`}>
        <Image
          className={estilos.marca3d}
          src="/landing/logo-super-pista-3d.webp"
          alt=""
          width={900}
          height={614}
          sizes="260px"
        />

        <h2 className={estilos.h2}>
          A brincadeira começa quando a caixa chega
        </h2>
        <p className={estilos.lead}>
          O tabuleiro de quatro peças e o aplicativo. Sem assinatura e sem nada
          para comprar depois.
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

        <BotaoComprar />

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
