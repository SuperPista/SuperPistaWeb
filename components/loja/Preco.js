import landing from "components/landing/landing.module.css";
import estilos from "components/loja/loja.module.css";
import { formatarReais, partesDoPreco } from "components/loja/dinheiro.js";

// O preço como cartaz de loja de brinquedo: os reais grandes, o cifrão e os
// centavos pequenos no alto. O leitor de tela ouve o valor inteiro de uma vez,
// e não os três pedaços. `semAntes` é para os cartões da prateleira, que
// mostram o preço e as parcelas, mas não o valor anterior.
function Preco({ produto, grande = false, semAntes = false }) {
  const { reais, centavos } = partesDoPreco(produto.preco);
  const precoAntes = semAntes ? null : produto.precoAntes;
  const { parcelas } = produto;

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
      {parcelas && (
        <span className={landing.dado}>
          ou {parcelas.vezes}x de {formatarReais(parcelas.valor)}
        </span>
      )}
    </p>
  );
}

export default Preco;
