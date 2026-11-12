// Endereços da loja, usados no cabeçalho, na vitrine e nas telas da compra,
// das duas páginas de apoio (como ativar o aplicativo e as dúvidas) e da
// lista de vendas, que só abre para quem cuida da loja.
export const DOMINIO = "https://superpista.com";

export const LINK_LOJA = "/loja";
export const LINK_APLICATIVO = "/aplicativo";
export const LINK_DUVIDAS = "/duvidas";
export const LINK_SACOLA = "/sacola";
export const LINK_FECHAR_PEDIDO = "/checkout";
export const LINK_VENDAS = "/vendas";

export const LINK_INSTAGRAM = "https://instagram.com/superpista";
export const LINK_FACEBOOK = "https://facebook.com/superpista";
export const LINK_TIKTOK = "https://tiktok.com/@superpista";

export const REDES_SOCIAIS = [
  {
    nome: "Instagram",
    icone: "instagram",
    url: LINK_INSTAGRAM,
  },
  {
    nome: "Facebook",
    icone: "facebook",
    url: LINK_FACEBOOK,
  },
  {
    nome: "TikTok",
    icone: "tiktok",
    url: LINK_TIKTOK,
  },
];

export function urlAbsoluta(caminho = "") {
  if (!caminho) return DOMINIO;
  if (caminho.startsWith("http://") || caminho.startsWith("https://")) {
    return caminho;
  }
  const barra = caminho.startsWith("/") ? "" : "/";
  return `${DOMINIO}${barra}${caminho}`;
}

export function linkDoProduto(slug) {
  return `${LINK_LOJA}/${slug}`;
}

export function linkDoPedido(id) {
  return `/pedido/${id}`;
}
