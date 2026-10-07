import Image from "next/image";
import Link from "next/link";
import landing from "components/landing/landing.module.css";
import estilos from "components/home/home.module.css";
import { CORES_DAS_LETRAS } from "components/nome/Medalhao.js";
import Preco from "components/loja/Preco.js";
import { TABULEIROS, produtosDaColecao } from "components/loja/catalogo.js";
import { linkDoProduto } from "components/loja/links.js";

// O "É HORA" do logo escrito do jeito que o nome da criança sai impresso no
// tabuleiro: cada letra com uma cor, na mesma ordem, e um pouco acima ou abaixo
// da linha. O relógio da marca entra no lugar do O.
const LEMA = [
  { letra: "É", cor: CORES_DAS_LETRAS[0], desvio: "-0.04em" },
  { letra: "H", cor: CORES_DAS_LETRAS[1], desvio: "0.03em" },
  { relogio: true, desvio: "-0.03em" },
  { letra: "R", cor: CORES_DAS_LETRAS[2], desvio: "0.05em" },
  { letra: "A", cor: CORES_DAS_LETRAS[3], desvio: "-0.02em" },
];

// Topo da home, que é uma loja: a primeira coisa na tela é um produto, com
// preço e botão de compra. O amarelo vai de ponta a ponta, com o lema da marca
// como chamada, e a arte do tabuleiro vermelho fica apoiada na faixa de
// asfalto que vem logo abaixo. As bolinhas levam para a página de cada uma das
// quatro cidades.
function Hero() {
  const tabuleiros = produtosDaColecao(TABULEIROS);
  const [destaque] = tabuleiros;
  const [arte] = destaque.fotos;

  return (
    <section className={`${landing.claro} ${estilos.heroi}`}>
      <div className={`${landing.container} ${estilos.heroiGrade}`}>
        <div className={estilos.heroiTexto}>
          <h1 className={estilos.lema}>
            <span className={estilos.somenteLeitor}>
              É hora das brincadeiras saudáveis!
            </span>
            <span className={estilos.hora} aria-hidden="true">
              {LEMA.map((item, indice) =>
                item.relogio ? (
                  <Image
                    key={indice}
                    className={estilos.relogio}
                    style={{ "--desvio": item.desvio }}
                    src="/home/relogio.webp"
                    alt=""
                    width={440}
                    height={380}
                    priority
                  />
                ) : (
                  <span
                    key={indice}
                    className={estilos.letra}
                    data-letra={item.letra}
                    style={{ color: item.cor, "--desvio": item.desvio }}
                  >
                    {item.letra}
                  </span>
                ),
              )}
            </span>
            <span className={estilos.lemaResto} aria-hidden="true">
              das brincadeiras saudáveis!
            </span>
          </h1>

          <p className={estilos.heroiLinha}>
            Uma mini cidade com pista de carrinhos e o nome da criança. Com o
            aplicativo de Realidade Aumentada, ela fica de pé em 3D na tela do
            celular.
          </p>

          <div className={estilos.heroiCompra}>
            <div className={estilos.heroiProduto}>
              <p className={estilos.heroiNome}>{destaque.nomeCurto}</p>
              <Preco produto={destaque} />
            </div>
            <Link className={landing.botao} href={linkDoProduto(destaque.slug)}>
              Comprar este tabuleiro
            </Link>
          </div>

          <div className={estilos.heroiCidades}>
            <span className={landing.dado}>Quatro cidades para escolher</span>
            <ul className={estilos.heroiCidadesLista}>
              {tabuleiros.map((tabuleiro) => (
                <li key={tabuleiro.slug}>
                  <Link
                    className={estilos.heroiCidade}
                    href={linkDoProduto(tabuleiro.slug)}
                    style={{ backgroundColor: tabuleiro.cor.tinta }}
                    aria-label={tabuleiro.nomeCurto}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Image
          className={estilos.heroiArte}
          src={arte.src}
          alt={arte.descricao}
          width={arte.largura}
          height={arte.altura}
          sizes="(min-width: 900px) 700px, 92vw"
          priority
        />
      </div>
    </section>
  );
}

export default Hero;
