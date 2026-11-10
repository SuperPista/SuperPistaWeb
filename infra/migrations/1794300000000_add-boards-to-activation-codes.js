exports.up = (pgm) => {
  pgm.addColumns("activation_codes", {
    boards: { type: "text[]" },
  });

  // Os códigos já entregues continuam liberando exatamente a cor original.
  pgm.sql("UPDATE activation_codes SET boards = ARRAY[board];");
  pgm.alterColumn("activation_codes", "boards", { notNull: true });
  pgm.addConstraint("activation_codes", "activation_codes_boards_valid", {
    check: `cardinality(boards) > 0
      AND array_position(boards, NULL) IS NULL
      AND boards <@ ARRAY['vermelho', 'amarelo', 'verde', 'azul']::text[]
      AND board = boards[1]`,
  });
};

exports.down = false;
