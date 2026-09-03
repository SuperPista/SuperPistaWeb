import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";

// TODO: conferir a lista com o que realmente vai dentro da embalagem.
const ITENS = [
  {
    quantidade: "4",
    descricao: "peças de tabuleiro que encaixam e formam a cidade inteira",
  },
  {
    quantidade: "1",
    descricao: "nome da criança impresso no centro da cidade",
  },
  {
    quantidade: "1",
    descricao: "guia de montagem ilustrado, sem texto, para montar sozinho",
  },
  { quantidade: "App", descricao: "acesso ao aplicativo do Super Pista" },
];

function NaCaixa() {
  return (
    <section className={`${estilos.secao} ${estilos.claro}`} id="na-caixa">
      <div className={`${estilos.container} ${estilos.caixa}`}>
        <div className={estilos.caixaTexto}>
          <h2 className={estilos.h2}>O que vem na caixa</h2>
          <p className={estilos.corpoEscuro}>
            Tudo o que a criança precisa para montar e brincar no mesmo dia.
          </p>
        </div>

        <ul className={estilos.itens}>
          {ITENS.map((item) => (
            <li className={estilos.item} key={item.descricao}>
              <span className={`${estilos.itemQtd} ${estilos.dado}`}>
                {item.quantidade}
              </span>
              <span>{item.descricao}</span>
            </li>
          ))}
        </ul>
      </div>

      <Descer destino="#nome" rotulo="o nome da criança" direita />
    </section>
  );
}

export default NaCaixa;
