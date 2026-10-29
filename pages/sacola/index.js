import Link from "next/link";

import landing from "components/landing/landing.module.css";
import conta from "components/conta/conta.module.css";
import estilos from "components/loja/loja.module.css";
import Faixa from "components/landing/Faixa.js";
import Moldura from "components/conta/Moldura.js";
import Percurso from "components/loja/Percurso.js";
import Quantidade from "components/loja/Quantidade.js";
import Resumo from "components/loja/Resumo.js";
import Retrato from "components/loja/Retrato.js";
import useSacola, { useResumoDaSacola } from "components/loja/useSacola.js";
import { formatarReais } from "components/loja/dinheiro.js";
import { nomeNaPeca } from "components/loja/sacola.js";
import {
  LINK_FECHAR_PEDIDO,
  LINK_LOJA,
  linkDoProduto,
} from "components/loja/links.js";

// A sacola de compras. Ela fica guardada no navegador, então a página abre
// sem saber o que tem dentro e só mostra a lista (ou a sacola vazia) depois de
// ler.
function Sacola() {
  const pronto = useSacola((estado) => estado.pronto);
  const mudarQuantidade = useSacola((estado) => estado.mudarQuantidade);
  const remover = useSacola((estado) => estado.remover);
  const resumo = useResumoDaSacola();

  return (
    <Moldura titulo="Sacola" classe={estilos.pagina}>
      <section className={estilos.compraSecao}>
        <div className={landing.container}>
          {pronto && !resumo.vazia && <Percurso atual={0} />}

          <h1 className={estilos.tituloDaTela}>Sacola</h1>

          {!pronto && (
            <p className={estilos.espera} role="status">
              Abrindo a sacola.
            </p>
          )}

          {pronto && resumo.vazia && (
            <div className={estilos.vazia}>
              <p>
                A sacola está vazia. Os tabuleiros e os kits estão na loja,
                esperando quem vai brincar.
              </p>
              <Link className={landing.botao} href={LINK_LOJA}>
                Ver a loja
              </Link>
            </div>
          )}

          {pronto && !resumo.vazia && (
            <div className={estilos.duasColunas}>
              <div>
                <ul className={estilos.linhas}>
                  {resumo.itens.map((item) => {
                    const peca = nomeNaPeca(item);

                    return (
                      <li className={estilos.linha} key={item.chave}>
                        <div className={estilos.linhaFoto}>
                          <Retrato
                            produto={item.produto}
                            sizes="132px"
                            decorativa
                          />
                        </div>

                        <div className={estilos.linhaTexto}>
                          <h2 className={estilos.linhaNome}>
                            <Link href={linkDoProduto(item.slug)}>
                              {item.produto.nome}
                            </Link>
                          </h2>
                          {item.produto.aceitaNome && (
                            <p
                              className={`${estilos.linhaPeca} ${landing.dado}`}
                            >
                              {peca ? (
                                <>
                                  Nome na peça
                                  <span className={estilos.etiqueta}>
                                    {peca}
                                  </span>
                                </>
                              ) : (
                                "Sem nome na peça"
                              )}
                            </p>
                          )}
                          <div className={estilos.linhaAcoes}>
                            <Quantidade
                              rotulo={`Quantidade de ${item.produto.nome}`}
                              valor={item.quantidade}
                              aoMudar={(quantidade) =>
                                mudarQuantidade(item.chave, quantidade)
                              }
                            />
                            <button
                              className={conta.botaoTexto}
                              type="button"
                              onClick={() => remover(item.chave)}
                            >
                              Tirar da sacola
                            </button>
                          </div>
                        </div>

                        <p className={estilos.linhaValor}>
                          {formatarReais(item.valor)}
                        </p>
                      </li>
                    );
                  })}
                </ul>

                <p className={estilos.depoisDaLista}>
                  <Link className={estilos.linkForte} href={LINK_LOJA}>
                    Continuar comprando
                  </Link>
                </p>
              </div>

              <Resumo contas={resumo}>
                <Link className={landing.botao} href={LINK_FECHAR_PEDIDO}>
                  Fechar pedido
                </Link>
                <p className={`${estilos.resumoNota} ${landing.dado}`}>
                  Pagamento por Pix, boleto ou cartão. Sete dias para devolver.
                </p>
              </Resumo>
            </div>
          )}
        </div>
      </section>
      <Faixa />
    </Moldura>
  );
}

export default Sacola;
