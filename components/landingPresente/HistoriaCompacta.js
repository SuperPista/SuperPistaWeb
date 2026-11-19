import Image from "next/image";
import landing from "components/landing/landing.module.css";
import estilos from "components/landingPresente/presente.module.css";

function HistoriaCompacta() {
  return (
    <section className={estilos.secaoClara} id="quem-faz">
      <div className={landing.container}>
        <div className={estilos.historiaCartao}>
          <div className={estilos.autorFoto}>
            <Image
              className={estilos.midiaPreencher}
              src="/landing/alexander.webp"
              alt="Retrato do Alexander, criador da Super Pista."
              fill
              sizes="220px"
            />
          </div>

          <div className={estilos.historiaTexto}>
            <h2 className={landing.h2}>Criado por um pai, feito no Brasil</h2>
            <p className={landing.corpo}>
              Em 2011, Alexander criou o primeiro tabuleiro para o filho Pedro,
              então com 5 anos, brincar mais no chão e menos em frente às telas.
              Hoje, aos 20 anos e cursando tecnologia, Pedro ajudou a
              transformar aquela ideia na Super Pista com Realidade Aumentada em
              3D.
            </p>
            <p className={landing.corpo}>
              Cada unidade é feita sob encomenda, revisada antes do envio e
              entregue com frete grátis e sete dias corridos para devolução.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HistoriaCompacta;
