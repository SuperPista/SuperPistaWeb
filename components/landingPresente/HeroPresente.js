import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import landing from "components/landing/landing.module.css";
import estilos from "components/landingPresente/presente.module.css";
import CampoDoNome from "components/nome/CampoDoNome.js";
import Medalhao from "components/nome/Medalhao.js";
import useNomeDaCrianca from "components/nome/useNomeDaCrianca.js";
import VideoEmLoop from "components/midia/VideoEmLoop.js";
import useSacola from "components/loja/useSacola.js";
import { formatarReais } from "components/loja/dinheiro.js";
import { nomeNaPeca } from "components/loja/sacola.js";
import { SLUG_DO_TABULEIRO, produtoPorSlug } from "components/loja/catalogo.js";
import { LINK_SACOLA } from "components/loja/links.js";

export const MIDIAS_DO_PALCO = [
  {
    id: "chegada",
    rotuloAba: "A chegada",
    tipo: "video",
    src: "/landing/sacola-chegou.mp4",
    poster: "/landing/sacola-chegou-poster.webp",
    descricao:
      "Duas crianças sentadas no tapete da sala recebem a sacola do Super Pista e abrem sorrindo.",
    legenda:
      "A TV estava ligada. A sacola chegou e a sala inteira virou pista.",
  },
  {
    id: "cidade-3d",
    rotuloAba: "Cidade em 3D",
    tipo: "video",
    src: "/home/app-semaforo.mp4",
    poster: "/home/app-semaforo-poster.webp",
    descricao:
      "Aplicativo Super Pista mostrando prédios, semáforos e árvores em 3D sobre o tabuleiro.",
    legenda:
      "Aponte o celular para a peça 1 e veja a cidade surgir em 3D, mesmo sem internet.",
  },
  {
    id: "tabuleiro",
    rotuloAba: "Tabuleiro",
    tipo: "imagem",
    src: "/loja/tabuleiro-vermelho-montado.webp",
    descricao:
      "As quatro peças do tabuleiro vermelho montadas no chão, com ruas, praça, estádio, hospital, escola e o círculo com o nome.",
    legenda:
      "Quatro peças de MDF de 38 × 38 cm que se encaixam num tabuleiro de 76 × 76 cm.",
  },
  {
    id: "familia",
    rotuloAba: "Com avô e neta",
    tipo: "video",
    src: "/landing/presente-avo.mp4",
    poster: "/landing/presente-avo-poster.webp",
    descricao:
      "Avô ao lado da neta mostrando a peça do tabuleiro personalizada com o nome dela.",
    legenda:
      "Um presente sob encomenda que chama pais, avós e tios para o tapete.",
  },
];

// 1ª dobra da variante B: entrega o produto, a personalização ao vivo, o preço
// e o botão de compra direta logo na abertura.
function HeroPresente() {
  const router = useRouter();
  const tabuleiro = produtoPorSlug(SLUG_DO_TABULEIRO);
  const { nome, artigo, mudarNome, escolherArtigo } = useNomeDaCrianca();
  const adicionar = useSacola((estado) => estado.adicionar);
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const referenciasAbas = useRef([]);

  const midiaAtiva = MIDIAS_DO_PALCO[indiceAtivo];
  const peca = nomeNaPeca({ nome, artigo });

  function comprarAgora() {
    adicionar({ slug: tabuleiro.slug, nome, artigo });
    router.push(LINK_SACOLA);
  }

  function aoTeclarNaAba(evento, indice) {
    let proximo = null;

    if (evento.key === "ArrowRight") {
      proximo = (indice + 1) % MIDIAS_DO_PALCO.length;
    } else if (evento.key === "ArrowLeft") {
      proximo = (indice - 1 + MIDIAS_DO_PALCO.length) % MIDIAS_DO_PALCO.length;
    } else if (evento.key === "Home") {
      proximo = 0;
    } else if (evento.key === "End") {
      proximo = MIDIAS_DO_PALCO.length - 1;
    }

    if (proximo === null) return;

    evento.preventDefault();
    setIndiceAtivo(proximo);
    referenciasAbas.current[proximo]?.focus();
  }

  return (
    <section className={estilos.hero} id="personalizar-presente">
      <div className={landing.container}>
        <div className={estilos.heroTopo}>
          <p className={`${estilos.selo} ${landing.dado}`}>
            Presente sob encomenda · Nome da criança grátis
          </p>
          <h1 className={landing.h1}>
            Dê uma cidade inteira com o nome da criança impresso nela
          </h1>
          <p className={estilos.heroLead}>
            Tabuleiro em MDF de 76 × 76 cm para os carrinhos e bonecos que ela
            já tem em casa, com aplicativo de Realidade Aumentada em 3D que
            funciona sem internet.
          </p>
        </div>

        <div className={estilos.heroGrade}>
          <div className={estilos.palco}>
            <div
              className={estilos.abas}
              role="tablist"
              aria-label="Ver o Super Pista por dentro"
            >
              {MIDIAS_DO_PALCO.map((midia, indice) => {
                const ativa = indice === indiceAtivo;
                return (
                  <button
                    key={midia.id}
                    ref={(elemento) => {
                      referenciasAbas.current[indice] = elemento;
                    }}
                    id={`aba-${midia.id}`}
                    type="button"
                    role="tab"
                    aria-selected={ativa}
                    aria-controls={`painel-${midia.id}`}
                    tabIndex={ativa ? 0 : -1}
                    className={
                      ativa ? `${estilos.aba} ${estilos.abaAtiva}` : estilos.aba
                    }
                    onClick={() => setIndiceAtivo(indice)}
                    onKeyDown={(evento) => aoTeclarNaAba(evento, indice)}
                  >
                    {midia.rotuloAba}
                  </button>
                );
              })}
            </div>

            <div
              id={`painel-${midiaAtiva.id}`}
              role="tabpanel"
              aria-labelledby={`aba-${midiaAtiva.id}`}
            >
              <div className={estilos.quadroMidia}>
                {midiaAtiva.tipo === "video" ? (
                  <VideoEmLoop
                    key={midiaAtiva.id}
                    className={estilos.midiaPreencher}
                    src={midiaAtiva.src}
                    poster={midiaAtiva.poster}
                    rotulo={midiaAtiva.descricao}
                  />
                ) : (
                  <Image
                    className={estilos.midiaPreencher}
                    src={midiaAtiva.src}
                    alt={midiaAtiva.descricao}
                    fill
                    priority
                    sizes="(min-width: 960px) 600px, 92vw"
                  />
                )}
              </div>
              <p className={`${estilos.quadroLegenda} ${landing.dado}`}>
                {midiaAtiva.legenda}
              </p>
            </div>
          </div>

          <div className={estilos.cartaoCompra}>
            <div className={estilos.personalizarTopo}>
              <div className={estilos.medalhaoMini}>
                <Medalhao nome={nome} artigo={artigo} />
              </div>
              <div className={estilos.personalizarTexto}>
                <h2>Veja o nome na peça agora</h2>
                <p>
                  Escreva abaixo para testar. É opcional e sai impresso na peça
                  4 sem nenhum custo extra.
                </p>
              </div>
            </div>

            <div className={estilos.campoEnvoltorio}>
              <CampoDoNome
                nome={nome}
                artigo={artigo}
                aoMudar={mudarNome}
                aoEscolherArtigo={escolherArtigo}
              />
            </div>

            <div className={estilos.precoCaixa}>
              <span className={`${estilos.precoAntes} ${landing.dado}`}>
                de {formatarReais(tabuleiro.precoAntes)}
              </span>
              <span className={estilos.precoParcela}>
                {tabuleiro.parcelas.vezes}x de{" "}
                {formatarReais(tabuleiro.parcelas.valor)}
              </span>
              <span className={`${estilos.precoVista} ${landing.dado}`}>
                ou {formatarReais(tabuleiro.preco)} à vista no Pix, boleto ou
                cartão
              </span>
            </div>

            <button
              className={`${landing.botao} ${estilos.botaoLargo}`}
              type="button"
              onClick={comprarAgora}
            >
              {peca
                ? `Colocar no carrinho (${peca})`
                : "Quero dar o Super Pista de presente"}
            </button>

            <ul className={`${estilos.garantiasLinha} ${landing.dado}`}>
              <li>Frete grátis para todo o Brasil</li>
              <li>Produção em até 2 dias úteis</li>
              <li>7 dias para devolver</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroPresente;
