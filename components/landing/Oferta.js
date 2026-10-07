import Image from "next/image";
import { useRouter } from "next/router";
import estilos from "components/landing/landing.module.css";
import useNomeDaCrianca from "components/nome/useNomeDaCrianca.js";
import useSacola from "components/loja/useSacola.js";
import { formatarReais, partesDoPreco } from "components/loja/dinheiro.js";
import { nomeNaPeca } from "components/loja/sacola.js";
import { SLUG_DO_TABULEIRO, produtoPorSlug } from "components/loja/catalogo.js";
import { LINK_SACOLA } from "components/loja/links.js";

// Fim da landing e o único ponto dela que sai da página: o botão põe o
// tabuleiro na sacola, com o nome escrito na dobra da personalização, e leva
// para a sacola. O preço vem do catálogo, o mesmo da loja.
//
// TODO: o prazo de devolução ainda é de exemplo, como o preço no catálogo.
function Oferta() {
  const router = useRouter();
  const tabuleiro = produtoPorSlug(SLUG_DO_TABULEIRO);
  const { nome, artigo } = useNomeDaCrianca();
  const adicionar = useSacola((estado) => estado.adicionar);
  const peca = nomeNaPeca({ nome, artigo });

  function comprar() {
    adicionar({ slug: tabuleiro.slug, nome, artigo });
    router.push(LINK_SACOLA);
  }

  return (
    <section className={`${estilos.secao} ${estilos.escuro}`} id="comprar">
      <div className={`${estilos.container} ${estilos.oferta}`}>
        <div className={`${estilos.caixaMidia} ${estilos.ofertaFoto}`}>
          <Image
            className={estilos.cobrir}
            src="/landing/oferta-sacola.webp"
            alt="Menino e menina deitados no chão entre carrinhos e blocos, rindo, com a sacola do Super Pista nas mãos."
            fill
            sizes="(min-width: 600px) 520px, 92vw"
          />
        </div>

        <h2 className={estilos.h2}>Imagine essa cara quando a sacola chegar</h2>
        <p className={estilos.lead}>
          As quatro peças de MDF, a sacola reforçada, o cartão que ativa o
          aplicativo e o nome da criança impresso na cidade, sem custo a mais.
        </p>

        <p className={estilos.preco}>
          <span className={`${estilos.precoAntes} ${estilos.dado}`}>
            de {formatarReais(tabuleiro.precoAntes)}
          </span>
          <span className={estilos.precoAgora}>
            R$ {partesDoPreco(tabuleiro.preco).reais}
          </span>
          <span className={`${estilos.parcelas} ${estilos.dado}`}>
            ou {tabuleiro.parcelas.vezes}x de{" "}
            {formatarReais(tabuleiro.parcelas.valor)}
          </span>
        </p>

        <button className={estilos.botao} type="button" onClick={comprar}>
          Quero ver essa cara em casa
        </button>

        {peca && (
          <p className={`${estilos.ofertaNome} ${estilos.dado}`}>
            Vai para a sacola com o nome {peca}.
          </p>
        )}

        <ul className={`${estilos.garantia} ${estilos.dado}`}>
          <li>Frete grátis para todo o Brasil</li>
          <li>Sete dias para devolver</li>
          <li>Pagamento por Pix, boleto ou cartão</li>
        </ul>
      </div>
    </section>
  );
}

export default Oferta;
