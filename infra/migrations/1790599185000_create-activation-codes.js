exports.up = (pgm) => {
  pgm.createTable("activation_codes", {
    id: {
      type: "uuid",
      primaryKey: true,
    },

    // Código digitado no aplicativo ou lido no cartão da sacola (ex.: SP-7KQ2MX-VM).
    code: {
      type: "varchar(16)",
      notNull: true,
      unique: true,
    },

    // Qual cidade/tabuleiro este código libera (vermelho, amarelo, verde, azul).
    board: {
      type: "varchar(32)",
      notNull: true,
    },

    // Pedido da loja em que o tabuleiro foi comprado.
    order_id: {
      type: "uuid",
      references: "orders",
      onDelete: "CASCADE",
      notNull: false,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });

  pgm.createIndex("activation_codes", "order_id");

  // Aparelhos que já ativaram o código. Cada código permite no máximo 2 aparelhos distintos.
  pgm.createTable("activation_code_devices", {
    id: {
      type: "uuid",
      primaryKey: true,
    },

    code_id: {
      type: "uuid",
      notNull: true,
      references: "activation_codes",
      onDelete: "CASCADE",
    },

    // Identificador único do aparelho (SystemInfo.deviceUniqueIdentifier no Unity).
    device_id: {
      type: "varchar(128)",
      notNull: true,
    },

    user_id: {
      type: "uuid",
      references: "users",
      onDelete: "SET NULL",
      notNull: false,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });

  pgm.addConstraint(
    "activation_code_devices",
    "activation_code_devices_code_device_key",
    {
      unique: ["code_id", "device_id"],
    },
  );

  pgm.createIndex("activation_code_devices", "device_id");
  pgm.createIndex("activation_code_devices", "code_id");
};

exports.down = false;
