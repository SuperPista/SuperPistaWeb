import Link from "next/link";
import landing from "components/landing/landing.module.css";
import estilos from "components/loja/loja.module.css";
import ColocarNaSacola from "components/loja/ColocarNaSacola.js";
import Preco from "components/loja/Preco.js";
import Retrato from "components/loja/Retrato.js";
import { TABULEIROS } from "components/loja/catalogo.js";
import { linkDoProduto } from "components/loja/links.js";

// Um produto na prateleira: a foto na moldura e, soltos embaixo dela, o nome,
// o preço e o botão. Só a foto tem borda, para a prateleira não virar uma
// grade de caixas. O tabuleiro pede o nome da criança antes da compra, então
// o botão dele leva para a página; o resto vai direto para a sacola. A foto
// também é link, mas fica fora do Tab e do leitor de tela, que já têm o link
// do nome.
function CartaoDoProduto({ produto }) {
  const endereco = linkDoProduto(produto.slug);

  return (
    <article className={estilos.cartao}>
      <Link
        className={estilos.cartaoFoto}
        href={endereco}
        tabIndex={-1}
        aria-hidden="true"
      >
        <Retrato
          produto={produto}
          sizes="(min-width: 900px) 380px, 46vw"
          decorativa
        />
      </Link>

      <h3 className={estilos.cartaoNome}>
        <Link href={endereco}>{produto.nomeCurto}</Link>
      </h3>
      <Preco produto={produto} semAntes />

      <div className={estilos.cartaoAcao}>
        {produto.colecao === TABULEIROS ? (
          <Link
            className={`${landing.botao} ${landing.botaoCompacto} ${estilos.cartaoBotao}`}
            href={endereco}
          >
            Ver produto
            <span className={estilos.somenteLeitor}>: {produto.nomeCurto}</span>
          </Link>
        ) : (
          <ColocarNaSacola produto={produto} />
        )}
      </div>
    </article>
  );
}

export default CartaoDoProduto;
