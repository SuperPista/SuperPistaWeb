import { useId, useState } from "react";
import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";

// TODO: conferir cada resposta com a versão final do app e da logística.
const PERGUNTAS = [
  {
    pergunta: "Funciona no Android e no iPhone?",
    resposta:
      "Sim. O aplicativo roda em Android 9 ou mais novo e em iPhone com iOS 14 ou mais novo. Também funciona em tablet.",
  },
  {
    pergunta: "A criança consegue usar sozinha?",
    resposta:
      "Consegue. As quatro peças encaixam de um jeito só e o guia é ilustrado, sem texto. No aplicativo, um adulto faz a primeira configuração e depois a criança abre e brinca sozinha.",
  },
  {
    pergunta: "A partir de que idade?",
    resposta:
      "A partir de cinco anos. Não há peça pequena o suficiente para ser engolida, mas a montagem fica mais divertida a partir dessa idade.",
  },
  {
    pergunta: "Precisa de internet para brincar?",
    resposta:
      "Só para baixar o aplicativo. Depois disso a cidade aparece no próprio aparelho, sem conexão.",
  },
  {
    pergunta: "Precisa de óculos de realidade virtual?",
    resposta:
      "Não. A realidade aumentada acontece na tela do celular: a câmera vê o tabuleiro de verdade e levanta a cidade em cima dele.",
  },
  {
    pergunta: "Em quanto tempo chega?",
    resposta:
      "De dois a sete dias úteis, dependendo da região. O código de rastreio vai por e-mail assim que o pedido sai do estoque.",
  },
  {
    pergunta: "E se não for o que eu esperava?",
    resposta:
      "Você tem sete dias corridos depois de receber para devolver e receber o valor de volta, inclusive o frete.",
  },
];

function Perguntas() {
  const prefixo = useId();
  const [abertas, setAbertas] = useState([]);

  function alternar(pergunta) {
    setAbertas((atuais) =>
      atuais.includes(pergunta)
        ? atuais.filter((atual) => atual !== pergunta)
        : [...atuais, pergunta],
    );
  }

  return (
    <section className={estilos.secao} id="perguntas">
      <div className={`${estilos.container} ${estilos.faq}`}>
        <div className={estilos.faqTexto}>
          <h2 className={estilos.h2}>Antes de comprar</h2>
        </div>

        <div className={estilos.perguntas}>
          {PERGUNTAS.map((item, indice) => {
            const aberta = abertas.includes(item.pergunta);
            const idResposta = `${prefixo}-resposta-${indice}`;

            return (
              <div
                className={
                  aberta
                    ? `${estilos.pergunta} ${estilos.aberta}`
                    : estilos.pergunta
                }
                key={item.pergunta}
              >
                <h3 className={estilos.perguntaTitulo}>
                  <button
                    className={estilos.perguntaBotao}
                    type="button"
                    aria-expanded={aberta}
                    aria-controls={idResposta}
                    onClick={() => alternar(item.pergunta)}
                  >
                    {item.pergunta}
                    <span className={estilos.marcador} aria-hidden="true" />
                  </button>
                </h3>

                <div className={estilos.respostaCaixa} id={idResposta}>
                  <div className={estilos.respostaInterna}>
                    <p className={estilos.resposta}>{item.resposta}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Descer destino="#comprar" rotulo="o preço" direita />
    </section>
  );
}

export default Perguntas;
