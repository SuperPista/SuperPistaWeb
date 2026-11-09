import { pedidoDaApi } from "components/loja/usePedido.js";
import { formatarCelular, formatarCpf } from "components/loja/campos.js";

// O nome de cada situação para quem cuida da loja. A página do pedido fala com
// quem comprou e usa outras palavras (pages/pedido/[id].js).
export const SITUACAO_DA_VENDA = {
  pending: "Falta pagar",
  paid: "Pago",
  expired: "Prazo vencido",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

// Os botões que separam a lista. Encerrados são os que não vão para a
// produção: o prazo venceu, o pagamento foi cancelado ou devolvido.
export const FILTROS_DE_VENDA = [
  { rotulo: "Tudo", situacoes: null },
  { rotulo: "Pagos", situacoes: ["paid"] },
  { rotulo: "Falta pagar", situacoes: ["pending"] },
  { rotulo: "Encerrados", situacoes: ["expired", "cancelled", "refunded"] },
];

export function filtrarVendas(vendas, situacoes) {
  return situacoes
    ? vendas.filter((venda) => situacoes.includes(venda.situacao))
    : vendas;
}

// Uma venda de GET /api/v1/orders: o mesmo pedido da página do pedido, com o
// contato de quem comprou, o CPF da nota e o id da cobrança na AbacatePay.
export function vendaDaApi(corpo) {
  return {
    ...pedidoDaApi(corpo),
    comprador: {
      nome: corpo.customer_name,
      email: corpo.customer_email,
      celular: formatarCelular(corpo.customer_phone),
      cpf: formatarCpf(corpo.customer_tax_id),
    },
    cobranca: corpo.abacatepay_checkout_id,
    pagoEm: corpo.paid_at,
  };
}

// O dinheiro que entrou: os pedidos pagos e a soma deles. Pedido de teste não
// entra na conta, porque nada foi cobrado, mas é contado à parte.
export function resumirVendas(vendas) {
  const pagas = vendas.filter((venda) => venda.situacao === "paid");
  const deVerdade = pagas.filter((venda) => !venda.deTeste);

  return {
    pagas: deVerdade.length,
    total: deVerdade.reduce((soma, venda) => soma + venda.total, 0),
    pagasDeTeste: pagas.length - deVerdade.length,
  };
}

export function pedidosPagos(quantidade) {
  return quantidade === 1 ? "1 pedido pago" : `${quantidade} pedidos pagos`;
}
