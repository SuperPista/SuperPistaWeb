exports.up = (pgm) => {
  pgm.addColumns("orders", {
    activation_email_sent_at: { type: "timestamptz" },
  });
};

exports.down = false;
