import Image from "next/image";
import Link from "next/link";
import landing from "components/landing/landing.module.css";
import estilos from "components/home/home.module.css";
import BotaoComprar from "components/landing/BotaoComprar.js";
import useConta from "components/conta/useConta.js";
import { LINK_CONTA, LINK_LOGIN } from "components/conta/links.js";

// O menu só navega pela própria home: nada aqui leva para a landing do
// tabuleiro, que é um caminho à parte. Os destinos começam com "/" porque o
// cabeçalho também aparece nas telas da conta; dentro da home o navegador só
// rola até a seção, sem recarregar a página.
const MENU = [
  { rotulo: "Como brinca", destino: "/#como-brinca" },
  { rotulo: "Nome da criança", destino: "/#nome" },
  { rotulo: "Aplicativo", destino: "/#aplicativo" },
  { rotulo: "Dúvidas", destino: "/#perguntas" },
];

// No celular o menu some e ficam só Login e Comprar. Quem já entrou vê
// Minha conta no lugar de Login, que no celular encurta para Conta para caber
// ao lado do botão; o leitor de tela continua ouvindo "Minha conta".
function Cabecalho() {
  const { entrou } = useConta();

  return (
    <header className={estilos.cabecalho}>
      <div className={`${landing.container} ${estilos.cabecalhoLinha}`}>
        <Link href="/">
          <Image
            className={landing.marca}
            src="/landing/logo-super-pista.webp"
            alt="Super Pista"
            width={640}
            height={414}
            priority
          />
        </Link>

        <nav className={estilos.menu} aria-label="Principal">
          <ul className={estilos.menuLista}>
            {MENU.map((item) => (
              <li key={item.destino}>
                <a className={estilos.menuLink} href={item.destino}>
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={estilos.acoes}>
          <Link
            className={estilos.login}
            href={entrou ? LINK_CONTA : LINK_LOGIN}
          >
            {entrou ? (
              <>
                <span className={estilos.rotuloLongo}>Minha conta</span>
                <span className={estilos.rotuloCurto} aria-hidden="true">
                  Conta
                </span>
              </>
            ) : (
              "Login"
            )}
          </Link>
          <BotaoComprar compacto destino="/#comprar" />
        </div>
      </div>
    </header>
  );
}

export default Cabecalho;
