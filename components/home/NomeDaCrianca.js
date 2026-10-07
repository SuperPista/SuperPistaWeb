import landing from "components/landing/landing.module.css";
import estilos from "components/home/home.module.css";
import VideoEmLoop from "components/midia/VideoEmLoop.js";
import PopupDoNome from "components/home/PopupDoNome.js";

const VIDEOS = [
  {
    arquivo: "nome-sandrinho",
    rotulo: "Menino mostrando a peça do tabuleiro com o nome Sandrinho.",
  },
  {
    arquivo: "nome-rafinha",
    rotulo: "Dois meninos mostrando a peça do tabuleiro com o nome Rafinha.",
  },
  {
    arquivo: "nome-vitoria",
    rotulo: "Duas meninas mostrando a peça do tabuleiro com o nome Vitória.",
  },
];

// Crianças mostrando a peça com o nome, na página do tabuleiro. `previa` põe o
// botão que abre a prévia num popup; a página do tabuleiro não precisa dele,
// porque o campo do nome já está lá em cima, ao lado do preço.
function NomeDaCrianca({ previa = true }) {
  return (
    <section className={`${landing.secao} ${landing.claro}`} id="nome">
      <div className={`${landing.container} ${estilos.nomeGrade}`}>
        <div className={estilos.nomeTexto}>
          <h2 className={landing.h2}>Com o nome de quem vai brincar</h2>
          <p className={landing.corpoEscuro}>
            O nome ou apelido da criança sai numa das quatro peças, com letras
            coloridas e sem custo a mais. Cabem até 10 letras, de A a Z.
          </p>
          <p className={landing.corpoEscuro}>
            Se preferir, o tabuleiro vem só com a marca Super Pista.
          </p>
          {previa && <PopupDoNome />}
        </div>

        <ul className={estilos.nomes}>
          {VIDEOS.map((video) => (
            <li className={estilos.nome} key={video.arquivo}>
              <VideoEmLoop
                className={estilos.nomeVideo}
                src={`/home/${video.arquivo}.mp4`}
                poster={`/home/${video.arquivo}-poster.webp`}
                rotulo={video.rotulo}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default NomeDaCrianca;
