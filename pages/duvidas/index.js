import estilos from "components/home/home.module.css";
import Faixa from "components/landing/Faixa.js";
import Perguntas, { PERGUNTAS } from "components/landing/Perguntas.js";
import Moldura from "components/conta/Moldura.js";
import { esquemaFaq } from "components/loja/Seo.js";
import { LINK_DUVIDAS } from "components/loja/links.js";

// As perguntas de antes da compra numa página própria. A mesma lista aparece
// no fim da página de cada produto e na landing do tabuleiro.
function Duvidas() {
  return (
    <Moldura
      titulo="Dúvidas Frequentes"
      descricao="Tire suas dúvidas sobre o Super Pista: idade indicada, material do tabuleiro em MDF, nome da criança, aplicativo com Realidade Aumentada e entrega."
      caminho={LINK_DUVIDAS}
      dadosEstruturados={esquemaFaq(PERGUNTAS)}
      indexar
    >
      <h1 className={estilos.somenteLeitor}>Dúvidas sobre o Super Pista</h1>
      <Perguntas comSeta={false} />
      <Faixa />
    </Moldura>
  );
}

export default Duvidas;
