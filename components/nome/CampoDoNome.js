import { useId } from "react";
import estilos from "components/nome/nome.module.css";
import { NOME_DE_EXEMPLO } from "components/nome/useNomeDaCrianca.js";

const LIMITE_DE_LETRAS = 10;
const ARTIGOS = ["da", "do"];

// Campo controlado do nome da criança: quem usa guarda o nome e o artigo com o
// useNomeDaCrianca e passa os mesmos valores para o Medalhao. O campo só aceita
// o que pode ser impresso, um nome só com letras de A a Z, até o limite. Os
// botões ao lado corrigem o "da" ou "do" quando o palpite pelo nome erra, e só
// ficam ativos depois que há um nome escrito.
function CampoDoNome({ nome, artigo, aoMudar, aoEscolherArtigo }) {
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
      <div className={estilos.linha}>
        <fieldset className={estilos.artigos} disabled={nome === ""}>
          <legend className={estilos.somenteLeitor}>
            Da ou do antes do nome
          </legend>
          {ARTIGOS.map((opcao) => (
            <label className={estilos.artigo} key={opcao}>
              <input
                className={estilos.somenteLeitor}
                type="radio"
                name={`${id}-artigo`}
                value={opcao}
                checked={artigo === opcao}
                onChange={() => aoEscolherArtigo(opcao)}
              />
              <span className={estilos.artigoTexto}>{opcao}</span>
            </label>
          ))}
        </fieldset>
        <input
          className={estilos.entrada}
          id={id}
          name="nome-da-crianca"
          type="text"
          inputMode="text"
          autoComplete="off"
          maxLength={LIMITE_DE_LETRAS}
          placeholder={NOME_DE_EXEMPLO}
          value={nome}
          onChange={aoDigitar}
        />
      </div>
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
