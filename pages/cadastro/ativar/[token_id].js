import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import landing from "components/landing/landing.module.css";
import estilos from "components/conta/conta.module.css";
import PaginaDaConta from "components/conta/PaginaDaConta.js";
import Titulo from "components/conta/Titulo.js";
import Chegada from "components/conta/Chegada.js";
import { pedir } from "components/conta/pedir.js";
import { LINK_LOGIN, LINK_RECUPERAR_SENHA } from "components/conta/links.js";

// Página do link de ativação que vai por e-mail. Ela ativa sozinha ao abrir:
// quem clicou no link já disse o que queria.
function Ativar() {
  const router = useRouter();
  const [estado, setEstado] = useState("ativando");
  const [erro, setErro] = useState(null);
  const jaPediu = useRef(false);

  useEffect(() => {
    // O token só chega depois da hidratação, e o link vale uma vez só: o
    // `jaPediu` garante um PATCH por visita, mesmo se o efeito rodar de novo.
    if (!router.isReady || jaPediu.current) {
      return;
    }
    jaPediu.current = true;

    pedir(`/api/v1/activations/${encodeURIComponent(router.query.token_id)}`, {
      metodo: "PATCH",
    }).then((resposta) => {
      if (resposta.ok) {
        setEstado("ativada");
        return;
      }
      setErro(resposta.corpo);
      setEstado("falhou");
    });
  }, [router.isReady, router.query.token_id]);

  if (estado === "ativada") {
    return (
      <PaginaDaConta
        titulo="Conta ativada"
        etapaAtual={3}
        rotuloDaEtapa="Próximo passo."
      >
        <Chegada />
        <Titulo focar>Conta ativada</Titulo>
        <p className={estilos.explica}>
          Pronto, sua conta está valendo. Entre aqui no site ou direto no
          aplicativo Super Pista, com o mesmo e-mail e a mesma senha.
        </p>
        <div className={estilos.acoes}>
          <Link className={landing.botao} href={LINK_LOGIN}>
            Entrar
          </Link>
        </div>
      </PaginaDaConta>
    );
  }

  if (estado === "falhou") {
    // 404 é o caso comum: o link venceu (vale 15 minutos) ou já foi usado.
    const venceu = erro?.name === "NotFoundError";

    return (
      <PaginaDaConta titulo="Não deu para ativar" etapaAtual={2}>
        <Titulo focar>Não deu para ativar</Titulo>
        {venceu ? (
          <>
            <p className={estilos.explica}>
              Este link venceu ou já foi usado. Ele vale por 15 minutos e
              funciona uma vez só.
            </p>
            <p className={estilos.explica}>
              Se você já ativou a conta, é só entrar. Se ainda não, peça um link
              novo: digite seu e-mail em Esqueci minha senha e mandamos outro
              link de ativação.
            </p>
          </>
        ) : (
          <p className={estilos.explica} role="alert">
            {erro?.message} {erro?.action}
          </p>
        )}
        <div className={estilos.acoes}>
          <Link className={landing.botao} href={LINK_RECUPERAR_SENHA}>
            Pedir um link novo
          </Link>
          <Link className={estilos.link} href={LINK_LOGIN}>
            Já ativei, quero entrar
          </Link>
        </div>
      </PaginaDaConta>
    );
  }

  return (
    <PaginaDaConta titulo="Ativando sua conta" etapaAtual={2}>
      <Titulo>Ativando sua conta</Titulo>
      <p className={estilos.explica} role="status">
        Só um instante, estamos conferindo o link.
      </p>
    </PaginaDaConta>
  );
}

export default Ativar;
