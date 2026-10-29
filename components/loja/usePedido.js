import useSWR from "swr";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { pedir } from "components/conta/pedir.js";
import { chaveDaLinha } from "components/loja/sacola.js";

// As etapas de um pedido feito sob encomenda, na ordem em que acontecem.
export const ETAPAS_DO_PEDIDO = [
  "Pedido recebido",
  "Pagamento confirmado",
  "Em produção",
  "A caminho",
  "Entregue",
];

// Em que etapa cada situação da API deixa o pedido. As etapas de produção e
// entrega ainda não têm quem as marque no servidor.
const ETAPA_DA_SITUACAO = {
  pending: 0,
  paid: 1,
};

// Enquanto falta pagar, a página pergunta de tempos em tempos, para o Pix pago
// no celular aparecer aqui sem a pessoa recarregar.
const INTERVALO_ENQUANTO_PENDENTE = 5000;

// O id do último pedido feito nesta aba (sessionStorage). Quem volta da
// AbacatePay pelo botão do navegador cai no checkout com a sacola já vazia, e
// o checkout usa isto para levar a pessoa ao pedido em vez da sacola.
export const useUltimoPedido = create(
  persist(
    (set) => ({
      id: null,
      pronto: false,

      registrar: (id) => set({ id }),
    }),
    {
      name: "superpista-pedido",
      version: 2,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (estado) => ({ id: estado.id }),
      // a versão 1 guardava um pedido de exemplo inteiro, que não serve mais
      migrate: () => ({ id: null }),
      skipHydration: true,
    },
  ),
);

// O pedido da API no formato que as telas da loja já usam, igual ao da
// sacola: o Resumo e o nomeNaPeca leem os dois. A página de vendas parte
// daqui também (components/vendas/vendas.js).
export function pedidoDaApi(corpo) {
  const endereco = corpo.shipping_address;

  return {
    id: corpo.id,
    codigo: corpo.code,
    situacao: corpo.status,
    etapa: ETAPA_DA_SITUACAO[corpo.status] ?? null,
    deTeste: corpo.dev_mode,
    linkDePagamento: corpo.payment_url,
    feitoEm: corpo.created_at,
    itens: corpo.items.map((item) => {
      const linha = {
        slug: item.slug,
        nome: item.child_name,
        artigo: item.article,
      };

      return {
        ...linha,
        chave: chaveDaLinha(linha),
        produto: { nome: item.product_name },
        quantidade: item.quantity,
        valor: item.amount,
      };
    }),
    subtotal: corpo.subtotal,
    frete: corpo.shipping,
    total: corpo.total,
    comprador: { nome: corpo.customer_name },
    entrega: {
      cep: endereco.zip_code,
      rua: endereco.street,
      numero: endereco.number,
      complemento: endereco.complement,
      bairro: endereco.neighborhood,
      cidade: endereco.city,
      estado: endereco.state,
    },
  };
}

// Pedido que não existe volta null; qualquer outra falha vira erro do SWR,
// que guarda o que já tinha chegado.
async function buscarPedido(caminho) {
  const resposta = await pedir(caminho);

  if (resposta.status === 404) {
    return null;
  }

  if (!resposta.ok) {
    throw resposta.corpo;
  }

  return pedidoDaApi(resposta.corpo);
}

// O pedido lido de GET /api/v1/orders/[id]. Sem `id` (a rota ainda não leu a
// URL), espera.
function usePedido(id) {
  const { data, error } = useSWR(
    id ? `/api/v1/orders/${id}` : null,
    buscarPedido,
    {
      refreshInterval: (pedido) =>
        pedido?.situacao === "pending" ? INTERVALO_ENQUANTO_PENDENTE : 0,
    },
  );

  return {
    pedido: data ?? null,
    erro: data === undefined ? error : undefined,
    carregando: data === undefined && !error,
  };
}

export default usePedido;
