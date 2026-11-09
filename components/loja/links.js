// Endereços da loja, usados no cabeçalho, na vitrine e nas telas da compra,
// das duas páginas de apoio (como ativar o aplicativo e as dúvidas) e da
// lista de vendas, que só abre para quem cuida da loja.
export const LINK_LOJA = "/loja";
export const LINK_APLICATIVO = "/aplicativo";
export const LINK_DUVIDAS = "/duvidas";
export const LINK_SACOLA = "/sacola";
export const LINK_FECHAR_PEDIDO = "/checkout";
export const LINK_VENDAS = "/vendas";

export function linkDoProduto(slug) {
  return `${LINK_LOJA}/${slug}`;
}

export function linkDoPedido(id) {
  return `/pedido/${id}`;
}
