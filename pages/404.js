import Link from "next/link";

import landing from "components/landing/landing.module.css";
import home from "components/home/home.module.css";
import estilos from "components/loja/erro404.module.css";
import Faixa from "components/landing/Faixa.js";
import Moldura from "components/conta/Moldura.js";
import Prateleira from "components/loja/Prateleira.js";
import { todosOsProdutos } from "components/loja/catalogo.js";
import { LINK_LOJA } from "components/loja/links.js";

// Página para rotas inexistentes (404). Avisa que o endereço não existe mais,
// oferece botões para voltar ao início ou visitar a loja, e já apresenta a
// prateleira com os produtos para o visitante não dar de cara com um beco sem
// saída.
function PaginaNaoEncontrada() {
  const produtos = todosOsProdutos();

  return (
    <Moldura
      titulo="Página não encontrada (404)"
      descricao="Esta pista não leva a lugar nenhum. Conheça nossos tabuleiros com pista de carrinhos em MDF e kits de brinquedos."
      caminho="/404"
      indexar={false}
    >
      <section className={estilos.secaoErro}>
        <div className={`${landing.container} ${estilos.placaErro}`}>
          <span className={estilos.codigo404}>404</span>
          <h1 className={estilos.titulo}>Esta pista não leva a lugar nenhum</h1>
          <p className={`${landing.corpo} ${estilos.mensagem}`}>
            O endereço que você tentou acessar não existe, mudou de lugar ou a
            corrida tomou outro rumo. Que tal voltar para a pista principal?
          </p>

          <div className={estilos.acoes}>
            <Link href={LINK_LOJA} className={landing.botao}>
              Ver produtos da loja
            </Link>
            <Link href="/" className={`${landing.botao} ${home.botaoBranco}`}>
              Voltar ao início
            </Link>
          </div>
        </div>
      </section>

      <Prateleira
        id="produtos-404"
        titulo="Produtos"
        texto="Quatro tabuleiros de mini cidade em MDF e os kits para completar a brincadeira."
        produtos={produtos}
        naDobra
      />

      <Faixa />
    </Moldura>
  );
}

export default PaginaNaoEncontrada;
