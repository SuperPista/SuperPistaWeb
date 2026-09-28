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
  DICA_DA_SENHA,
  SENHAS_DIFERENTES,
  conferirSenha,
} from "components/conta/senha.js";
import {
  LINK_CONTA,
  LINK_LOGIN,
  LINK_PRIVACIDADE,
  LINK_RECUPERAR_SENHA,
} from "components/conta/links.js";

function Cadastro() {
  const router = useRouter();
  const { entrou } = useConta();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [repeticao, setRepeticao] = useState("");
  const [aceitou, setAceitou] = useState(false);

  const [conferir, setConferir] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [enviadoPara, setEnviadoPara] = useState(null);

  useEffect(() => {
    if (entrou) {
      router.replace(LINK_CONTA);
    }
  }, [entrou, router]);

  // Os erros de cada campo só aparecem depois da primeira tentativa de enviar,
  // para ninguém levar bronca enquanto ainda está digitando.
  const erroSenha = conferir ? conferirSenha(senha) : null;
  const erroRepeticao =
    conferir && repeticao !== senha ? SENHAS_DIFERENTES : null;
  const erroAceite =
    conferir && !aceitou
      ? "Para criar a conta, marque que você aceita os termos."
      : null;

  async function aoEnviar(evento) {
    evento.preventDefault();
    setConferir(true);
    setErro(null);

    if (conferirSenha(senha) || repeticao !== senha || !aceitou) {
      return;
    }

    setEnviando(true);

    const resposta = await pedir("/api/v1/users", {
      metodo: "POST",
      corpo: {
        username: nome,
        email,
        password: senha,
        privacy_accepted: aceitou,
      },
    });

    setEnviando(false);

    if (!resposta.ok) {
      setErro(resposta.corpo);
      return;
    }

    setEnviadoPara(email);
    setSenha("");
    setRepeticao("");
  }

  if (enviadoPara) {
    return (
      <PaginaDaConta
        titulo="Confira seu e-mail"
        etapaAtual={2}
        rotuloDaEtapa="Falta só abrir o link do e-mail."
      >
        <Titulo focar>Confira seu e-mail</Titulo>
        <p className={estilos.explica}>
          Enviamos um e-mail para <strong>{enviadoPara}</strong>. Abra o link
          que está nele para continuar.
        </p>
        <p className={estilos.explica}>
          Não chegou em alguns minutos? Procure no spam e nas promoções. Se o
          link vencer, peça outro em Esqueci minha senha.
        </p>

        <ul className={estilos.alternativas}>
          <li>
            <Link href={LINK_RECUPERAR_SENHA}>Pedir outro link</Link>
          </li>
          <li>
            <Link href={LINK_LOGIN}>Ir para o login</Link>
          </li>
        </ul>
      </PaginaDaConta>
    );
  }

  return (
    <PaginaDaConta titulo="Criar conta" etapaAtual={2}>
      <Titulo>Criar conta</Titulo>
      <p className={estilos.explica}>
        Com a conta você entra no aplicativo Super Pista e ativa o código do
        cartão que vem na sacola.
      </p>

      <form className={estilos.formulario} onSubmit={aoEnviar}>
        <Campo
          rotulo="Nome de usuário"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={30}
          required
          value={nome}
          onChange={(evento) => setNome(evento.target.value)}
        />
        <Campo
          rotulo="E-mail"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          dica="É para ele que vai o link de ativação."
          required
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
        />
        <Campo
          rotulo="Senha"
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
          rotulo="Repita a senha"
          type="password"
          name="password-repeat"
          autoComplete="new-password"
          erro={erroRepeticao}
          required
          value={repeticao}
          onChange={(evento) => setRepeticao(evento.target.value)}
        />

        <div className={estilos.campo}>
          <label className={estilos.aceite}>
            <input
              type="checkbox"
              name="privacy_accepted"
              aria-invalid={erroAceite ? true : undefined}
              aria-describedby={erroAceite ? "erro-aceite" : undefined}
              checked={aceitou}
              onChange={(evento) => setAceitou(evento.target.checked)}
            />
            <span>
              Li e aceito os{" "}
              <Link href={LINK_PRIVACIDADE} target="_blank">
                Termos de Uso e a Política de Privacidade
              </Link>
              .
            </span>
          </label>
          {erroAceite && (
            <p className={estilos.erroCampo} id="erro-aceite">
              {erroAceite}
            </p>
          )}
        </div>

        <Aviso erro={erro} />

        <button
          className={`${landing.botao} ${estilos.enviar}`}
          type="submit"
          disabled={enviando}
        >
          {enviando ? "Criando a conta..." : "Criar conta"}
        </button>
      </form>

      <ul className={estilos.alternativas}>
        <li>
          Já tem conta? <Link href={LINK_LOGIN}>Entrar</Link>
        </li>
      </ul>
    </PaginaDaConta>
  );
}

export default Cadastro;
