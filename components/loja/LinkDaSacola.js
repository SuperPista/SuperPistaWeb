import Link from "next/link";
import landing from "components/landing/landing.module.css";
import estilos from "components/loja/loja.module.css";
import Icone from "components/midia/Icone.js";
import { useResumoDaSacola } from "components/loja/useSacola.js";
import { LINK_SACOLA } from "components/loja/links.js";

// O botão do cabeçalho. A sacola nasce vazia e só lê o que estava guardado
// depois de a página montar, então a bolinha com a quantidade aparece um
// instante depois do resto. No celular estreito sobra só o ícone; o leitor de
// tela continua ouvindo "Sacola". O ícone, o nome e a bolinha vão numa linha
// própria, que os alinha pelo meio: soltos dentro do botão, o ícone descia.
function LinkDaSacola() {
  const { quantidade } = useResumoDaSacola();

  return (
    <Link
      className={`${landing.botao} ${landing.botaoCompacto}`}
      href={LINK_SACOLA}
    >
      <span className={estilos.sacolaLinha}>
        <Icone nome="sacola" />
        <span className={estilos.sacolaTexto}>Sacola</span>
        {quantidade > 0 && (
          <>
            <span className={estilos.sacolaConta} aria-hidden="true">
              {quantidade}
            </span>
            <span className={estilos.somenteLeitor}>
              , {quantidade} {quantidade === 1 ? "item" : "itens"}
            </span>
          </>
        )}
      </span>
    </Link>
  );
}

export default LinkDaSacola;
