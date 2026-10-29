import { useId } from "react";
import Link from "next/link";

import landing from "components/landing/landing.module.css";
import conta from "components/conta/conta.module.css";
import estilos from "components/loja/loja.module.css";
import Resumo from "components/loja/Resumo.js";
import { linkDoPedido } from "components/loja/links.js";
import { SITUACAO_DA_VENDA } from "components/vendas/vendas.js";

const DATA_E_HORA = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function quando(data) {
  return DATA_E_HORA.format(new Date(data));
}

// Um pedido na lista de vendas, com as mesmas peças da página do pedido: de
// um lado quem comprou e para onde vai, do outro o que foi pedido, com o nome
// que sai em cada peça.
function Venda({ venda }) {
  const idTitulo = useId();
  const { comprador, entrega } = venda;

  return (
    <article className={estilos.duasColunas} aria-labelledby={idTitulo}>
      <div className={conta.placa}>
        <h2 className={conta.titulo} id={idTitulo}>
          {venda.codigo}
        </h2>
        <p className={estilos.pedidoDados}>
          <strong>{SITUACAO_DA_VENDA[venda.situacao]}</strong>. Feito em{" "}
          {quando(venda.feitoEm)}
          {venda.pagoEm && `, pago em ${quando(venda.pagoEm)}`}.
        </p>

        {venda.deTeste && (
          <div className={`${estilos.exemplo} ${estilos.pedidoAviso}`}>
            <p className={estilos.exemploTitulo}>Pedido de teste</p>
            <p>
              Feito com a chave de teste da AbacatePay: nada foi cobrado, e nada
              deve ser produzido.
            </p>
          </div>
        )}

        <div className={estilos.pedidoBloco}>
          <h3 className={conta.secaoTitulo}>Quem comprou</h3>
          <p>
            {comprador.nome}
            <br />
            <a className={conta.link} href={`mailto:${comprador.email}`}>
              {comprador.email}
            </a>
            <br />
            {comprador.celular}
            <br />
            CPF {comprador.cpf}
          </p>
        </div>

        <div className={estilos.pedidoBloco}>
          <h3 className={conta.secaoTitulo}>Entrega</h3>
          <address className={estilos.endereco}>
            {comprador.nome}
            <br />
            {entrega.rua}, {entrega.numero}
            {entrega.complemento && `, ${entrega.complemento}`}
            <br />
            {entrega.bairro}, {entrega.cidade}/{entrega.estado}
            <br />
            CEP {entrega.cep}
          </address>
        </div>

        <div className={estilos.pedidoBloco}>
          <p>
            <Link className={estilos.linkForte} href={linkDoPedido(venda.id)}>
              Ver a página do pedido
            </Link>
          </p>
          <p className={landing.dado}>
            Cobrança na AbacatePay: {venda.cobranca}
          </p>
        </div>
      </div>

      <Resumo titulo="O que foi pedido" contas={venda} comItens />
    </article>
  );
}

export default Venda;
