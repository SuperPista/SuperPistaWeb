import { useState } from "react";

import landing from "components/landing/landing.module.css";
import estilos from "components/conta/conta.module.css";
import Campo from "components/conta/Campo.js";
import Aviso from "components/conta/Aviso.js";
import { pedir } from "components/conta/pedir.js";

// Exclui a conta de vez. Fechado, é só uma linha discreta no pé da placa da
// Minha conta. Aberto, vira um quadro de borda vermelha que diz o que se perde
// e pede o nome de usuário digitado: um clique distraído não apaga nada.
function ExcluirConta({ usuario, aoExcluir }) {
  const [aberto, setAberto] = useState(false);
  const [confirmacao, setConfirmacao] = useState("");
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState(null);

  const confirmou = confirmacao === usuario.username;

  function fechar() {
    setAberto(false);
    setConfirmacao("");
    setErro(null);
  }

  async function aoEnviar(evento) {
    evento.preventDefault();

    if (!confirmou) {
      return;
    }

    setExcluindo(true);
    setErro(null);

    const resposta = await pedir(
      `/api/v1/users/${encodeURIComponent(usuario.username)}`,
      { metodo: "DELETE" },
    );

    if (!resposta.ok) {
      setExcluindo(false);
      setErro(resposta.corpo);
      return;
    }

    aoExcluir();
  }

  if (!aberto) {
    return (
      <p>
        Não vai mais usar a conta?{" "}
        <button
          className={estilos.botaoTexto}
          type="button"
          aria-expanded="false"
          onClick={() => setAberto(true)}
        >
          Excluir conta
        </button>
      </p>
    );
  }

  return (
    <form
      className={estilos.exclusao}
      onSubmit={aoEnviar}
      aria-labelledby="titulo-exclusao"
    >
      <h2 className={estilos.secaoTitulo} id="titulo-exclusao">
        Excluir conta
      </h2>
      <p>
        Apaga a conta e tudo o que está ligado a ela. Você deixa de entrar no
        site e no aplicativo com este e-mail. Não dá para desfazer.
      </p>

      <Campo
        rotulo={`Para confirmar, digite ${usuario.username}`}
        name="confirmacao"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        autoFocus
        value={confirmacao}
        onChange={(evento) => setConfirmacao(evento.target.value)}
      />

      <Aviso erro={erro} />

      <div className={estilos.linhaBotoes}>
        <button
          className={`${landing.botao} ${landing.botaoCompacto} ${estilos.perigo}`}
          type="submit"
          disabled={!confirmou || excluindo}
        >
          {excluindo ? "Excluindo..." : "Excluir minha conta"}
        </button>
        <button className={estilos.botaoTexto} type="button" onClick={fechar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default ExcluirConta;
