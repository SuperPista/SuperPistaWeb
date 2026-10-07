import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// TODO: trocar por POST /api/v1/orders e GET /api/v1/orders/[id] quando o
// backend da loja existir. Até lá não há pagamento nem pedido de verdade: o
// "pedido" é montado no navegador e guardado só nesta aba (sessionStorage),
// para as telas da compra poderem ser vistas do começo ao fim. As telas avisam
// que é um exemplo.
const usePedido = create(
  persist(
    (set) => ({
      pedido: null,
      pronto: false,

      registrar: (pedido) => set({ pedido }),
    }),
    {
      name: "superpista-pedido",
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (estado) => ({ pedido: estado.pedido }),
      skipHydration: true,
    },
  ),
);

// As etapas de um pedido feito sob encomenda, na ordem em que acontecem.
export const ETAPAS_DO_PEDIDO = [
  "Pedido recebido",
  "Pagamento confirmado",
  "Em produção",
  "A caminho",
  "Entregue",
];

// Letras e números que não se confundem ao ditar por telefone: sem 0, O, 1, I.
const ALFABETO = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function novoCodigo() {
  let codigo = "";

  for (let i = 0; i < 6; i += 1) {
    codigo += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  }

  return `SP-${codigo}`;
}

// Guarda uma cópia do que foi comprado, e não a referência ao catálogo: um
// pedido mostra o nome e o preço do dia em que foi feito. CPF e celular ficam
// de fora, porque nenhuma tela do pedido mostra.
export function montarPedidoDeExemplo({ resumo, comprador, entrega }) {
  return {
    id: novoCodigo(),
    deExemplo: true,
    etapa: 0,
    feitoEm: new Date().toISOString(),
    itens: resumo.itens.map((item) => ({
      chave: item.chave,
      slug: item.slug,
      produto: { nome: item.produto.nome },
      nome: item.nome,
      artigo: item.artigo,
      quantidade: item.quantidade,
      valor: item.valor,
    })),
    subtotal: resumo.subtotal,
    frete: resumo.frete,
    total: resumo.total,
    comprador: { nome: comprador.nome, email: comprador.email },
    entrega,
  };
}

export default usePedido;
