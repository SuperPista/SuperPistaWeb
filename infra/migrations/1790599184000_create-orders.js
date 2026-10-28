exports.up = (pgm) => {
  pgm.createTable("orders", {
    // Gerado no servidor antes de abrir o pagamento, porque o endereço de volta
    // da AbacatePay já leva o id. É ele que vai na URL do pedido: um UUID não
    // dá para adivinhar, e a página do pedido mostra nome e endereço.
    id: {
      type: "uuid",
      primaryKey: true,
    },

    // O código que a pessoa lê e dita por telefone, como SP-7KQ2MX.
    code: {
      type: "varchar(9)",
      notNull: true,
      unique: true,
    },

    status: {
      type: "varchar(16)",
      notNull: true,
      default: "pending",
      check:
        "status IN ('pending', 'paid', 'expired', 'cancelled', 'refunded')",
    },

    // Cópia do que foi comprado, com nome e preço do dia do pedido.
    items: {
      type: "jsonb",
      notNull: true,
    },

    // Valores em centavos.
    subtotal: {
      type: "integer",
      notNull: true,
    },

    shipping: {
      type: "integer",
      notNull: true,
    },

    total: {
      type: "integer",
      notNull: true,
    },

    customer_name: {
      type: "text",
      notNull: true,
    },

    customer_email: {
      type: "varchar(254)",
      notNull: true,
    },

    // Celular e CPF só com os dígitos. O CPF vai na nota fiscal.
    customer_phone: {
      type: "varchar(11)",
      notNull: true,
    },

    customer_tax_id: {
      type: "varchar(11)",
      notNull: true,
    },

    shipping_address: {
      type: "jsonb",
      notNull: true,
    },

    abacatepay_checkout_id: {
      type: "varchar(64)",
      notNull: true,
      unique: true,
    },

    payment_url: {
      type: "text",
      notNull: true,
    },

    // Pedido pago com a chave de teste da AbacatePay: nada foi cobrado.
    dev_mode: {
      type: "boolean",
      notNull: true,
    },

    paid_at: {
      type: "timestamptz",
      notNull: false,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
