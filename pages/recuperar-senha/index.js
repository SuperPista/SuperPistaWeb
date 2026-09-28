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
import { LINK_CONTA, LINK_LOGIN } from "components/conta/links.js";

// Pede por e-mail um caminho de volta à conta. Conta ativada recebe o link
// para criar uma senha nova; conta que ainda não foi ativada recebe um link de
// ativação novo. A resposta é a mesma exista a conta ou não.
function RecuperarSenha() {
  const router = useRouter();
  const { entrou } = useConta();

  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [enviadoPara, setEnviadoPara] = useState(null);

  useEffect(() => {
    if (entrou) {
      router.replace(LINK_CONTA);
    }
  }, [entrou, router]);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);

    const resposta = await pedir("/api/v1/password-resets", {
      metodo: "POST",
      corpo: { email },
    });

    setEnviando(false);

    if (!resposta.ok) {
      setErro(resposta.corpo);
      return;
    }

    setEnviadoPara(email);
  }

  if (enviadoPara) {
    return (
      <PaginaDaConta titulo="Confira seu e-mail">
        <Titulo focar>Confira seu e-mail</Titulo>
        <p className={estilos.explica}>
          Se houver uma conta com <strong>{enviadoPara}</strong>, o link chega
          em alguns minutos. Ele vale por 30 minutos e funciona uma vez só.
        </p>
        <p className={estilos.explica}>
          Não chegou? Procure no spam e nas promoções. Pedidos seguidos não
          mandam outro e-mail: espere uns 5 minutos antes de pedir de novo.
        </p>

        <ul className={estilos.alternativas}>
          <li>
            <Link href={LINK_LOGIN}>Voltar para o login</Link>
          </li>
        </ul>
      </PaginaDaConta>
    );
  }

  return (
    <PaginaDaConta titulo="Esqueci minha senha">
      <Titulo>Esqueci minha senha</Titulo>
      <p className={estilos.explica}>
        Digite o e-mail da sua conta. Mandamos um link para você criar uma senha
        nova.
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

        <Aviso erro={erro} />

        <button
          className={`${landing.botao} ${estilos.enviar}`}
          type="submit"
          disabled={enviando}
        >
          {enviando ? "Enviando..." : "Enviar link"}
        </button>
      </form>

      <ul className={estilos.alternativas}>
        <li>
          Lembrou a senha? <Link href={LINK_LOGIN}>Entrar</Link>
        </li>
      </ul>
    </PaginaDaConta>
  );
}

export default RecuperarSenha;
