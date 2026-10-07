// Contas ativadas antes desta versão não receberam `delete:user`, que agora
// vem junto na ativação. Sem ela, quem já tinha conta não conseguiria excluí-la
// pelo site.
exports.up = (pgm) => {
  pgm.sql(`
    UPDATE
      users
    SET
      features = array_append(features, 'delete:user'),
      updated_at = timezone('utc', now())
    WHERE
      'create:session' = ANY(features)
      AND NOT ('delete:user' = ANY(features))
    ;
  `);
};

exports.down = false;
