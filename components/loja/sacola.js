import { FRETE, produtoPorSlug } from "components/loja/catalogo.js";

// As contas da sacola, sem estado: quem guarda as linhas é o useSacola.
//
// Cada linha é um produto com a quantidade e, quando o produto aceita, o nome
// que vai impresso nele. Dois tabuleiros com nomes diferentes são duas linhas,
// porque são duas peças diferentes para produzir.
export const LIMITE_POR_LINHA = 10;

// O nome sai impresso em maiúsculas, então "ana" e "Ana" são a mesma linha.
export function chaveDaLinha({ slug, nome = "", artigo = "" }) {
  return nome === "" ? slug : `${slug}:${artigo}:${nome.toUpperCase()}`;
}

function limitar(quantidade) {
  const inteira = Math.trunc(quantidade) || 1;

  return Math.min(Math.max(inteira, 1), LIMITE_POR_LINHA);
}

export function adicionarLinha(
  linhas,
  { slug, quantidade = 1, nome = "", artigo = "" },
) {
  // sem nome não há "da" ou "do" para guardar
  const nova = {
    slug,
    quantidade: limitar(quantidade),
    nome,
    artigo: nome === "" ? "" : artigo,
  };
  const chave = chaveDaLinha(nova);

  if (!linhas.some((linha) => chaveDaLinha(linha) === chave)) {
    return [...linhas, nova];
  }

  return linhas.map((linha) =>
    chaveDaLinha(linha) === chave
      ? { ...linha, quantidade: limitar(linha.quantidade + nova.quantidade) }
      : linha,
  );
}

export function mudarQuantidadeDaLinha(linhas, chave, quantidade) {
  return linhas.map((linha) =>
    chaveDaLinha(linha) === chave
      ? { ...linha, quantidade: limitar(quantidade) }
      : linha,
  );
}

export function removerLinha(linhas, chave) {
  return linhas.filter((linha) => chaveDaLinha(linha) !== chave);
}

// O que as telas mostram: cada linha com o seu produto e o seu valor, e os
// totais. A sacola fica guardada no navegador por dias, então uma linha pode
// apontar para um produto que já saiu do catálogo: essa linha é ignorada.
export function resumirSacola(linhas) {
  const itens = linhas.flatMap((linha) => {
    const produto = produtoPorSlug(linha.slug);

    if (!produto) {
      return [];
    }

    return [
      {
        ...linha,
        chave: chaveDaLinha(linha),
        produto,
        valor: produto.preco * linha.quantidade,
      },
    ];
  });

  const subtotal = itens.reduce((soma, item) => soma + item.valor, 0);

  return {
    itens,
    quantidade: itens.reduce((soma, item) => soma + item.quantidade, 0),
    subtotal,
    frete: FRETE,
    total: subtotal + FRETE,
    vazia: itens.length === 0,
  };
}

// "da CELINHA", do jeito que sai no círculo da peça, ou null sem nome.
export function nomeNaPeca({ nome, artigo }) {
  return nome ? `${artigo} ${nome}`.trim().toUpperCase() : null;
}
