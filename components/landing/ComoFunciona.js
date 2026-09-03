import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";

const ETAPAS = [
  {
    titulo: "Tabuleiro",
    texto:
      "Quatro peças que encaixam de um jeito só e formam a cidade inteira: ruas, praça, escola, banco e estádio. Monta no chão ou na mesa.",
  },
  {
    titulo: "Aplicativo",
    texto:
      "Baixe o app do Super Pista no celular ou no tablet. Funciona em Android e em iPhone.",
  },
  {
    titulo: "Cidade",
    texto:
      "Aponte a câmera para o tabuleiro montado e a cidade aparece em cima dele. Os prédios sobem, as ruas se enchem e a criança passeia por dentro do que acabou de montar.",
  },
];

// O produto explicado em três partes, na ordem em que a criança usa.
function ComoFunciona() {
  return (
    <section className={estilos.secao} id="como-funciona">
      <div className={estilos.container}>
        <div className={estilos.introducao}>
          <h2 className={estilos.h2}>Tabuleiro, aplicativo, cidade</h2>
          <p className={estilos.lead}>
            Três partes e nenhuma delas precisa de óculos, controle ou tomada.
          </p>
        </div>

        <ol className={estilos.etapas}>
          {ETAPAS.map((etapa) => (
            <li className={estilos.etapa} key={etapa.titulo}>
              <h3 className={estilos.h3}>{etapa.titulo}</h3>
              <p className={estilos.corpo}>{etapa.texto}</p>
            </li>
          ))}
        </ol>
      </div>

      <Descer destino="#na-caixa" rotulo="o que vem na caixa" />
    </section>
  );
}

export default ComoFunciona;
