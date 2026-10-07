import estilos from "components/landing/landing.module.css";

// TODO: apontar para o checkout real (Mercado Pago ou PagSeguro).
// Enquanto ele não existe, todos os botões levam para a oferta no fim da página.
export const LINK_CHECKOUT = "#comprar";

// Na landing cada botão fala da cena da dobra em que está, então o texto vem
// de quem usa. Sem texto, fica o rótulo neutro da home. Fora da página da
// oferta, `destino` aponta para ela.
function BotaoComprar({
  compacto = false,
  destino = LINK_CHECKOUT,
  children = "Comprar agora",
}) {
  const classes = compacto
    ? `${estilos.botao} ${estilos.botaoCompacto}`
    : estilos.botao;

  return (
    <a className={classes} href={destino}>
      {children}
    </a>
  );
}

export default BotaoComprar;
