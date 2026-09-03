import Image from "next/image";
import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";

// 1ª dobra: a promessa e a descrição dela. O botão de compra fica no
// cabeçalho, que acompanha a rolagem.
function Hero() {
  return (
    <section className={estilos.heroi}>
      <div className={estilos.container}>
        <h1 className={estilos.h1}>
          Monte a pista.
          <br />
          Aponte o celular.
          <br />A cidade aparece.
        </h1>

        <div className={estilos.heroiCorpo}>
          <div className={estilos.heroiTexto}>
            <p className={estilos.lead}>
              O Super Pista é um tabuleiro de quatro peças que a criança encaixa
              e vira uma cidade inteira. Quando ela aponta a câmera do celular,
              os prédios sobem do tabuleiro e a cidade ganha vida ali, na mesa
              da sala.
            </p>
            <p className={estilos.reforco}>
              Frete grátis para todo o Brasil e sete dias para devolver se não
              for o que você esperava.
            </p>
          </div>

          <div className={estilos.arteEspaco}>
            <p className={`${estilos.selo} ${estilos.seloArte}`}>
              Sem óculos,
              <br />
              sem controle,
              <br />
              sem pilha
            </p>
            <Image
              className={estilos.arteImagem}
              src="/landing/tabuleiro.webp"
              alt="Tabuleiro do Super Pista montado com as quatro peças encaixadas, formando uma cidade com ruas, praça, escola, banco e estádio, e o nome da criança no centro."
              width={1400}
              height={992}
              sizes="(min-width: 900px) 46vw, 92vw"
              priority
            />
          </div>
        </div>
      </div>

      <Descer destino="#demonstracao" rotulo="o vídeo da brincadeira" />
    </section>
  );
}

export default Hero;
