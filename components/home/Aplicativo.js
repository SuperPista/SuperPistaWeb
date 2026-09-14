import Link from "next/link";
import landing from "components/landing/landing.module.css";
import estilos from "components/home/home.module.css";
import VideoEmLoop from "components/midia/VideoEmLoop.js";
import { LINK_LOGIN, LINK_CRIAR_CONTA } from "components/home/links.js";

// O caminho até a cidade aparecer na tela. É aqui que a conta do site entra:
// o aplicativo pede login para ativar o código que vem com o tabuleiro.
const ETAPAS = [
  "Baixe o app Super Pista na Play Store ou na App Store. Os três primeiros dias são grátis.",
  "Crie sua conta aqui no site e confirme pelo link que chega no seu e-mail.",
  "No app, faça login e digite o código do cartão que vem na sacola.",
  "Aponte a câmera para a imagem alvo da peça 1 e veja a cidade surgir em 3D.",
];

function Aplicativo() {
  return (
    <section
      className={`${landing.secao} ${estilos.fundoVermelho}`}
      id="aplicativo"
    >
      <div className={`${landing.container} ${estilos.appGrade}`}>
        <div className={estilos.appVideo}>
          <VideoEmLoop
            className={`${estilos.videoMidia} ${estilos.videoApp}`}
            src="/home/app-semaforo.mp4"
            poster="/home/app-semaforo-poster.webp"
            rotulo="A cidade em 3D sobre o tabuleiro, com o semáforo passando do vermelho para o verde ao lado de um radar."
          />
        </div>

        <div className={estilos.appTexto}>
          <h2 className={landing.h2}>A cidade de pé na tela do celular</h2>
          <p className={`${landing.corpo} ${estilos.corpoClaro}`}>
            O aplicativo usa a câmera do celular ou do tablet para levantar a
            cidade em cima do tabuleiro. Dá até para tirar uma foto e mandar
            para a família.
          </p>

          <ol className={estilos.etapasApp}>
            {ETAPAS.map((etapa) => (
              <li className={estilos.etapaApp} key={etapa}>
                {etapa}
              </li>
            ))}
          </ol>

          <div className={estilos.appAcoes}>
            <Link className={landing.botao} href={LINK_CRIAR_CONTA}>
              Criar conta
            </Link>
            <Link
              className={`${landing.botao} ${estilos.botaoBranco}`}
              href={LINK_LOGIN}
            >
              Login
            </Link>
          </div>

          <p className={`${estilos.aviso} ${landing.dado}`}>
            Com celular ou tablet, indicado a partir de 6 anos e sempre com um
            adulto por perto.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Aplicativo;
