import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";

// TODO: textos e fotos de exemplo. Substituir pelos depoimentos reais, com a
// autorização de quem aparece na foto.
const DEPOIMENTOS = [
  {
    texto:
      "Montaram a cidade três vezes no mesmo dia, cada vez de um jeito. O celular só entra depois que o tabuleiro está pronto, e isso mudou a briga aqui em casa.",
    quem: "Camila, mãe do Théo, 7 anos",
  },
  {
    texto:
      "Comprei sem entender direito o que era realidade aumentada. Meu filho explicou para mim em dois minutos e desde então ele é o dono do manual.",
    quem: "Rodrigo, pai da Alice, 6 anos",
  },
  {
    texto:
      "Uso na sala de aula com turmas de nove anos. Eles montam a cidade, apontam o tablet e saem falando de rua, banco e hospital sem eu pedir.",
    quem: "Simone, professora do fundamental",
  },
];

function Depoimentos() {
  return (
    <section className={estilos.secao} id="depoimentos">
      <div className={estilos.container}>
        <h2 className={estilos.h2}>Quem já montou em casa</h2>

        <div className={estilos.depoimentos}>
          {DEPOIMENTOS.map((depoimento) => (
            <figure className={estilos.depoimento} key={depoimento.quem}>
              <blockquote className={estilos.depoimentoTexto}>
                {depoimento.texto}
              </blockquote>
              <figcaption className={estilos.assinaturaLinha}>
                {/* TODO: colocar a foto de quem deu o depoimento. */}
                <div className={`${estilos.foto} ${estilos.fotoPequena}`} />
                <span className={`${estilos.assinatura} ${estilos.dado}`}>
                  {depoimento.quem}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <Descer destino="#autor" rotulo="quem faz o Super Pista" direita />
    </section>
  );
}

export default Depoimentos;
