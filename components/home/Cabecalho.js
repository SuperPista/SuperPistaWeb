import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import landing from "components/landing/landing.module.css";
import estilos from "components/home/home.module.css";
import Icone from "components/midia/Icone.js";
import LinkDaSacola from "components/loja/LinkDaSacola.js";
import Retrato from "components/loja/Retrato.js";
import useConta from "components/conta/useConta.js";
import { LINK_CONTA, LINK_LOGIN } from "components/conta/links.js";
import { todosOsProdutos } from "components/loja/catalogo.js";
import { formatarReais } from "components/loja/dinheiro.js";
import {
  LINK_APLICATIVO,
  LINK_DUVIDAS,
  LINK_LOJA,
  linkDoProduto,
} from "components/loja/links.js";

// O menu começa pela home e pela loja, que tem tratamento próprio por causa
// da vitrine que abre embaixo. Depois vêm as páginas de apoio.
const HOME = { rotulo: "Home", destino: "/" };

const PAGINAS = [
  { rotulo: "Aplicativo", destino: LINK_APLICATIVO },
  { rotulo: "Dúvidas", destino: LINK_DUVIDAS },
];

// O que fica aberto embaixo do cabeçalho: a vitrine da loja, no desktop, ou o
// menu inteiro, no celular. Nunca os dois.
const VITRINE = "vitrine";
const GAVETA = "gaveta";

// Cabeçalho da home e das páginas da loja e da conta; nada aqui leva para a
// landing do tabuleiro, que é um caminho à parte.
//
// No desktop, "Loja" é um link para a loja e, ao lado, uma seta abre a vitrine
// com os produtos; o ponteiro em cima do item também abre. No celular o menu
// inteiro vai para uma gaveta, aberta pelo botão Menu, e a conta vai junto.
// O que estiver aberto fecha com Esc, com um clique fora e ao trocar de página.
//
// A vitrine e a gaveta ficam sempre na página e abrem descendo de dentro do
// cabeçalho: quem mostra e esconde é o CSS, pelo `data-aberta`. Fechadas, elas
// ficam com `visibility: hidden`, fora do Tab e do leitor de tela.
//
// As fotos da vitrine só entram na página na primeira vez em que ela abre.
// Antes disso seriam seis imagens a mais em toda página, escondidas, e quando
// uma delas é a mesma foto grande da página (a do herói, a da galeria) o Next
// confunde as duas e avisa no console que a maior imagem está atrasada.
function Cabecalho() {
  const router = useRouter();
  const { entrou } = useConta();
  const idVitrine = useId();
  const idGaveta = useId();
  const cabecalho = useRef(null);
  const seta = useRef(null);
  const botaoDoMenu = useRef(null);
  const espera = useRef(null);
  const mouseEmCima = useRef(false);
  const [aberto, setAberto] = useState(null);
  const [vitrineJaAbriu, setVitrineJaAbriu] = useState(false);

  const produtos = todosOsProdutos();
  const conta = entrou
    ? { rotulo: "Minha conta", destino: LINK_CONTA }
    : { rotulo: "Login", destino: LINK_LOGIN };

  // "page" na própria página; "true" quando se está dentro dela, como na
  // página de um produto da loja
  function atual(destino) {
    if (router.pathname === destino) {
      return "page";
    }

    return router.pathname.startsWith(`${destino}/`) ? "true" : undefined;
  }

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function aoApertar(evento) {
      if (evento.key !== "Escape") {
        return;
      }

      // o foco volta para o botão que abriu, para não se perder no que sumiu
      (aberto === VITRINE ? seta : botaoDoMenu).current?.focus();
      setAberto(null);
    }

    function aoClicarFora(evento) {
      if (!cabecalho.current.contains(evento.target)) {
        setAberto(null);
      }
    }

    document.addEventListener("keydown", aoApertar);
    document.addEventListener("pointerdown", aoClicarFora);

    return () => {
      document.removeEventListener("keydown", aoApertar);
      document.removeEventListener("pointerdown", aoClicarFora);
    };
  }, [aberto]);

  useEffect(() => {
    function fechar() {
      setAberto(null);
    }

    router.events.on("routeChangeStart", fechar);

    return () => router.events.off("routeChangeStart", fechar);
  }, [router.events]);

  useEffect(() => () => clearTimeout(espera.current), []);

  function alternar(qual) {
    setAberto((agora) => (agora === qual ? null : qual));
  }

  function abrirVitrine() {
    setVitrineJaAbriu(true);
    setAberto(VITRINE);
  }

  // Só o mouse abre a vitrine por passar em cima; no toque não existe "em
  // cima", e quem abre é a seta. A saída espera um instante, para um desvio do
  // ponteiro no caminho até a vitrine não fechar tudo.
  function aoEntrar(evento) {
    if (evento.pointerType === "mouse") {
      clearTimeout(espera.current);
      mouseEmCima.current = true;
      abrirVitrine();
    }
  }

  function aoSair(evento) {
    if (evento.pointerType === "mouse") {
      mouseEmCima.current = false;
      espera.current = setTimeout(() => {
        setAberto((agora) => (agora === VITRINE ? null : agora));
      }, 140);
    }
  }

  // Com o mouse a vitrine já abriu quando o ponteiro chegou na seta: um
  // clique ali fecharia o que a pessoa acabou de abrir. Para o mouse o clique
  // só garante que está aberta; no teclado e no toque, alterna.
  function aoClicarNaSeta() {
    if (mouseEmCima.current || aberto !== VITRINE) {
      abrirVitrine();
      return;
    }

    setAberto(null);
  }

  return (
    <header className={estilos.cabecalho} ref={cabecalho}>
      <div className={`${landing.container} ${estilos.cabecalhoLinha}`}>
        <Link className={estilos.cabecalhoMarca} href="/">
          <Image
            className={estilos.marcaDoCabecalho}
            src="/landing/logo-super-pista.webp"
            alt="Super Pista"
            width={640}
            height={414}
            priority
          />
        </Link>

        <nav className={estilos.menu} aria-label="Principal">
          <ul className={estilos.menuLista}>
            <li className={estilos.menuItem}>
              <Link
                className={estilos.menuLink}
                href={HOME.destino}
                aria-current={atual(HOME.destino)}
              >
                {HOME.rotulo}
              </Link>
            </li>

            <li
              className={estilos.menuItem}
              onPointerEnter={aoEntrar}
              onPointerLeave={aoSair}
            >
              <Link
                className={estilos.menuLink}
                href={LINK_LOJA}
                aria-current={atual(LINK_LOJA)}
              >
                Loja
              </Link>
              <button
                className={estilos.menuSeta}
                type="button"
                ref={seta}
                aria-label="Produtos da loja"
                aria-expanded={aberto === VITRINE}
                aria-controls={idVitrine}
                onClick={aoClicarNaSeta}
              >
                <Icone nome="seta" tamanho={16} />
              </button>

              <div
                className={estilos.vitrineDoMenu}
                id={idVitrine}
                data-aberta={aberto === VITRINE ? "" : undefined}
              >
                <div className={estilos.vitrineDoMenuDentro}>
                  <div
                    className={`${landing.container} ${estilos.vitrineDoMenuGrade}`}
                  >
                    <ul className={estilos.menuProdutos}>
                      {vitrineJaAbriu &&
                        produtos.map((produto) => (
                          <li key={produto.slug}>
                            <Link
                              className={estilos.menuProduto}
                              href={linkDoProduto(produto.slug)}
                            >
                              <span className={estilos.menuProdutoFoto}>
                                <Retrato
                                  produto={produto}
                                  sizes="180px"
                                  decorativa
                                />
                              </span>
                              <span className={estilos.menuProdutoNome}>
                                {produto.nomeCurto}
                              </span>
                              <span className={landing.dado}>
                                {formatarReais(produto.preco)}
                              </span>
                            </Link>
                          </li>
                        ))}
                    </ul>
                    <Link className={estilos.menuVerTudo} href={LINK_LOJA}>
                      Ver a loja inteira
                    </Link>
                  </div>
                </div>
              </div>
            </li>

            {PAGINAS.map((pagina) => (
              <li className={estilos.menuItem} key={pagina.destino}>
                <Link
                  className={estilos.menuLink}
                  href={pagina.destino}
                  aria-current={atual(pagina.destino)}
                >
                  {pagina.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={estilos.acoes}>
          <Link className={estilos.conta} href={conta.destino}>
            <Icone nome="conta" />
            {conta.rotulo}
          </Link>
          <LinkDaSacola />
          <button
            className={estilos.menuBotao}
            type="button"
            ref={botaoDoMenu}
            aria-expanded={aberto === GAVETA}
            aria-controls={idGaveta}
            onClick={() => alternar(GAVETA)}
          >
            <Icone nome={aberto === GAVETA ? "fechar" : "menu"} tamanho={20} />
            {aberto === GAVETA ? "Fechar" : "Menu"}
          </button>
        </div>
      </div>

      <div
        className={estilos.gaveta}
        id={idGaveta}
        data-aberta={aberto === GAVETA ? "" : undefined}
      >
        <nav
          className={`${landing.container} ${estilos.gavetaDentro}`}
          aria-label="Principal"
        >
          <ul className={estilos.gavetaLista}>
            <li>
              <Link
                className={estilos.gavetaLink}
                href={HOME.destino}
                aria-current={atual(HOME.destino)}
              >
                {HOME.rotulo}
              </Link>
            </li>
            <li>
              <Link
                className={estilos.gavetaLink}
                href={LINK_LOJA}
                aria-current={atual(LINK_LOJA)}
              >
                Loja
              </Link>
              <ul className={estilos.gavetaProdutos}>
                {produtos.map((produto) => (
                  <li key={produto.slug}>
                    <Link href={linkDoProduto(produto.slug)}>
                      {produto.nomeCurto}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {PAGINAS.map((pagina) => (
              <li key={pagina.destino}>
                <Link
                  className={estilos.gavetaLink}
                  href={pagina.destino}
                  aria-current={atual(pagina.destino)}
                >
                  {pagina.rotulo}
                </Link>
              </li>
            ))}
            <li>
              <Link
                className={estilos.gavetaLink}
                href={conta.destino}
                aria-current={atual(conta.destino)}
              >
                {conta.rotulo}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Cabecalho;
