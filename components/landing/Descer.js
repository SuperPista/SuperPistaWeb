import estilos from "components/landing/landing.module.css";

// Aviso de que a página continua: o eixo tracejado da pista virado para baixo.
// Aparece no fim de cada dobra, alternando entre a esquerda e a direita.
function Descer({ destino, rotulo, direita = false }) {
  const classes = direita
    ? `${estilos.container} ${estilos.descerLinha} ${estilos.descerDireita}`
    : `${estilos.container} ${estilos.descerLinha}`;

  return (
    <div className={classes}>
      <a
        className={estilos.descer}
        href={destino}
        aria-label={`Descer para ${rotulo}`}
      >
        <svg
          className={estilos.descerSeta}
          viewBox="0 0 28 58"
          aria-hidden="true"
        >
          <rect x="12" y="0" width="4" height="12" fill="currentColor" />
          <rect x="12" y="17" width="4" height="12" fill="currentColor" />
          <path
            className={estilos.descerPonta}
            d="M14 55L3 37h22z"
            stroke="#000"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}

export default Descer;
