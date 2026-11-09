import estilos from "components/landing/landing.module.css";

// Todos os botões da landing levam para a oferta no fim da página. É o botão
// da oferta (components/landing/Oferta.js) que põe o tabuleiro na sacola.
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
