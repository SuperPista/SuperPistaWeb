import { useId } from "react";
import Link from "next/link";
import landing from "components/landing/landing.module.css";
import estilos from "components/home/home.module.css";
import { LINK_LOGIN } from "components/conta/links.js";
import { LINK_APLICATIVO } from "components/loja/links.js";

// Fim da home, para quem já comprou: o passo a passo do aplicativo mora em
// /aplicativo, e aqui fica só o caminho até ele.
function FaixaDoApp() {
  const idTitulo = useId();

  return (
    <section
      className={`${estilos.fundoVermelho} ${estilos.faixaApp}`}
      aria-labelledby={idTitulo}
    >
      <div className={`${landing.container} ${estilos.faixaAppLinha}`}>
        <div>
          <h2 className={landing.h3} id={idTitulo}>
            Já tem o seu Super Pista?
          </h2>
          <p className={estilos.faixaAppTexto}>
            Ative o aplicativo com o código do cartão que vem na sacola e veja a
            cidade de pé em 3D na tela do celular.
          </p>
        </div>
        <div className={estilos.appAcoes}>
          <Link
            className={`${landing.botao} ${landing.botaoCompacto}`}
            href={LINK_APLICATIVO}
          >
            Como ativar o aplicativo
          </Link>
          <Link
            className={`${landing.botao} ${landing.botaoCompacto} ${estilos.botaoBranco}`}
            href={LINK_LOGIN}
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FaixaDoApp;
