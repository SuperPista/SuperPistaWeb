import { useState } from "react";
import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";
import BotaoComprar from "components/landing/BotaoComprar.js";
import CampoDoNome from "components/nome/CampoDoNome.js";
import Medalhao from "components/nome/Medalhao.js";
import VideoEmLoop from "components/midia/VideoEmLoop.js";

const CRIANCAS = [
  {
    arquivo: "nome-celinha",
    rotulo: "Menina sorrindo com a peça do tabuleiro que tem o nome Celinha.",
  },
  {
    arquivo: "nome-yumi",
    rotulo: "Menina segurando a peça do tabuleiro com o nome Yumi.",
  },
  {
    arquivo: "nome-amanda",
    rotulo: "Menina mostrando a peça do tabuleiro com o nome Amanda.",
  },
];

// O botão usa o nome que acabou de ser escrito: é a cidade que a pessoa está
// imaginando. Só o visual: nada é enviado ainda.
function Personalizacao() {
  const [nome, setNome] = useState("");
  const nomeEscrito =
    nome && nome[0].toUpperCase() + nome.slice(1).toLowerCase();

  return (
    <section className={`${estilos.secao} ${estilos.escuro}`} id="nome">
      <div className={`${estilos.container} ${estilos.personalize}`}>
        <div>
          <div className={estilos.introducao}>
            <h2 className={estilos.h2}>
              Uma cidade inteira com o nome do seu filho
            </h2>
            <p className={estilos.corpo}>
              Criança quase não tem nada que seja só dela. Essa cidade é: o nome
              ou apelido vai impresso no círculo amarelo de uma das peças, sem
              custo a mais. É opcional. Escreva abaixo e imagine a cara dela
              quando encontrar.
            </p>
          </div>

          <CampoDoNome nome={nome} aoMudar={setNome} />

          <div className={estilos.chamada}>
            <BotaoComprar>
              {nomeEscrito
                ? `Quero o nome ${nomeEscrito} na cidade`
                : "Quero esse nome na cidade"}
            </BotaoComprar>
          </div>
        </div>

        <div className={estilos.medalhaoCaixa}>
          <Medalhao nome={nome} />
        </div>
      </div>

      <div className={estilos.container}>
        <ul className={estilos.criancas}>
          {CRIANCAS.map((crianca) => (
            <li
              className={`${estilos.caixaMidia} ${estilos.crianca}`}
              key={crianca.arquivo}
            >
              <VideoEmLoop
                className={estilos.preencher}
                src={`/landing/${crianca.arquivo}.mp4`}
                poster={`/landing/${crianca.arquivo}-poster.webp`}
                rotulo={crianca.rotulo}
              />
            </li>
          ))}
        </ul>
      </div>

      <Descer destino="#presente" rotulo="o presente que vira lembrança" />
    </section>
  );
}

export default Personalizacao;
