import estilos from "components/landing/landing.module.css";

// TODO: apontar para o checkout real (Mercado Pago ou PagSeguro).
// Enquanto ele não existe, todos os botões levam para a oferta no fim da página.
export const LINK_CHECKOUT = "#comprar";

function BotaoComprar({ compacto = false }) {
  const classes = compacto
    ? `${estilos.botao} ${estilos.botaoCompacto}`
    : estilos.botao;

  return (
    <a className={classes} href={LINK_CHECKOUT}>
      Comprar agora
    </a>
  );
}

export default BotaoComprar;
