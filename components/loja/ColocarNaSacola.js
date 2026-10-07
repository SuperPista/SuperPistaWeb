import landing from "components/landing/landing.module.css";
import estilos from "components/loja/loja.module.css";
import useSacola from "components/loja/useSacola.js";
import { chaveDaLinha } from "components/loja/sacola.js";

// Botão dos cartões de produto que não pedem escolha nenhuma antes da compra:
// um clique e o produto está na sacola. O selo no canto da foto mostra quantos
// já estão lá, lendo da própria sacola, então continua certo depois de
// recarregar a página. Ele fica sobre a foto para o cartão não mudar de altura
// e os botões da prateleira continuarem alinhados.
function ColocarNaSacola({ produto }) {
  const adicionar = useSacola((estado) => estado.adicionar);
  const quantidade = useSacola(
    (estado) =>
      estado.linhas.find((linha) => chaveDaLinha(linha) === produto.slug)
        ?.quantidade ?? 0,
  );

  return (
    <>
      <button
        className={`${landing.botao} ${landing.botaoCompacto} ${estilos.cartaoBotao}`}
        type="button"
        onClick={() => adicionar({ slug: produto.slug })}
      >
        Colocar na sacola
        <span className={estilos.somenteLeitor}>: {produto.nome}</span>
      </button>
      <p className={`${estilos.cartaoSelo} ${landing.dado}`} role="status">
        {quantidade > 0 && `${quantidade} na sacola`}
      </p>
    </>
  );
}

export default ColocarNaSacola;
