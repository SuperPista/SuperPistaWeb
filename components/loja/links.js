// Endereços da loja, usados no cabeçalho, na vitrine e nas telas da compra,
// e das duas páginas de apoio: como ativar o aplicativo e as dúvidas.
export const LINK_LOJA = "/loja";
export const LINK_APLICATIVO = "/aplicativo";
export const LINK_DUVIDAS = "/duvidas";
export const LINK_SACOLA = "/sacola";
export const LINK_FECHAR_PEDIDO = "/checkout";

export function linkDoProduto(slug) {
  return `${LINK_LOJA}/${slug}`;
}

export function linkDoPedido(id) {
  return `/pedido/${id}`;
}
