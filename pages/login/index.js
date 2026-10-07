import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import landing from "components/landing/landing.module.css";
import estilos from "components/conta/conta.module.css";
import PaginaDaConta from "components/conta/PaginaDaConta.js";
import Titulo from "components/conta/Titulo.js";
import Campo from "components/conta/Campo.js";
import Aviso from "components/conta/Aviso.js";
import useConta from "components/conta/useConta.js";
import { pedir } from "components/conta/pedir.js";
import {
  LINK_CONTA,
  LINK_CRIAR_CONTA,
  LINK_RECUPERAR_SENHA,
} from "components/conta/links.js";

// A API responde 401 tanto para email desconhecido quanto para senha errada,
// e a tela também não diz qual dos dois errou.
const CREDENCIAIS_ERRADAS = {
  message: "E-mail ou senha não conferem.",
  action:
    "Confira os dois e tente de novo. Se esqueceu a senha, crie uma nova pelo link abaixo.",
};

function Login() {
  const router = useRouter();
  const { entrou, recarregar } = useConta();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  // Quem já está logado não tem o que fazer aqui.
  useEffect(() => {
    if (entrou) {
      router.replace(LINK_CONTA);
    }
  }, [entrou, router]);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);

    const resposta = await pedir("/api/v1/sessions", {
      metodo: "POST",
      corpo: { email, password: senha },
    });

    // Com a conta no cache, o efeito acima leva para a Minha conta, e o login
    // sai do histórico: o voltar do navegador não cai de novo nele.
    if (resposta.ok) {
      await recarregar();
      return;
    }

    setEnviando(false);
    setErro(resposta.status === 401 ? CREDENCIAIS_ERRADAS : resposta.corpo);
  }

  return (
    <PaginaDaConta titulo="Entrar">
      <Titulo>Entrar</Titulo>
      <p className={estilos.explica}>
        Use o e-mail e a senha da sua conta. É a mesma conta do aplicativo Super
        Pista.
      </p>

      <form className={estilos.formulario} onSubmit={aoEnviar}>
        <Campo
          rotulo="E-mail"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
        />
        <Campo
          rotulo="Senha"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
        />

        <Aviso erro={erro} />

        <button
          className={`${landing.botao} ${estilos.enviar}`}
          type="submit"
          disabled={enviando}
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <ul className={estilos.alternativas}>
        <li>
          <Link href={LINK_RECUPERAR_SENHA}>Esqueci minha senha</Link>
        </li>
        <li>
          Ainda não tem conta? <Link href={LINK_CRIAR_CONTA}>Criar conta</Link>
        </li>
      </ul>
    </PaginaDaConta>
  );
}

export default Login;
