import Image from "next/image";
import landing from "components/landing/landing.module.css";
import estilos from "components/landingPresente/presente.module.css";
import useNomeDaCrianca from "components/nome/useNomeDaCrianca.js";
import { SLUG_DO_TABULEIRO, produtoPorSlug } from "components/loja/catalogo.js";
import { formatarReais } from "components/loja/dinheiro.js";
import { nomeNaPeca } from "components/loja/sacola.js";

// Cabeçalho fixo sem links de saída: mostra o valor da parcela e leva direto
// para a personalização ou fechamento do pedido.
function CabecalhoPresente() {
  const tabuleiro = produtoPorSlug(SLUG_DO_TABULEIRO);
  const { nome, artigo } = useNomeDaCrianca();
  const peca = nomeNaPeca({ nome, artigo });

  return (
    <header className={estilos.cabecalho}>
      <div className={`${landing.container} ${estilos.cabecalhoLinha}`}>
        <Image
          className={landing.marca}
          src="/landing/logo-super-pista.webp"
          alt="Super Pista"
          width={640}
          height={414}
          sizes="(min-width: 1055px) 116px, (min-width: 764px) 11vw, 84px"
          priority
        />

        <div className={estilos.cabecalhoAcao}>
          <p className={`${estilos.cabecalhoPreco} ${landing.dado}`}>
            <strong>
              {tabuleiro.parcelas.vezes}x de{" "}
              {formatarReais(tabuleiro.parcelas.valor)}
            </strong>
            <span>Frete grátis · Nome sem custo</span>
          </p>
          <a
            className={`${landing.botao} ${landing.botaoCompacto}`}
            href={peca ? "#fechar-presente" : "#personalizar-presente"}
          >
            {peca ? `Garantir o ${peca}` : "Personalizar presente"}
          </a>
        </div>
      </div>
    </header>
  );
}

export default CabecalhoPresente;
