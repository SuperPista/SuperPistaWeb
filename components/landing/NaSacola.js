import Image from "next/image";
import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";

// O conteúdo segue a descrição oficial do produto.
const ITENS = [
  {
    quantidade: "4",
    descricao:
      "peças de tabuleiro em MDF de reflorestamento, com 38 × 38 cm cada",
  },
  {
    quantidade: "1",
    descricao: "sacola reforçada para levar a cidade para onde a família for",
  },
  {
    quantidade: "1",
    descricao: "cartão com o código de ativação do aplicativo",
  },
  {
    quantidade: "Grátis",
    descricao: "nome ou apelido da criança numa das peças, se você quiser",
  },
];

function NaSacola() {
  return (
    <section className={estilos.secao} id="o-que-vem">
      <div className={`${estilos.container} ${estilos.sacola}`}>
        <div className={estilos.sacolaTexto}>
          <h2 className={estilos.h2}>O que vem na sacola</h2>
          <p className={estilos.corpoEscuro}>
            Cada Super Pista é feito sob encomenda para a sua família. É abrir
            no tapete da sala e a brincadeira começa ali mesmo.
          </p>
          <div className={`${estilos.caixaMidia} ${estilos.sacolaFoto}`}>
            <Image
              className={estilos.cobrir}
              src="/landing/sacola-tabuleiro.webp"
              alt="Sacola do Super Pista em cima do tabuleiro montado, com casinhas e blocos de madeira em volta, num piso de madeira."
              fill
              sizes="(min-width: 860px) 440px, 92vw"
            />
          </div>
        </div>

        <div className={estilos.sacolaLista}>
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
          <p className={`${estilos.nota} ${estilos.dado}`}>
            Celular, tablet e brinquedos que aparecem nas fotos e nos vídeos são
            ilustrativos e não acompanham o produto.
          </p>
        </div>
      </div>

      <Descer destino="#nome" rotulo="o nome da criança" direita />
    </section>
  );
}

export default NaSacola;
