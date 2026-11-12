import Image from "next/image";
import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";

function Autor() {
  return (
    <section className={estilos.secao} id="autor">
      <div className={estilos.container}>
        <div className={estilos.autor}>
          <div className={`${estilos.foto} ${estilos.autorFoto}`}>
            <Image
              className={estilos.fotoImagem}
              src="/landing/alexander.webp"
              alt="Retrato do Alexander, criador da Super Pista."
              fill
              sizes="260px"
            />
          </div>
          <div className={estilos.autorTexto}>
            <h2 className={estilos.h2}>Quem faz o Super Pista</h2>
            <p className={estilos.corpo}>
              Olá, eu sou Alexander, criador da SUPERPISTA.
            </p>
            <p className={estilos.corpo}>
              Em 2011, quando meu filho Pedro tinha 5 anos, percebi que ele
              passava tempo demais em frente às telas. Para incentivar
              brincadeiras mais criativas, criei um tabuleiro com uma mini
              cidade e pistas para carrinhos, onde ele pudesse usar seus
              brinquedos físicos.
            </p>
            <p className={estilos.corpo}>
              O resultado foi incrível: Pedro reduziu o tempo de tela, chamou os
              amigos para brincar e viveu muitas tardes de diversão longe dos
              eletrônicos.
            </p>
            <p className={estilos.corpo}>
              Hoje, aos 20 anos e cursando tecnologia, ele me ajudou a
              transformar a ideia na SUPERPISTA. O tabuleiro físico ganhou
              recursos de Realidade Aumentada, que podem ser ativados em
              celulares e tablets. Ao apontar a câmera do aplicativo para o
              cenário, prédios, casas, placas e semáforos em 3D ganham vida na
              tela.
            </p>
            <p className={estilos.corpo}>
              O tabuleiro também pode ser personalizado com o nome ou apelido da
              criança e permite brincar com ou sem dispositivos eletrônicos.
            </p>
            <p className={estilos.corpo}>
              Acreditamos que a tecnologia, quando unida aos brinquedos físicos,
              aproxima pais e filhos, avós e netos, criando momentos de
              aprendizado e diversão.
            </p>
            <p className={estilos.corpo}>
              As crianças crescem rápido. Não perca esses momentos!
              <br />
              Montem, brinquem e divirtam-se!
            </p>
          </div>
        </div>
      </div>

      <Descer destino="#perguntas" rotulo="as perguntas" />
    </section>
  );
}

export default Autor;
