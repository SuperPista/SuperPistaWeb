import { useState } from "react";
import estilos from "components/landing/landing.module.css";
import Descer from "components/landing/Descer.js";

const LIMITE_DE_LETRAS = 10;

// Largura de cada maiúscula da Archivo 900, em fração do tamanho da fonte.
// Serve para o nome nunca passar da borda do círculo, com M e W ou com I e L.
const LARGURA_DA_LETRA = {
  I: 0.34,
  J: 0.58,
  L: 0.6,
  E: 0.65,
  F: 0.65,
  M: 0.94,
  W: 1.02,
  " ": 0.3,
};
const LARGURA_PADRAO = 0.72;

// As letras do nome saem coloridas no tabuleiro, na ordem desta lista.
const CORES_DAS_LETRAS = [
  "#e4002b",
  "#0057d8",
  "#00a94f",
  "#00bcd4",
  "#ffd100",
  "#ff6a00",
  "#8e24aa",
  "#e91e8c",
];

// Quanto cada letra sobe ou desce em relação à linha do nome, de -1 a 1.
// O sentido alterna a cada letra, então nunca saem duas seguidas do mesmo lado,
// e a intensidade vem da própria letra, então o desenho é sempre o mesmo no
// servidor e no navegador.
function desvioDaLetra(letra, indice) {
  const variacao = ((letra.charCodeAt(0) * 31 + indice * 17) % 7) / 6;
  const sentido = indice % 2 === 0 ? -1 : 1;

  return sentido * (0.35 + variacao * 0.65);
}

// O medalhão redondo que fica no centro do tabuleiro, com o nome impresso.
// Cada letra sai colorida, com contorno preto e um contorno branco por fora,
// que acompanha o desenho da letra em vez de ser uma caixa atrás dela. Cada
// letra cai um pouco acima ou abaixo da linha, como no tabuleiro impresso.
function Medalhao({ nome }) {
  const texto = nome.trim() === "" ? "DANIEL" : nome.toUpperCase();
  const letras = [...texto];

  // as letras, mais o espaço entre elas e o contorno branco das pontas
  const largura =
    letras.reduce(
      (soma, letra) => soma + (LARGURA_DA_LETRA[letra] ?? LARGURA_PADRAO),
      0,
    ) +
    letras.length * 0.2 +
    0.26;
  const tamanho = Math.min(56, 285 / largura);
  const espacamento = tamanho * 0.2;
  const meio = 190 + espacamento / 2;
  const base = 288;

  // dy no SVG é relativo à letra anterior, então guardamos o passo entre elas
  let anterior = 0;
  const desvios = letras.map((letra, indice) => {
    const alvo = desvioDaLetra(letra, indice) * tamanho * 0.12;
    const passo = alvo - anterior;
    anterior = alvo;

    return passo;
  });

  function escreve(cor) {
    return letras.map((letra, indice) => (
      <tspan key={indice} dy={desvios[indice]} fill={cor(indice)}>
        {letra}
      </tspan>
    ));
  }

  const medidas = {
    x: meio,
    y: base,
    fontSize: tamanho,
    fontWeight: 900,
    letterSpacing: espacamento,
    textAnchor: "middle",
    strokeLinejoin: "round",
  };

  return (
    <svg
      className={estilos.medalhao}
      viewBox="0 0 380 380"
      role="img"
      aria-label={`Centro do tabuleiro com o nome ${texto}`}
    >
      <circle
        cx="190"
        cy="190"
        r="187"
        fill="#ffd100"
        stroke="#000"
        strokeWidth="6"
      />
      <image
        href="/landing/logo-super-pista.webp"
        x="95"
        y="44"
        width="190"
        height="123"
      />

      <text
        x="190"
        y="210"
        fill="#000"
        fontSize="28"
        fontWeight="900"
        letterSpacing="2"
        textAnchor="middle"
      >
        DO
      </text>

      <text {...medidas} stroke="#fff" strokeWidth={tamanho * 0.26}>
        {escreve(() => "#fff")}
      </text>
      <text
        {...medidas}
        stroke="#000"
        strokeWidth={tamanho * 0.11}
        paintOrder="stroke"
      >
        {escreve(
          (indice) => CORES_DAS_LETRAS[indice % CORES_DAS_LETRAS.length],
        )}
      </text>
    </svg>
  );
}

// Só o visual: o nome digitado aparece no tabuleiro, nada é enviado ainda.
function Personalizacao() {
  const [nome, setNome] = useState("");

  function aoDigitar(evento) {
    const somenteLetras = evento.target.value
      .replace(/[^A-Za-z ]/g, "")
      .slice(0, LIMITE_DE_LETRAS);

    setNome(somenteLetras);
  }

  return (
    <section className={`${estilos.secao} ${estilos.escuro}`} id="nome">
      <div className={`${estilos.container} ${estilos.personalize}`}>
        <div>
          <div className={estilos.introducao}>
            <h2 className={estilos.h2}>O nome da criança no meio da cidade</h2>
            <p className={estilos.corpo}>
              Cada Super Pista sai da fábrica com o nome da criança impresso no
              centro do tabuleiro. Escreva aqui para ver como fica.
            </p>
          </div>

          <div className={estilos.campo}>
            <label className={estilos.rotulo} htmlFor="nome-da-crianca">
              Nome da criança
            </label>
            <input
              className={estilos.entrada}
              id="nome-da-crianca"
              name="nome-da-crianca"
              type="text"
              inputMode="text"
              autoComplete="off"
              maxLength={LIMITE_DE_LETRAS}
              placeholder="Daniel"
              value={nome}
              onChange={aoDigitar}
            />
            <p className={estilos.regra}>
              Até {LIMITE_DE_LETRAS} letras, sem acentos e sem números. Você
              confirma o nome depois da compra.
            </p>
          </div>
        </div>

        <div className={estilos.medalhaoCaixa}>
          <Medalhao nome={nome} />
        </div>
      </div>

      <Descer destino="#depoimentos" rotulo="quem já montou em casa" />
    </section>
  );
}

export default Personalizacao;
