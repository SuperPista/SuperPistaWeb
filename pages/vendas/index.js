import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import landing from "components/landing/landing.module.css";
import estilos from "components/loja/loja.module.css";
import Faixa from "components/landing/Faixa.js";
import Moldura from "components/conta/Moldura.js";
import Venda from "components/vendas/Venda.js";
import useConta from "components/conta/useConta.js";
import useVendas from "components/vendas/useVendas.js";
import { formatarReais } from "components/loja/dinheiro.js";
import { LINK_LOGIN } from "components/conta/links.js";
import {
  FILTROS_DE_VENDA,
  filtrarVendas,
  pedidosPagos,
  resumirVendas,
} from "components/vendas/vendas.js";

function Tela({ children }) {
  return (
    <Moldura titulo="Vendas" classe={estilos.pagina}>
      <section className={estilos.compraSecao}>
        <div className={landing.container}>
          <h1 className={estilos.tituloDaTela}>Vendas</h1>
          {children}
        </div>
      </section>
      <Faixa />
    </Moldura>
  );
}

// Os pedidos da loja, para quem cuida dela: quem comprou, para onde vai e o
// nome de cada peça. Só abre para a conta com a feature `read:order:all`, dada
// pelo script infra/scripts/grant-orders-access.js. Os botões de cima separam
// a lista do mesmo jeito que os da loja separam os produtos.
function Vendas() {
  const router = useRouter();
  const { usuario, carregando: carregandoConta } = useConta();
  const { vendas, semPermissao, erro, carregando } = useVendas(
    Boolean(usuario),
  );
  const [situacoes, setSituacoes] = useState(null);

  useEffect(() => {
    if (!carregandoConta && !usuario) {
      router.replace(LINK_LOGIN);
    }
  }, [carregandoConta, usuario, router]);

  if (!usuario || carregando) {
    return (
      <Tela>
        <p className={estilos.espera} role="status">
          Carregando as vendas.
        </p>
      </Tela>
    );
  }

  if (semPermissao) {
    return (
      <Tela>
        <div className={estilos.vazia} role="alert">
          <p>
            A conta {usuario.username} não tem acesso às vendas. Peça a quem
            cuida do site para liberar.
          </p>
        </div>
      </Tela>
    );
  }

  if (erro) {
    return (
      <Tela>
        <div className={estilos.vazia} role="alert">
          <p>
            {erro.message} {erro.action}
          </p>
        </div>
      </Tela>
    );
  }

  const resumo = resumirVendas(vendas);
  const mostradas = filtrarVendas(vendas, situacoes);

  return (
    <Tela>
      <p className={`${landing.corpo} ${estilos.lojaTexto}`}>
        {pedidosPagos(resumo.pagas)}, somando {formatarReais(resumo.total)}.
        {resumo.pagasDeTeste > 0 &&
          ` Fora da conta: ${pedidosPagos(resumo.pagasDeTeste)} de teste.`}
      </p>

      <ul className={estilos.filtros} aria-label="Mostrar">
        {FILTROS_DE_VENDA.map((filtro) => (
          <li key={filtro.rotulo}>
            <button
              className={estilos.filtro}
              type="button"
              aria-pressed={filtro.situacoes === situacoes}
              onClick={() => setSituacoes(filtro.situacoes)}
            >
              {filtro.rotulo}
              <span className={estilos.filtroConta}>
                {filtrarVendas(vendas, filtro.situacoes).length}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {mostradas.length === 0 ? (
        <div className={estilos.vazia}>
          <p>
            {vendas.length === 0
              ? "Nenhum pedido ainda."
              : "Nenhum pedido nesta situação."}
          </p>
        </div>
      ) : (
        mostradas.map((venda) => <Venda venda={venda} key={venda.id} />)
      )}
    </Tela>
  );
}

export default Vendas;
