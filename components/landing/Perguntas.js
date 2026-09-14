import { useId, useState } from "react";
import Image from "next/image";
import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";

// Respostas conferidas com a descrição oficial do produto.
// TODO: colocar o prazo real de produção e entrega e confirmar a devolução.
const PERGUNTAS = [
  {
    pergunta: "É um jogo?",
    resposta:
      "Não. É um tabuleiro com mini cidade e pista de carrinhos que serve de base para os brinquedos que a criança já tem, como blocos de montar, carrinhos, bonecos e bonecas. O celular e o tablet são opcionais: dá para brincar com ou sem eles.",
  },
  {
    pergunta: "A partir de que idade?",
    resposta:
      "A partir de 4 anos para brincar só com o tabuleiro. Com celular ou tablet, a partir de 6 anos e sempre com um adulto responsável por perto.",
  },
  {
    pergunta: "Do que o tabuleiro é feito?",
    resposta:
      "De MDF de reflorestamento, em quatro peças de 38 × 38 cm cada. A tinta não é tóxica e não solta, porque recebe uma camada protetora por cima da impressão. O MDF não combina com umidade: guarde o tabuleiro em lugar seco.",
  },
  {
    pergunta: "Tem custo para colocar o nome?",
    resposta:
      "Não. O nome ou apelido da criança é opcional e não tem custo: é só informar no pedido. Sem nome, o tabuleiro vem só com a marca Super Pista.",
  },
  {
    pergunta: "Posso escolher as cores das letras?",
    resposta:
      "Não. As letras saem com cores sortidas, têm cerca de 3 cm de altura e podem vir alinhadas ou espalhadas para ocupar o espaço da peça. Cabe um nome só, com até 10 letras, sem números, símbolos ou desenhos.",
  },
  {
    pergunta: "O nome vem impresso ou em adesivo?",
    resposta:
      "Impresso direto no tabuleiro. Em períodos de muitos pedidos, o nome pode vir num adesivo colado sobre a peça, sem aviso prévio.",
  },
  {
    pergunta: "Precisa de óculos de realidade virtual?",
    resposta:
      "Não. A realidade aumentada acontece na tela do celular ou do tablet: você aponta a câmera para a imagem alvo da peça 1 e a mini cidade surge em 3D. Com o botão da câmera, dá para tirar uma foto e compartilhar.",
  },
  {
    pergunta: "Como ativo o aplicativo?",
    resposta:
      "Baixe o app Super Pista na Play Store ou na App Store e use grátis por 3 dias. Depois, faça login e digite o código de ativação do cartão que vem com o tabuleiro. Pronto, o aplicativo fica ativado.",
  },
  {
    pergunta: "Funciona no meu celular?",
    resposta:
      "O aplicativo Super Pista está na Play Store e na App Store e funciona em celular e tablet. Antes de comprar, confira na loja de aplicativos se o seu aparelho é compatível.",
  },
  {
    pergunta: "Precisa de internet?",
    resposta:
      "Para brincar com o tabuleiro, não. Para o aplicativo, sim: a internet é necessária para baixar, fazer login e ativar o código.",
  },
  {
    pergunta: "Em quanto tempo chega?",
    resposta:
      "O Super Pista é produzido sob encomenda, então o prazo soma a produção e a entrega para a sua região. O código de rastreio vai por e-mail assim que o pedido é enviado.",
  },
  {
    pergunta: "E se não for o que eu esperava?",
    resposta:
      "Você tem sete dias corridos depois de receber para devolver e receber o valor de volta, inclusive o frete.",
  },
];

// Na home a lista aparece sem a seta, que só faz sentido na sequência da landing.
// A coluna do título leva a foto e o contato, para não sobrar vazio ao lado da
// lista, que é bem mais comprida.
function Perguntas({ comSeta = true }) {
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
        <div className={estilos.faqLado}>
          <div className={estilos.faqTexto}>
            <h2 className={estilos.h2}>Antes de comprar</h2>
            <div className={`${estilos.caixaMidia} ${estilos.faqFoto}`}>
              <Image
                className={estilos.cobrir}
                src="/landing/perguntas.webp"
                alt="Mulher sentada no chão, sorrindo, com uma peça do tabuleiro Super Pista numa mão e o celular com o logo do aplicativo na outra."
                fill
                sizes="(min-width: 860px) 400px, 92vw"
              />
            </div>
          </div>
          <div className={estilos.faqContato}>
            <h3 className={estilos.h3}>Ainda ficou com dúvida?</h3>
            <p className={estilos.faqContatoTexto}>
              Escreva para a gente e a equipe do Super Pista responde por
              e-mail.
            </p>
            <a
              className={estilos.faqContatoLink}
              href="mailto:contato@superpista.com"
            >
              contato@superpista.com
            </a>
          </div>
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

      {comSeta && <Descer destino="#comprar" rotulo="o preço" direita />}
    </section>
  );
}

export default Perguntas;
