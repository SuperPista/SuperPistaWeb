import estilos from "components/landing/landing.module.css";

// Separador entre dobras: asfalto com eixo tracejado ou bandeira de chegada.
function Faixa({ chegada = false }) {
  const classes = chegada
    ? `${estilos.faixa} ${estilos.faixaChegada}`
    : estilos.faixa;

  return <div className={classes} aria-hidden="true" />;
}

export default Faixa;
