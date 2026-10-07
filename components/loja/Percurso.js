import Link from "next/link";
import landing from "components/landing/landing.module.css";
import estilos from "components/loja/loja.module.css";
import { LINK_SACOLA } from "components/loja/links.js";

const ETAPAS = [
  { rotulo: "Sacola", destino: LINK_SACOLA },
  { rotulo: "Dados e entrega" },
  { rotulo: "Pagamento" },
  { rotulo: "Pedido feito" },
];

// Onde a pessoa está na compra, da sacola ao pedido feito. `atual` conta de
// zero. Dá para voltar à sacola enquanto o pedido não foi feito; depois dele
// não há mais o que mudar.
function Percurso({ atual }) {
  const feito = atual === ETAPAS.length - 1;

  return (
    <nav aria-label="Etapas da compra">
      <ol className={`${estilos.percurso} ${landing.dado}`}>
        {ETAPAS.map((etapa, indice) => (
          <li
            className={
              indice === atual
                ? `${estilos.etapa} ${estilos.etapaAtual}`
                : estilos.etapa
            }
            key={etapa.rotulo}
            aria-current={indice === atual ? "step" : undefined}
          >
            {etapa.destino && indice < atual && !feito ? (
              <Link href={etapa.destino}>{etapa.rotulo}</Link>
            ) : (
              <span>{etapa.rotulo}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Percurso;
