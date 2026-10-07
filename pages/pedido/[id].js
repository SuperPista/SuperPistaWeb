import Link from "next/link";
import { useRouter } from "next/router";

import landing from "components/landing/landing.module.css";
import home from "components/home/home.module.css";
import conta from "components/conta/conta.module.css";
import estilos from "components/loja/loja.module.css";
import Faixa from "components/landing/Faixa.js";
import Moldura from "components/conta/Moldura.js";
import Chegada from "components/conta/Chegada.js";
import Titulo from "components/conta/Titulo.js";
import Percurso from "components/loja/Percurso.js";
import Resumo from "components/loja/Resumo.js";
import usePedido, { ETAPAS_DO_PEDIDO } from "components/loja/usePedido.js";
import { LINK_LOJA } from "components/loja/links.js";

// O que a pessoa precisa saber enquanto o pedido está em cada etapa.
const O_QUE_ACONTECE = [
  "Assim que o pagamento for confirmado, a produção começa.",
  "A produção começa em seguida.",
  "As peças estão sendo feitas para a sua família.",
  "O código de rastreio foi para o seu e-mail.",
  "Boa brincadeira!",
];

const DATA = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// A chegada da compra e, depois, o lugar para acompanhar o pedido.
//
// TODO: hoje o pedido vem do navegador (components/loja/usePedido.js) e só
// existe na aba em que foi feito. Com o backend, vem de GET /api/v1/orders/[id].
function Pedido() {
  const router = useRouter();
  const pronto = usePedido((estado) => estado.pronto);
  const guardado = usePedido((estado) => estado.pedido);

  const pedido = guardado?.id === router.query.id ? guardado : null;

  if (!pronto || !router.isReady) {
    return (
      <Moldura titulo="Pedido" classe={estilos.pagina}>
        <section className={estilos.compraSecao}>
          <div className={landing.container}>
            <h1 className={estilos.tituloDaTela}>Pedido</h1>
            <p className={estilos.espera} role="status">
              Procurando o pedido.
            </p>
          </div>
        </section>
        <Faixa />
      </Moldura>
    );
  }

  if (!pedido) {
    return (
      <Moldura titulo="Pedido não encontrado" classe={estilos.pagina}>
        <section className={estilos.compraSecao}>
          <div className={landing.container}>
            <h1 className={estilos.tituloDaTela}>Pedido não encontrado</h1>
            <div className={estilos.vazia}>
              <p>
                Não achamos um pedido com esse código neste navegador. Enquanto
                a loja está em montagem, o pedido de exemplo só fica guardado na
                aba em que foi feito.
              </p>
              <Link className={landing.botao} href={LINK_LOJA}>
                Ver a loja
              </Link>
            </div>
          </div>
        </section>
        <Faixa />
      </Moldura>
    );
  }

  const { entrega } = pedido;

  return (
    <Moldura titulo={`Pedido ${pedido.id}`} classe={estilos.pagina}>
      <section className={estilos.compraSecao}>
        <div className={landing.container}>
          <Percurso atual={3} />

          <div className={estilos.duasColunas}>
            <div className={conta.placa}>
              <Chegada />
              <Titulo focar>Pedido recebido</Titulo>
              <p className={estilos.pedidoDados}>
                Pedido <strong>{pedido.id}</strong>, feito em{" "}
                {DATA.format(new Date(pedido.feitoEm))} por{" "}
                <strong>{pedido.comprador.nome}</strong>.
              </p>

              {pedido.deExemplo && (
                <div className={`${estilos.exemplo} ${estilos.pedidoAviso}`}>
                  <p className={estilos.exemploTitulo}>
                    Este é um pedido de exemplo
                  </p>
                  <p>
                    O pagamento ainda não está ligado: nada foi cobrado, nada
                    foi enviado para a Super Pista e nenhum e-mail saiu. O
                    pedido só existe nesta aba do navegador.
                  </p>
                </div>
              )}

              <div className={estilos.pedidoBloco}>
                <h2 className={conta.secaoTitulo}>O caminho do pedido</h2>
                <ol className={`${home.etapasApp} ${conta.etapas}`}>
                  {ETAPAS_DO_PEDIDO.map((etapa, indice) => {
                    const atual = indice === pedido.etapa;
                    const classes = [home.etapaApp];

                    if (atual) {
                      classes.push(conta.etapaAtual);
                    } else if (indice > pedido.etapa) {
                      classes.push(estilos.aFazer);
                    }

                    return (
                      <li
                        className={classes.join(" ")}
                        key={etapa}
                        aria-current={atual ? "step" : undefined}
                      >
                        <span>
                          {etapa}
                          {atual && (
                            <span className={conta.etapaRotulo}>
                              {O_QUE_ACONTECE[indice]}
                            </span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className={estilos.pedidoBloco}>
                <h2 className={conta.secaoTitulo}>Entrega</h2>
                <address className={estilos.endereco}>
                  {pedido.comprador.nome}
                  <br />
                  {entrega.rua}, {entrega.numero}
                  {entrega.complemento && `, ${entrega.complemento}`}
                  <br />
                  {entrega.bairro}, {entrega.cidade}/{entrega.estado}
                  <br />
                  CEP {entrega.cep}
                </address>
              </div>

              <div className={conta.acoes}>
                <Link className={estilos.linkForte} href={LINK_LOJA}>
                  Voltar para a loja
                </Link>
              </div>
            </div>

            <Resumo titulo="O que você pediu" contas={pedido} comItens />
          </div>
        </div>
      </section>
      <Faixa />
    </Moldura>
  );
}

export default Pedido;
