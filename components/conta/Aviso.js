import estilos from "components/conta/conta.module.css";

// Erro do formulário inteiro, no formato que a API devolve: `message` diz o
// que aconteceu e `action` diz o que fazer.
function Aviso({ erro }) {
  if (!erro) {
    return null;
  }

  return (
    <div className={estilos.aviso} role="alert">
      <p className={estilos.avisoTitulo}>{erro.message}</p>
      {erro.action && <p>{erro.action}</p>}
    </div>
  );
}

export default Aviso;
