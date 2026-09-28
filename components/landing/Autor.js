import Image from "next/image";
import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";

// TODO: conferir a história com o Alexander.
function Autor() {
  return (
    <section className={estilos.secao} id="autor">
      <div className={estilos.container}>
        <div className={estilos.autor}>
          <div className={`${estilos.foto} ${estilos.autorFoto}`}>
            <Image
              className={estilos.fotoImagem}
              src="/landing/alexander.webp"
              alt="Retrato do Alexander, que criou o Super Pista."
              fill
              sizes="260px"
            />
          </div>
          <div className={estilos.autorTexto}>
            <h2 className={estilos.h2}>Quem faz o Super Pista</h2>
            <p className={estilos.corpo}>
              Sou o Alexander. O Super Pista começou de uma cena que se repetia
              em casa: a criança montando cidade no chão com peça de encaixe e,
              do lado, o tablet ligado sem ninguém olhar. Em vez de disputar com
              a tela, resolvi fazer as duas coisas trabalharem juntas.
            </p>
            <p className={estilos.corpo}>
              O tabuleiro tem quatro peças de MDF e serve de base para os
              brinquedos que a criança já tem em casa. Ela monta a cidade do
              jeito dela e, se quiser, pega o celular para ver de pé o que
              acabou de montar.
            </p>
          </div>
        </div>
      </div>

      <Descer destino="#perguntas" rotulo="as perguntas" />
    </section>
  );
}

export default Autor;
