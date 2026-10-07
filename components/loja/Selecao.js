import { useId } from "react";
import conta from "components/conta/conta.module.css";
import estilos from "components/loja/loja.module.css";

// Lista de escolha no mesmo desenho do Campo das telas da conta: rótulo em
// cima e o erro embaixo, ligado à lista por aria-describedby.
function Selecao({ rotulo, opcoes, erro, ...entrada }) {
  const id = useId();
  const idErro = erro ? `${id}-erro` : undefined;

  return (
    <div className={conta.campo}>
      <label className={conta.rotulo} htmlFor={id}>
        {rotulo}
      </label>
      <select
        className={estilos.selecao}
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={idErro}
        {...entrada}
      >
        <option value="">Escolha</option>
        {opcoes.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
      {erro && (
        <p className={conta.erroCampo} id={idErro}>
          {erro}
        </p>
      )}
    </div>
  );
}

export default Selecao;
