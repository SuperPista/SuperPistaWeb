import Image from "next/image";
import Link from "next/link";
import landing from "components/landing/landing.module.css";
import estilos from "components/home/home.module.css";
import {
  LINK_LOGIN,
  LINK_CRIAR_CONTA,
  LINK_PRIVACIDADE,
} from "components/conta/links.js";
import {
  LINK_APLICATIVO,
  LINK_DUVIDAS,
  LINK_SACOLA,
} from "components/loja/links.js";

const COLUNAS = [
  {
    titulo: "Loja",
    links: [
      { rotulo: "Produtos", destino: "/#produtos" },
      { rotulo: "Sacola", destino: LINK_SACOLA },
    ],
  },
  {
    titulo: "Ajuda",
    links: [
      { rotulo: "Dúvidas", destino: LINK_DUVIDAS },
      { rotulo: "Aplicativo", destino: LINK_APLICATIVO },
      {
        rotulo: "contato@superpista.com",
        destino: "mailto:contato@superpista.com",
      },
    ],
  },
  {
    titulo: "Conta",
    links: [
      { rotulo: "Login", destino: LINK_LOGIN },
      { rotulo: "Criar conta", destino: LINK_CRIAR_CONTA },
      { rotulo: "Termos e privacidade", destino: LINK_PRIVACIDADE },
    ],
  },
];

function Rodape() {
  return (
    <footer className={estilos.rodape}>
      <div className={landing.container}>
        <div className={estilos.rodapeGrade}>
          <div className={estilos.rodapeMarca}>
            <Image
              className={landing.marca}
              src="/landing/logo-super-pista.webp"
              alt="Super Pista"
              width={640}
              height={414}
            />
          </div>

          {COLUNAS.map((coluna) => (
            <nav key={coluna.titulo} aria-label={coluna.titulo}>
              <h2 className={estilos.rodapeTitulo}>{coluna.titulo}</h2>
              <ul className={estilos.rodapeLista}>
                {coluna.links.map((link) => (
                  <li key={link.destino}>
                    {link.destino.startsWith("/") ? (
                      <Link href={link.destino}>{link.rotulo}</Link>
                    ) : (
                      <a href={link.destino}>{link.rotulo}</a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={`${estilos.rodapeBase} ${landing.dado}`}>
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} Super Pista
          </p>
          <p>
            Indicado a partir de 4 anos. Com celular ou tablet, a partir de 6
            anos e sempre com um adulto por perto. Celular, tablet e brinquedos
            das fotos são ilustrativos e não acompanham o produto.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Rodape;
