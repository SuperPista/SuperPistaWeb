import estilos from "components/loja/loja.module.css";
import { LIMITE_POR_LINHA } from "components/loja/sacola.js";

// Menos, quantidade, mais. Na sacola há um destes por linha, então o rótulo
// diz de qual produto é.
function Quantidade({ valor, aoMudar, rotulo = "Quantidade" }) {
  return (
    <div className={estilos.quantidade} role="group" aria-label={rotulo}>
      <button
        type="button"
        aria-label="Diminuir"
        disabled={valor <= 1}
        onClick={() => aoMudar(valor - 1)}
      >
        <span aria-hidden="true">−</span>
      </button>
      <output className={estilos.quantidadeValor} aria-live="polite">
        {valor}
      </output>
      <button
        type="button"
        aria-label="Aumentar"
        disabled={valor >= LIMITE_POR_LINHA}
        onClick={() => aoMudar(valor + 1)}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}

export default Quantidade;
