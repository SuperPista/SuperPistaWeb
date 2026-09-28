exports.up = (pgm) => {
  pgm.createTable("password_reset_tokens", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    // Só o hash SHA-256 do token vai para o banco. Quem lê a tabela não
    // consegue montar um link válido e trocar a senha de ninguém.
    token_hash: {
      type: "varchar(64)",
      notNull: true,
      unique: true,
    },

    user_id: {
      type: "uuid",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },

    used_at: {
      type: "timestamptz",
      notNull: false,
    },

    expires_at: {
      type: "timestamptz",
      notNull: true,
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

  pgm.createIndex("password_reset_tokens", "user_id");
};

exports.down = false;
