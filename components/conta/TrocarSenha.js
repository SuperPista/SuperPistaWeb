import { useState } from "react";

import landing from "components/landing/landing.module.css";
import estilos from "components/conta/conta.module.css";
import Campo from "components/conta/Campo.js";
import Aviso from "components/conta/Aviso.js";
import { pedir } from "components/conta/pedir.js";
import {
  DICA_DA_SENHA,
  SENHAS_DIFERENTES,
  conferirSenha,
} from "components/conta/senha.js";

// Troca a senha de quem está logado. Pede a senha atual porque uma sessão
// esquecida aberta num computador dos outros não pode bastar para tomar a
// conta. A API derruba as outras sessões e mantém esta.
function TrocarSenha() {
  const [aberto, setAberto] = useState(false);
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [repeticao, setRepeticao] = useState("");
  const [conferir, setConferir] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [trocou, setTrocou] = useState(false);

  const erroNova = conferir ? conferirSenha(nova) : null;
  const erroRepeticao =
    conferir && repeticao !== nova ? SENHAS_DIFERENTES : null;

  function abrir() {
    setAberto(true);
    setTrocou(false);
  }

  function fechar() {
    setAberto(false);
    setAtual("");
    setNova("");
    setRepeticao("");
    setConferir(false);
    setErro(null);
  }

  async function aoEnviar(evento) {
    evento.preventDefault();
    setConferir(true);
    setErro(null);

    if (conferirSenha(nova) || repeticao !== nova) {
      return;
    }

    setEnviando(true);

    const resposta = await pedir("/api/v1/user/password", {
      metodo: "POST",
      corpo: { current_password: atual, new_password: nova },
    });

    setEnviando(false);

    if (!resposta.ok) {
      setErro(resposta.corpo);
      return;
    }

    fechar();
    setTrocou(true);
  }

  return (
    <section className={estilos.secao} aria-labelledby="secao-senha">
      <h2 className={estilos.secaoTitulo} id="secao-senha">
        Senha
      </h2>

      {trocou && (
        <div className={estilos.confirmacao} role="status">
          <p>Senha trocada.</p>
          <p>
            Saímos da sua conta nos outros aparelhos. Neste, você continua
            dentro.
          </p>
        </div>
      )}

      {!aberto && (
        <button
          className={`${landing.botao} ${landing.botaoCompacto}`}
          type="button"
          aria-expanded="false"
          onClick={abrir}
        >
          Trocar senha
        </button>
      )}

      {aberto && (
        <form className={estilos.formulario} onSubmit={aoEnviar}>
          <Campo
            rotulo="Senha atual"
            type="password"
            name="current-password"
            autoComplete="current-password"
            required
            autoFocus
            value={atual}
            onChange={(evento) => setAtual(evento.target.value)}
          />
          <Campo
            rotulo="Senha nova"
            type="password"
            name="new-password"
            autoComplete="new-password"
            dica={DICA_DA_SENHA}
            erro={erroNova}
            required
            value={nova}
            onChange={(evento) => setNova(evento.target.value)}
          />
          <Campo
            rotulo="Repita a senha nova"
            type="password"
            name="new-password-repeat"
            autoComplete="new-password"
            erro={erroRepeticao}
            required
            value={repeticao}
            onChange={(evento) => setRepeticao(evento.target.value)}
          />

          <Aviso erro={erro} />

          <div className={estilos.linhaBotoes}>
            <button
              className={`${landing.botao} ${landing.botaoCompacto}`}
              type="submit"
              disabled={enviando}
            >
              {enviando ? "Salvando..." : "Salvar senha nova"}
            </button>
            <button
              className={estilos.botaoTexto}
              type="button"
              onClick={fechar}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default TrocarSenha;
