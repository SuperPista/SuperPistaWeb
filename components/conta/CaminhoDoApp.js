import landing from "components/landing/landing.module.css";
import home from "components/home/home.module.css";
import estilos from "components/conta/conta.module.css";
import { ETAPAS } from "components/home/Aplicativo.js";

// Coluna ao lado dos formulários da conta: os mesmos quatro passos da seção
// do aplicativo na home, para lembrar para que a conta serve. O passo em que a
// pessoa está (`etapaAtual`, contando de 1) vira uma placa amarela.
function CaminhoDoApp({ etapaAtual, rotulo = "Você está aqui." }) {
  return (
    <aside className={estilos.lado} aria-labelledby="caminho-do-app">
      <h2 className={landing.h2} id="caminho-do-app">
        A conta que levanta a cidade
      </h2>
      <p className={`${landing.corpo} ${home.corpoClaro}`}>
        É com ela que você entra no aplicativo Super Pista e ativa o código do
        cartão que vem na sacola.
      </p>

      <ol className={`${home.etapasApp} ${estilos.etapas}`}>
        {ETAPAS.map((etapa, indice) => {
          const atual = indice + 1 === etapaAtual;

          return (
            <li
              className={
                atual ? `${home.etapaApp} ${estilos.etapaAtual}` : home.etapaApp
              }
              key={etapa}
              aria-current={atual ? "step" : undefined}
            >
              <span>
                {etapa}
                {atual && <span className={estilos.etapaRotulo}>{rotulo}</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

export default CaminhoDoApp;
