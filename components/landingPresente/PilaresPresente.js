import landing from "components/landing/landing.module.css";
import estilos from "components/landingPresente/presente.module.css";

const PILARES = [
  {
    destaque: "76 × 76 cm",
    texto:
      "4 peças de MDF de reflorestamento (38 × 38 cm) que montam em segundos e voltam para a sacola.",
  },
  {
    destaque: "Nome grátis",
    texto:
      "Personalizado com o nome ou apelido da criança na peça 4 sem custo extra.",
  },
  {
    destaque: "App 3D offline",
    texto:
      "Código de ativação enviado por e-mail e no pedido, liberado em até 2 aparelhos permanentes.",
  },
  {
    destaque: "Frete grátis",
    texto:
      "Entrega para todo o Brasil, produção em até 2 dias úteis e 7 dias corridos para devolver.",
  },
];

function PilaresPresente() {
  return (
    <section className={estilos.secaoAmarela} aria-label="Resumo do produto">
      <div className={landing.container}>
        <ul className={estilos.pilares}>
          {PILARES.map((pilar) => (
            <li className={estilos.pilar} key={pilar.destaque}>
              <span className={estilos.pilarDestaque}>{pilar.destaque}</span>
              <p>{pilar.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default PilaresPresente;
