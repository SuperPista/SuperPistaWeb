import {
  FILTROS_DE_VENDA,
  filtrarVendas,
  pedidosPagos,
  resumirVendas,
  vendaDaApi,
} from "components/vendas/vendas.js";

// Um pedido como GET /api/v1/orders devolve.
function pedidoDaLista(overrides = {}) {
  return {
    id: "c1b5e0a4-3f7e-4d38-9a51-0f4c7d2b8e61",
    code: "SP-7KQ2MX",
    status: "paid",
    items: [
      {
        slug: "tabuleiro-vermelho",
        product_name: "Tabuleiro Vermelho",
        child_name: "Celinha",
        article: "da",
        quantity: 1,
        unit_price: 24990,
        amount: 24990,
      },
    ],
    subtotal: 24990,
    shipping: 0,
    total: 24990,
    customer_name: "Marina Albuquerque",
    customer_email: "marina@example.com",
    customer_phone: "11987654321",
    customer_tax_id: "52998224725",
    shipping_address: {
      zip_code: "01310-100",
      street: "Avenida Paulista",
      number: "1000",
      complement: "Apto 12",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
    },
    abacatepay_checkout_id: "bill_abc123",
    dev_mode: false,
    paid_at: "2026-10-28T20:05:00.000Z",
    created_at: "2026-10-28T20:02:56.000Z",
    updated_at: "2026-10-28T20:05:00.000Z",
    ...overrides,
  };
}

describe("components/vendas/vendas.js", () => {
  describe(".vendaDaApi()", () => {
    test("keeps the order and adds the buyer contact", () => {
      const venda = vendaDaApi(pedidoDaLista());

      expect(venda).toMatchObject({
        codigo: "SP-7KQ2MX",
        situacao: "paid",
        deTeste: false,
        total: 24990,
        comprador: {
          nome: "Marina Albuquerque",
          email: "marina@example.com",
          celular: "(11) 98765-4321",
          cpf: "529.982.247-25",
        },
        entrega: { cep: "01310-100", cidade: "São Paulo", estado: "SP" },
        cobranca: "bill_abc123",
        pagoEm: "2026-10-28T20:05:00.000Z",
      });
      expect(venda.itens[0]).toMatchObject({
        nome: "Celinha",
        artigo: "da",
        quantidade: 1,
        valor: 24990,
      });
    });
  });

  describe(".resumirVendas()", () => {
    test("adds up only the paid orders that were really charged", () => {
      const vendas = [
        pedidoDaLista({ total: 24990 }),
        pedidoDaLista({ total: 49980 }),
        pedidoDaLista({ status: "pending", total: 24990 }),
        pedidoDaLista({ status: "refunded", total: 24990 }),
        pedidoDaLista({ dev_mode: true, total: 24990 }),
      ].map(vendaDaApi);

      expect(resumirVendas(vendas)).toEqual({
        pagas: 2,
        total: 74970,
        pagasDeTeste: 1,
      });
    });

    test("with no orders", () => {
      expect(resumirVendas([])).toEqual({
        pagas: 0,
        total: 0,
        pagasDeTeste: 0,
      });
    });
  });

  describe(".filtrarVendas()", () => {
    const vendas = [
      "paid",
      "pending",
      "expired",
      "cancelled",
      "refunded",
      "paid",
    ].map((status) => vendaDaApi(pedidoDaLista({ status })));

    test.each([
      ["Tudo", 6],
      ["Pagos", 2],
      ["Falta pagar", 1],
      ["Encerrados", 3],
    ])("%s", (rotulo, esperado) => {
      const filtro = FILTROS_DE_VENDA.find((f) => f.rotulo === rotulo);

      expect(filtrarVendas(vendas, filtro.situacoes)).toHaveLength(esperado);
    });

    test("every status falls in one filter besides Tudo", () => {
      const separados = FILTROS_DE_VENDA.filter((f) => f.situacoes).flatMap(
        (f) => f.situacoes,
      );

      expect(separados.sort()).toEqual(
        ["cancelled", "expired", "paid", "pending", "refunded"].sort(),
      );
    });
  });

  describe(".pedidosPagos()", () => {
    test.each([
      [0, "0 pedidos pagos"],
      [1, "1 pedido pago"],
      [2, "2 pedidos pagos"],
    ])("with %i", (quantidade, esperado) => {
      expect(pedidosPagos(quantidade)).toBe(esperado);
    });
  });
});
