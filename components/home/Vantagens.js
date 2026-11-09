import landing from "components/landing/landing.module.css";
import estilos from "components/home/home.module.css";

// O que toda loja diz logo no começo: como chega, como paga e como devolve.
// Fica numa faixa de asfalto colada no herói, com um traço amarelo de pista
// antes de cada item.
const VANTAGENS = [
  { titulo: "Frete grátis", texto: "Para todo o Brasil." },
  {
    titulo: "Feito sob encomenda",
    texto: "Com o nome da criança, sem custo.",
  },
  {
    titulo: "Sete dias para devolver",
    texto: "Contados do dia em que a sacola chega.",
  },
  {
    titulo: "Pix, boleto ou cartão",
    texto: "Você escolhe na hora de pagar.",
  },
];

function Vantagens() {
  return (
    <section
      className={estilos.vantagensSecao}
      aria-label="Como é comprar no Super Pista"
    >
      <ul className={`${landing.container} ${estilos.vantagens}`}>
        {VANTAGENS.map((vantagem) => (
          <li className={estilos.vantagem} key={vantagem.titulo}>
            <strong>{vantagem.titulo}</strong>
            <span>{vantagem.texto}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Vantagens;
