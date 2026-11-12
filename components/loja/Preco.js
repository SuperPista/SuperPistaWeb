import landing from "components/landing/landing.module.css";
import estilos from "components/loja/loja.module.css";
import { formatarReais, partesDoPreco } from "components/loja/dinheiro.js";

// O preço com a condição de parcelamento em primeiro lugar e destaque
// principal, seguido pelo valor à vista em tamanho menor. Quando o produto não
// tem parcelas, exibe o valor à vista diretamente.
function Preco({ produto, grande = false, semAntes = false }) {
  const precoAntes = semAntes ? null : produto.precoAntes;
  const { parcelas } = produto;

  if (parcelas) {
    const { reais, centavos } = partesDoPreco(parcelas.valor);

    return (
      <p
        className={
          grande ? `${estilos.preco} ${estilos.precoGrande}` : estilos.preco
        }
      >
        {precoAntes && (
          <span className={`${estilos.precoAntes} ${landing.dado}`}>
            de {formatarReais(precoAntes)}
          </span>
        )}
        <span className={estilos.somenteLeitor}>
          {parcelas.vezes} vezes de {formatarReais(parcelas.valor)}, ou{" "}
          {formatarReais(produto.preco)} à vista
        </span>
        <span className={estilos.precoAgora} aria-hidden="true">
          <span className={estilos.vezes}>{parcelas.vezes}x de</span>
          <span className={estilos.cifrao}>R$</span>
          {reais}
          <span className={estilos.centavos}>,{centavos}</span>
        </span>
        <span className={`${estilos.aVista} ${landing.dado}`}>
          ou {formatarReais(produto.preco)} à vista
        </span>
      </p>
    );
  }

  const { reais, centavos } = partesDoPreco(produto.preco);

  return (
    <p
      className={
        grande ? `${estilos.preco} ${estilos.precoGrande}` : estilos.preco
      }
    >
      {precoAntes && (
        <span className={`${estilos.precoAntes} ${landing.dado}`}>
          de {formatarReais(precoAntes)}
        </span>
      )}
      <span className={estilos.somenteLeitor}>
        {precoAntes ? "por " : ""}
        {formatarReais(produto.preco)}
      </span>
      <span className={estilos.precoAgora} aria-hidden="true">
        <span className={estilos.cifrao}>R$</span>
        {reais}
        <span className={estilos.centavos}>,{centavos}</span>
      </span>
      <span className={`${estilos.aVista} ${landing.dado}`}>à vista</span>
    </p>
  );
}

export default Preco;
