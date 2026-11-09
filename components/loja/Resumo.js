import { useId } from "react";
import landing from "components/landing/landing.module.css";
import estilos from "components/loja/loja.module.css";
import { formatarReais } from "components/loja/dinheiro.js";
import { nomeNaPeca } from "components/loja/sacola.js";

// A placa amarela com as contas da compra, ao lado da sacola, do checkout e
// do pedido. `contas` é o resumo da sacola ou um pedido: os dois têm itens,
// subtotal, frete e total. Na sacola os itens já estão na lista ao lado, então
// só o checkout e o pedido pedem `comItens`. O botão da etapa vem em children.
function Resumo({ titulo = "Resumo", contas, comItens = false, children }) {
  const idTitulo = useId();

  return (
    <aside
      className={`${landing.claro} ${estilos.resumo}`}
      aria-labelledby={idTitulo}
    >
      <h2 className={landing.h3} id={idTitulo}>
        {titulo}
      </h2>

      {comItens && (
        <ul className={estilos.resumoItens}>
          {contas.itens.map((item) => {
            const peca = nomeNaPeca(item);

            return (
              <li className={estilos.resumoItem} key={item.chave}>
                <span>
                  <strong>{item.quantidade} ×</strong> {item.produto.nome}
                </span>
                <span>{formatarReais(item.valor)}</span>
                {peca && (
                  <span className={`${estilos.resumoItemPeca} ${landing.dado}`}>
                    Nome na peça: {peca}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <dl className={estilos.contas}>
        <div className={estilos.contaLinha}>
          <dt>Subtotal</dt>
          <dd>{formatarReais(contas.subtotal)}</dd>
        </div>
        <div className={estilos.contaLinha}>
          <dt>Frete</dt>
          <dd>{contas.frete === 0 ? "Grátis" : formatarReais(contas.frete)}</dd>
        </div>
        <div className={`${estilos.contaLinha} ${estilos.contaTotal}`}>
          <dt>Total</dt>
          <dd>{formatarReais(contas.total)}</dd>
        </div>
      </dl>

      {children}
    </aside>
  );
}

export default Resumo;
