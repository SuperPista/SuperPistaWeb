import { useId } from "react";
import estilos from "components/nome/nome.module.css";

const LIMITE_DE_LETRAS = 10;

// Campo controlado do nome da criança: quem usa guarda o nome e passa o mesmo
// valor para o Medalhao. O campo só aceita o que pode ser impresso, um nome só
// com letras de A a Z, até o limite.
function CampoDoNome({ nome, aoMudar }) {
  const id = useId();

  function aoDigitar(evento) {
    const somenteLetras = evento.target.value
      .replace(/[^A-Za-z]/g, "")
      .slice(0, LIMITE_DE_LETRAS);

    aoMudar(somenteLetras);
  }

  return (
    <div className={estilos.campo}>
      <label className={estilos.rotulo} htmlFor={id}>
        Nome da criança
      </label>
      <input
        className={estilos.entrada}
        id={id}
        name="nome-da-crianca"
        type="text"
        inputMode="text"
        autoComplete="off"
        maxLength={LIMITE_DE_LETRAS}
        placeholder="Daniel"
        value={nome}
        onChange={aoDigitar}
      />
      <p className={estilos.regra}>
        Um nome só, com até {LIMITE_DE_LETRAS} letras de A a Z, sem acentos,
        números ou símbolos. Você informa o nome no pedido.
      </p>
      <p className={estilos.regra}>
        As letras têm cerca de 3 cm, saem com cores sortidas e podem vir
        alinhadas ou espalhadas para ocupar o círculo.
      </p>
    </div>
  );
}

export default CampoDoNome;
