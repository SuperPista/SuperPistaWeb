import landing from "components/landing/landing.module.css";
import home from "components/home/home.module.css";
import estilos from "components/conta/conta.module.css";
import Faixa from "components/landing/Faixa.js";
import Moldura from "components/conta/Moldura.js";
import CaminhoDoApp from "components/conta/CaminhoDoApp.js";

// Telas da conta: a seção vermelha do aplicativo, como na home, com a placa
// do formulário e, ao lado, o caminho até a cidade (ou o que vier em `lado`;
// `false` deixa a placa sozinha). `larga` abre mais espaço para a Minha conta.
function PaginaDaConta({
  titulo,
  etapaAtual,
  rotuloDaEtapa,
  lado,
  larga = false,
  children,
}) {
  return (
    <Moldura titulo={titulo} classe={larga ? estilos.larga : ""}>
      <section
        className={`${landing.secao} ${home.fundoVermelho}`}
        aria-label={titulo}
      >
        <div className={`${landing.container} ${estilos.grade}`}>
          <div className={estilos.placa}>{children}</div>
          {lado ?? (
            <CaminhoDoApp etapaAtual={etapaAtual} rotulo={rotuloDaEtapa} />
          )}
        </div>
      </section>
      <Faixa />
    </Moldura>
  );
}

export default PaginaDaConta;
