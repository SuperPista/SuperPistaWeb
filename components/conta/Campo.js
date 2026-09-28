import { useId, useState } from "react";
import estilos from "components/conta/conta.module.css";

// Campo das telas da conta: rótulo em cima, dica e erro embaixo, os dois
// ligados à entrada por aria-describedby. O campo de senha ganha o botão
// Mostrar, que no celular poupa digitar às cegas.
function Campo({ rotulo, type = "text", dica, erro, ...entrada }) {
  const id = useId();
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const ehSenha = type === "password";
  const idDica = dica ? `${id}-dica` : null;
  const idErro = erro ? `${id}-erro` : null;
  const descricao = [idDica, idErro].filter(Boolean).join(" ") || undefined;

  return (
    <div className={estilos.campo}>
      <label className={estilos.rotulo} htmlFor={id}>
        {rotulo}
      </label>

      <div className={ehSenha ? estilos.senha : undefined}>
        <input
          className={estilos.entrada}
          id={id}
          type={ehSenha && senhaVisivel ? "text" : type}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricao}
          {...entrada}
        />
        {ehSenha && (
          <button
            className={estilos.mostrar}
            type="button"
            aria-controls={id}
            aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
            onClick={() => setSenhaVisivel(!senhaVisivel)}
          >
            {senhaVisivel ? "Ocultar" : "Mostrar"}
          </button>
        )}
      </div>

      {dica && (
        <p className={estilos.dica} id={idDica}>
          {dica}
        </p>
      )}
      {erro && (
        <p className={estilos.erroCampo} id={idErro}>
          {erro}
        </p>
      )}
    </div>
  );
}

export default Campo;
