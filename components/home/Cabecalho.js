import Image from "next/image";
import Link from "next/link";
import landing from "components/landing/landing.module.css";
import estilos from "components/home/home.module.css";
import BotaoComprar from "components/landing/BotaoComprar.js";
import { LINK_LOGIN } from "components/home/links.js";

// O menu só navega pela própria home: nada aqui leva para a landing do
// tabuleiro, que é um caminho à parte.
const MENU = [
  { rotulo: "Como brinca", destino: "#como-brinca" },
  { rotulo: "Nome da criança", destino: "#nome" },
  { rotulo: "Aplicativo", destino: "#aplicativo" },
  { rotulo: "Dúvidas", destino: "#perguntas" },
];

// No celular o menu some e ficam só Login e Comprar.
function Cabecalho() {
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
          <Link className={estilos.login} href={LINK_LOGIN}>
            Login
          </Link>
          <BotaoComprar compacto />
        </div>
      </div>
    </header>
  );
}

export default Cabecalho;
