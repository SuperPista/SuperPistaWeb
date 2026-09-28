import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import landing from "components/landing/landing.module.css";
import estilos from "components/conta/conta.module.css";
import PaginaDaConta from "components/conta/PaginaDaConta.js";
import Titulo from "components/conta/Titulo.js";
import Chegada from "components/conta/Chegada.js";
import Campo from "components/conta/Campo.js";
import Aviso from "components/conta/Aviso.js";
import { pedir } from "components/conta/pedir.js";
import {
  DICA_DA_SENHA,
  SENHAS_DIFERENTES,
  conferirSenha,
} from "components/conta/senha.js";
import { LINK_LOGIN, LINK_RECUPERAR_SENHA } from "components/conta/links.js";

// Página do link que chega por e-mail em Esqueci minha senha. O token está no
// endereço, então a página não manda o endereço adiante para outros sites.
function SenhaNova() {
  const router = useRouter();

  const [senha, setSenha] = useState("");
  const [repeticao, setRepeticao] = useState("");
  const [conferir, setConferir] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [estado, setEstado] = useState("formulario");

  const erroSenha = conferir ? conferirSenha(senha) : null;
  const erroRepeticao =
    conferir && repeticao !== senha ? SENHAS_DIFERENTES : null;

  async function aoEnviar(evento) {
    evento.preventDefault();
    setConferir(true);
    setErro(null);

    if (conferirSenha(senha) || repeticao !== senha) {
      return;
    }

    setEnviando(true);

    const resposta = await pedir(
      `/api/v1/password-resets/${encodeURIComponent(router.query.token)}`,
      { metodo: "PATCH", corpo: { password: senha } },
    );

    setEnviando(false);

    if (resposta.ok) {
      setEstado("salva");
      return;
    }

    if (resposta.status === 404) {
      setEstado("vencido");
      return;
    }

    setErro(resposta.corpo);
  }

  const semReferencia = (
    <Head>
      <meta name="referrer" content="no-referrer" />
    </Head>
  );

  if (estado === "salva") {
    return (
      <PaginaDaConta titulo="Senha nova salva">
        {semReferencia}
        <Chegada />
        <Titulo focar>Senha nova salva</Titulo>
        <p className={estilos.explica}>
          Entre com a senha nova. Por segurança, saímos da sua conta em todos os
          aparelhos, no site e no aplicativo.
        </p>
        <div className={estilos.acoes}>
          <Link className={landing.botao} href={LINK_LOGIN}>
            Entrar
          </Link>
        </div>
      </PaginaDaConta>
    );
  }

  if (estado === "vencido") {
    return (
      <PaginaDaConta titulo="Link vencido">
        {semReferencia}
        <Titulo focar>Este link não vale mais</Titulo>
        <p className={estilos.explica}>
          Ele venceu ou já foi usado. O link vale por 30 minutos e funciona uma
          vez só. Peça outro e use o mais recente.
        </p>
        <div className={estilos.acoes}>
          <Link className={landing.botao} href={LINK_RECUPERAR_SENHA}>
            Pedir um link novo
          </Link>
        </div>
      </PaginaDaConta>
    );
  }

  return (
    <PaginaDaConta titulo="Crie uma senha nova">
      {semReferencia}
      <Titulo>Crie uma senha nova</Titulo>
      <p className={estilos.explica}>
        Depois de salvar, você entra com ela no site e no aplicativo.
      </p>

      <form className={estilos.formulario} onSubmit={aoEnviar}>
        <Campo
          rotulo="Senha nova"
          type="password"
          name="password"
          autoComplete="new-password"
          dica={DICA_DA_SENHA}
          erro={erroSenha}
          required
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
        />
        <Campo
          rotulo="Repita a senha nova"
          type="password"
          name="password-repeat"
          autoComplete="new-password"
          erro={erroRepeticao}
          required
          value={repeticao}
          onChange={(evento) => setRepeticao(evento.target.value)}
        />

        <Aviso erro={erro} />

        <button
          className={`${landing.botao} ${estilos.enviar}`}
          type="submit"
          disabled={enviando || !router.isReady}
        >
          {enviando ? "Salvando..." : "Salvar senha nova"}
        </button>
      </form>
    </PaginaDaConta>
  );
}

export default SenhaNova;
