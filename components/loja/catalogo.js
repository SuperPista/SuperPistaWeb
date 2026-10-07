// Catálogo da loja. Enquanto não existe a API de produtos, é daqui que a
// vitrine, a página do produto, a sacola e a oferta da landing leem nome,
// preço e fotos. Quando o servidor passar a responder por isso, o preço que
// vale é o dele: o que está aqui só serve para mostrar.
//
// Há dois tipos de produto. Cada tabuleiro é uma cidade diferente, conhecida
// pela cor, e é um produto à parte, com descrição própria. Os kits são o que
// completa a cidade para quem quer mais brinquedos. Na vitrine todos aparecem
// juntos, na mesma prateleira.
//
// Os valores ficam em centavos (components/loja/dinheiro.js).
//
// TODO: todo preço e parcelamento daqui ainda é de exemplo.
// TODO: os tabuleiros amarelo, verde e azul e os dois kits ainda não têm foto
// nem descrição oficial. O nome e o resumo deles são provisórios, e as imagens
// em public/loja são ilustrativas, feitas do que o site já tinha: a arte do
// tabuleiro vermelho recolorida (a cidade desenhada é a dele, não a de cada
// cor) e recortes de uma foto do tabuleiro com brinquedos em volta. Elas levam
// `ilustrativa: true`, e as telas avisam. Trocar pelas fotos de verdade.
// TODO: confirmar se as quatro cidades vêm com os mesmos itens na sacola e se
// todas aceitam o nome da criança. Por enquanto valem os do tabuleiro
// vermelho, que é o único com descrição oficial.
export const TABULEIROS = "tabuleiros";
export const KITS = "kits";

// O tabuleiro vermelho é o que aparece na landing e nas fotos do site.
export const SLUG_DO_TABULEIRO = "tabuleiro-vermelho";

// O frete é grátis para todo o Brasil, então não há cálculo por CEP.
export const FRETE = 0;

// O conteúdo segue a descrição oficial do produto.
const ITENS_DO_TABULEIRO = [
  {
    quantidade: "4",
    descricao:
      "peças de tabuleiro em MDF de reflorestamento, com 38 × 38 cm cada",
  },
  {
    quantidade: "1",
    descricao: "sacola reforçada para levar a cidade para onde a família for",
  },
  {
    quantidade: "1",
    descricao: "cartão com o código de ativação do aplicativo",
  },
  {
    quantidade: "Grátis",
    descricao: "nome ou apelido da criança numa das peças, se você quiser",
  },
];

const FOTOS_DO_VERMELHO = [
  {
    src: "/landing/tabuleiro.webp",
    largura: 1400,
    altura: 992,
    descricao:
      "As quatro peças do tabuleiro vermelho montadas, com ruas, praça, estádio, hospital, escola e o círculo amarelo com o nome Daniel.",
    // arte recortada, sem fundo: fica inteira na moldura, sem cortar
    recortada: true,
  },
  {
    src: "/landing/sacola-tabuleiro.webp",
    largura: 1000,
    altura: 597,
    descricao:
      "Sacola do Super Pista em cima do tabuleiro montado, com casinhas e blocos de madeira em volta, num piso de madeira.",
  },
  {
    src: "/home/passo-pecas.webp",
    largura: 1100,
    altura: 722,
    descricao:
      "As quatro peças do tabuleiro separadas sobre um piso de madeira, antes de encaixar.",
  },
  {
    src: "/home/passo-brinquedos.webp",
    largura: 1100,
    altura: 698,
    descricao:
      "Tabuleiro montado com carrinhos, casinhas e bonecos espalhados pelas ruas.",
  },
  {
    src: "/home/passo-cidade-3d.webp",
    largura: 1100,
    altura: 746,
    descricao:
      "A cidade do tabuleiro em 3D, com prédios, estádio e árvores de pé sobre as ruas.",
  },
];

// A arte do tabuleiro vermelho recolorida, com o mesmo recorte e tamanho.
function arteIlustrativa(cor) {
  return {
    src: `/loja/tabuleiro-${cor}.webp`,
    largura: 1400,
    altura: 992,
    descricao: `Tabuleiro Super Pista ${cor}, com as quatro peças montadas.`,
    recortada: true,
    ilustrativa: true,
  };
}

// Cada tabuleiro é uma cidade diferente, conhecida pela cor.
function tabuleiro({ cor, tinta, resumo, fotos }) {
  return {
    slug: `tabuleiro-${cor.toLowerCase()}`,
    colecao: TABULEIROS,
    nome: `Tabuleiro Super Pista ${cor}`,
    nomeCurto: `Tabuleiro ${cor}`,
    cor: { nome: cor, tinta },
    resumo,
    preco: 24900,
    precoAntes: 34900,
    parcelas: { vezes: 12, valor: 2430 },
    // o nome ou apelido da criança sai impresso numa das peças, sem custo
    aceitaNome: true,
    // o cartão que vem na sacola ativa o aplicativo de Realidade Aumentada
    comAplicativo: true,
    fotos,
    itens: ITENS_DO_TABULEIRO,
    garantias: [
      "Com o aplicativo de Realidade Aumentada",
      "Feito sob encomenda",
      "Frete grátis para todo o Brasil",
      "Sete dias para devolver",
    ],
  };
}

function kit({ slug, nome, resumo, preco, fotos }) {
  return {
    slug,
    colecao: KITS,
    nome,
    nomeCurto: nome,
    resumo,
    preco,
    aceitaNome: false,
    comAplicativo: false,
    fotos,
    garantias: ["Frete grátis para todo o Brasil", "Sete dias para devolver"],
  };
}

// As cores são as mesmas das letras do nome impresso no tabuleiro.
const PRODUTOS = [
  tabuleiro({
    cor: "Vermelho",
    tinta: "#e4002b",
    resumo:
      "A cidade vermelha tem praça, banco, hospital, escola, academia e estádio, em quatro peças de MDF. A criança brinca com os brinquedos que já tem e, com o aplicativo de Realidade Aumentada, vê a cidade de pé em 3D no celular.",
    fotos: FOTOS_DO_VERMELHO,
  }),
  tabuleiro({
    cor: "Amarelo",
    tinta: "#ffd100",
    resumo:
      "A cidade amarela do Super Pista, diferente das outras três, com pista de carrinhos em quatro peças de MDF. Com o aplicativo de Realidade Aumentada, ela aparece de pé em 3D no celular.",
    fotos: [arteIlustrativa("amarelo")],
  }),
  tabuleiro({
    cor: "Verde",
    tinta: "#00a94f",
    resumo:
      "A cidade verde do Super Pista, diferente das outras três, com pista de carrinhos em quatro peças de MDF. Com o aplicativo de Realidade Aumentada, ela aparece de pé em 3D no celular.",
    fotos: [arteIlustrativa("verde")],
  }),
  tabuleiro({
    cor: "Azul",
    tinta: "#0057d8",
    resumo:
      "A cidade azul do Super Pista, diferente das outras três, com pista de carrinhos em quatro peças de MDF. Com o aplicativo de Realidade Aumentada, ela aparece de pé em 3D no celular.",
    fotos: [arteIlustrativa("azul")],
  }),
  kit({
    slug: "kit-de-carrinhos",
    nome: "Kit de carrinhos",
    resumo:
      "Carrinhos para as ruas, os estacionamentos e a pista do tabuleiro Super Pista.",
    preco: 5990,
    fotos: [
      {
        src: "/loja/kit-de-carrinhos.webp",
        largura: 960,
        altura: 720,
        descricao:
          "Três carrinhos de brinquedo, um preto, um laranja e um amarelo, ao lado do tabuleiro Super Pista.",
        ilustrativa: true,
      },
    ],
  }),
  kit({
    slug: "kit-de-blocos",
    nome: "Kit de blocos de montar",
    resumo:
      "Blocos de montar para levantar casas e prédios em cima da cidade do tabuleiro.",
    preco: 7990,
    fotos: [
      {
        src: "/loja/kit-de-blocos.webp",
        largura: 960,
        altura: 720,
        descricao:
          "Casinhas montadas com blocos de montar ao lado do tabuleiro Super Pista.",
        ilustrativa: true,
      },
    ],
  }),
];

export function todosOsProdutos() {
  return PRODUTOS;
}

export function produtosDaColecao(colecao) {
  return PRODUTOS.filter((produto) => produto.colecao === colecao);
}

export function produtoPorSlug(slug) {
  return PRODUTOS.find((produto) => produto.slug === slug) ?? null;
}
