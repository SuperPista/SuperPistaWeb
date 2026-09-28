import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import landing from "components/landing/landing.module.css";
import estilos from "components/conta/conta.module.css";
import PaginaDaConta from "components/conta/PaginaDaConta.js";
import Titulo from "components/conta/Titulo.js";
import TrocarSenha from "components/conta/TrocarSenha.js";
import BaixarDados from "components/conta/BaixarDados.js";
import ExcluirConta from "components/conta/ExcluirConta.js";
import useConta from "components/conta/useConta.js";
import { LINK_LOGIN } from "components/conta/links.js";

// Área de quem está logado. O site não é o jogo: aqui fica o que é da conta,
// e o aplicativo usa o mesmo e-mail e a mesma senha.
function Conta() {
  const router = useRouter();
  const { usuario, carregando, sair } = useConta();
  const [excluida, setExcluida] = useState(false);

  useEffect(() => {
    if (!carregando && !usuario && !excluida) {
      router.replace(LINK_LOGIN);
    }
  }, [carregando, usuario, excluida, router]);

  async function aoSair() {
    await sair();
    router.push("/");
  }

  if (excluida) {
    return (
      <PaginaDaConta titulo="Conta excluída" lado={false}>
        <Titulo focar>Conta excluída</Titulo>
        <p className={estilos.explica}>
          Apagamos a sua conta e tudo o que estava ligado a ela. Se um dia
          quiser voltar, é só criar uma conta nova.
        </p>
        <div className={estilos.acoes}>
          <Link className={landing.botao} href="/">
            Voltar ao início
          </Link>
        </div>
      </PaginaDaConta>
    );
  }

  if (!usuario) {
    return (
      <PaginaDaConta titulo="Minha conta" larga>
        <Titulo>Minha conta</Titulo>
        <p className={estilos.explica} role="status">
          Carregando sua conta.
        </p>
      </PaginaDaConta>
    );
  }

  return (
    <PaginaDaConta
      titulo="Minha conta"
      larga
      etapaAtual={3}
      rotuloDaEtapa="Próximo passo: use este e-mail e esta senha no app."
    >
      <div className={estilos.contaTopo}>
        <Titulo>Minha conta</Titulo>
        <button className={estilos.botaoTexto} type="button" onClick={aoSair}>
          Sair
        </button>
      </div>
      {/* "Boas-vindas" e não "bem-vindo": a conta não diz o gênero de ninguém */}
      <p className={estilos.boasVindas}>Boas-vindas, {usuario.username}!</p>
      <p className={estilos.explica}>
        Aqui você cuida da sua conta. No aplicativo, entre com{" "}
        <strong>{usuario.email}</strong> e a mesma senha do site.
      </p>

      <TrocarSenha />

      {/* o que quase ninguém usa fica no pé, em texto, fora do caminho */}
      <div className={estilos.peDaPlaca}>
        <BaixarDados />
        <ExcluirConta usuario={usuario} aoExcluir={() => setExcluida(true)} />
      </div>
    </PaginaDaConta>
  );
}

export default Conta;
