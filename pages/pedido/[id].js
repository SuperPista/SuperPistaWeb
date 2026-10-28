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

const TITULO_DA_SITUACAO = {
  pending: "Falta pagar",
  paid: "Pedido feito",
  expired: "O prazo para pagar acabou",
  cancelled: "Pagamento cancelado",
  refunded: "Pedido reembolsado",
};

// O pedido que não vai para a produção troca o caminho por uma explicação.
const PEDIDO_PARADO = {
  expired:
    "O pagamento não chegou a tempo, e nada foi cobrado. Se ainda quiser os produtos, é só fazer um pedido novo.",
  cancelled:
    "O pagamento foi cancelado, e nada foi cobrado. Se ainda quiser os produtos, é só fazer um pedido novo.",
  refunded: "O valor foi devolvido pelo mesmo meio do pagamento.",
};

const DATA = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// A moldura das telas sem pedido para mostrar: procurando, não achou, falhou.
function TelaSemPedido({ titulo, children }) {
  return (
    <Moldura titulo={titulo} classe={estilos.pagina}>
      <section className={estilos.compraSecao}>
        <div className={landing.container}>
          <h1 className={estilos.tituloDaTela}>{titulo}</h1>
          {children}
        </div>
      </section>
      <Faixa />
    </Moldura>
  );
}

// A volta da AbacatePay e, depois, o lugar para acompanhar o pedido. Enquanto
// falta pagar, o botão de pagar fica aqui, e a página muda sozinha quando o
// pagamento é confirmado (components/loja/usePedido.js).
function Pedido() {
  const router = useRouter();
  const { pedido, erro, carregando } = usePedido(
    router.isReady ? router.query.id : null,
  );

  if (!router.isReady || carregando) {
    return (
      <TelaSemPedido titulo="Pedido">
        <p className={estilos.espera} role="status">
          Procurando o pedido.
        </p>
      </TelaSemPedido>
    );
  }

  if (erro) {
    return (
      <TelaSemPedido titulo="Pedido">
        <div className={estilos.vazia} role="alert">
          <p>
            {erro.message} {erro.action}
          </p>
        </div>
      </TelaSemPedido>
    );
  }

  if (!pedido) {
    return (
      <TelaSemPedido titulo="Pedido não encontrado">
        <div className={estilos.vazia}>
          <p>
            Não achamos um pedido com esse endereço. Confira se o link está
            inteiro.
          </p>
          <Link className={landing.botao} href={LINK_LOJA}>
            Ver a loja
          </Link>
        </div>
      </TelaSemPedido>
    );
  }

  const { situacao, entrega } = pedido;
  const pendente = situacao === "pending";
  const noCaminho = pedido.etapa !== null;

  return (
    <Moldura titulo={`Pedido ${pedido.codigo}`} classe={estilos.pagina}>
      <section className={estilos.compraSecao}>
        <div className={landing.container}>
          {noCaminho && <Percurso atual={pendente ? 2 : 3} />}

          <div className={estilos.duasColunas}>
            <div className={conta.placa}>
              {situacao === "paid" && <Chegada />}
              {/* a chave troca o título junto com a situação e leva o foco
                  até ele de novo, para o leitor de tela anunciar a mudança */}
              <Titulo focar key={situacao}>
                {TITULO_DA_SITUACAO[situacao]}
              </Titulo>
              <p className={estilos.pedidoDados}>
                Pedido <strong>{pedido.codigo}</strong>, feito em{" "}
                {DATA.format(new Date(pedido.feitoEm))} por{" "}
                <strong>{pedido.comprador.nome}</strong>.
              </p>

              {pedido.deTeste && (
                <div className={`${estilos.exemplo} ${estilos.pedidoAviso}`}>
                  <p className={estilos.exemploTitulo}>
                    Este é um pedido de teste
                  </p>
                  <p>
                    Ele foi feito com a chave de teste da AbacatePay: nenhum
                    pagamento é de verdade, e nada vai ser produzido.
                  </p>
                </div>
              )}

              {noCaminho ? (
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
              ) : (
                <div className={estilos.pedidoBloco}>
                  <p>{PEDIDO_PARADO[situacao]}</p>
                </div>
              )}

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

            <Resumo titulo="O que você pediu" contas={pedido} comItens>
              {pendente && (
                <>
                  <a className={landing.botao} href={pedido.linkDePagamento}>
                    Pagar agora
                  </a>
                  <p className={`${estilos.resumoNota} ${landing.dado}`}>
                    Pix, boleto ou cartão, na página da AbacatePay. Já pagou? A
                    confirmação aparece aqui sozinha, em instantes.
                  </p>
                </>
              )}
            </Resumo>
          </div>
        </div>
      </section>
      <Faixa />
    </Moldura>
  );
}

export default Pedido;
