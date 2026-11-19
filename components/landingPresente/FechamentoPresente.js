import { useRouter } from "next/router";
import landing from "components/landing/landing.module.css";
import estilos from "components/landingPresente/presente.module.css";
import Medalhao from "components/nome/Medalhao.js";
import useNomeDaCrianca from "components/nome/useNomeDaCrianca.js";
import useSacola from "components/loja/useSacola.js";
import { SLUG_DO_TABULEIRO, produtoPorSlug } from "components/loja/catalogo.js";
import { formatarReais } from "components/loja/dinheiro.js";
import { nomeNaPeca } from "components/loja/sacola.js";
import { LINK_SACOLA } from "components/loja/links.js";

function FechamentoPresente() {
  const router = useRouter();
  const tabuleiro = produtoPorSlug(SLUG_DO_TABULEIRO);
  const { nome, artigo } = useNomeDaCrianca();
  const adicionar = useSacola((estado) => estado.adicionar);
  const peca = nomeNaPeca({ nome, artigo });

  function finalizarPresente() {
    adicionar({ slug: tabuleiro.slug, nome, artigo });
    router.push(LINK_SACOLA);
  }

  return (
    <section className={estilos.secaoEscura} id="fechar-presente">
      <div className={landing.container}>
        <div className={estilos.fechamento}>
          <div className={estilos.fechamentoPrevia}>
            <div className={estilos.fechamentoMedalhao}>
              <Medalhao nome={nome} artigo={artigo} />
            </div>
            <a
              className={`${estilos.editarNomeLink} ${landing.dado}`}
              href="#personalizar-presente"
            >
              {peca ? "Trocar o nome da criança" : "Escrever o nome da criança"}
            </a>
          </div>

          <div className={estilos.fechamentoConteudo}>
            <h2 className={landing.h2}>
              {peca
                ? `Pronto para encomendar o presente ${peca}`
                : "Encomende agora com frete grátis"}
            </h2>

            <ul className={estilos.resumoPedido}>
              <li>
                <span>Produto</span>
                <strong>{tabuleiro.nome} (76 × 76 cm)</strong>
              </li>
              <li>
                <span>Personalização na peça 4</span>
                <strong>
                  {peca ? `${peca} (grátis)` : "Marca Super Pista (opcional)"}
                </strong>
              </li>
              <li>
                <span>Aplicativo 3D offline</span>
                <strong>Código para até 2 aparelhos</strong>
              </li>
              <li>
                <span>Entrega</span>
                <strong>Frete grátis para todo o Brasil</strong>
              </li>
            </ul>

            <div className={estilos.precoCaixa}>
              <span className={`${estilos.precoAntes} ${landing.dado}`}>
                de {formatarReais(tabuleiro.precoAntes)}
              </span>
              <span className={estilos.precoParcela}>
                {tabuleiro.parcelas.vezes}x de{" "}
                {formatarReais(tabuleiro.parcelas.valor)}
              </span>
              <span className={`${estilos.precoVista} ${landing.dado}`}>
                ou {formatarReais(tabuleiro.preco)} à vista no Pix, boleto ou
                cartão
              </span>
            </div>

            <div className={estilos.fechamentoAcoes}>
              <button
                className={`${landing.botao} ${estilos.botaoLargo}`}
                type="button"
                onClick={finalizarPresente}
              >
                {peca
                  ? `Ir para o carrinho com o nome ${peca}`
                  : "Ir para o carrinho agora"}
              </button>

              <ul className={`${estilos.garantiasLinha} ${landing.dado}`}>
                <li>Produção em até 2 dias úteis</li>
                <li>7 dias corridos para devolver</li>
                <li>Suporte por e-mail se trocar de celular</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FechamentoPresente;
