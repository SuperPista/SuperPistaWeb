import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import landing from "components/landing/landing.module.css";
import estilos from "components/loja/loja.module.css";
import Preco from "components/loja/Preco.js";
import Quantidade from "components/loja/Quantidade.js";
import useSacola from "components/loja/useSacola.js";
import { nomeNaPeca } from "components/loja/sacola.js";
import { LINK_SACOLA } from "components/loja/links.js";
import CampoDoNome from "components/nome/CampoDoNome.js";
import Medalhao from "components/nome/Medalhao.js";
import useNomeDaCrianca from "components/nome/useNomeDaCrianca.js";

// A coluna da compra na página do produto: nome, preço, o aplicativo quando o
// produto vem com ele, o nome da criança quando o produto aceita, a quantidade
// e o botão. O quadro do aplicativo leva para a explicação inteira, mais
// abaixo na mesma página. O nome da criança é o mesmo
// da prévia da home e da landing: quem já escreveu lá encontra o campo
// preenchido, e ele continua lá ao passar de um tabuleiro para outro.
function Compra({ produto }) {
  const { nome, artigo, mudarNome, escolherArtigo } = useNomeDaCrianca();
  const adicionar = useSacola((estado) => estado.adicionar);
  const [quantidade, setQuantidade] = useState(1);
  const [colocado, setColocado] = useState(null);

  function colocarNaSacola() {
    const linha = {
      slug: produto.slug,
      quantidade,
      nome: produto.aceitaNome ? nome : "",
      artigo: produto.aceitaNome ? artigo : "",
    };
    const peca = nomeNaPeca(linha);

    adicionar(linha);
    setColocado(
      peca
        ? `${quantidade} × ${produto.nome}, com o nome ${peca}.`
        : `${quantidade} × ${produto.nome}.`,
    );
    setQuantidade(1);
  }

  return (
    <div className={estilos.compra}>
      <h1 className={estilos.produtoTitulo}>{produto.nome}</h1>
      <p className={estilos.compraResumo}>{produto.resumo}</p>
      <Preco produto={produto} grande />

      {produto.comAplicativo && (
        <a className={estilos.appDestaque} href="#aplicativo">
          <span className={estilos.appDestaqueFoto}>
            <Image
              className={estilos.cobrir}
              src="/home/app-semaforo-poster.webp"
              alt=""
              fill
              sizes="110px"
            />
          </span>
          <span className={estilos.appDestaqueTexto}>
            <strong>Vem com o aplicativo de Realidade Aumentada</strong>
            <span>
              Aponte o celular para o tabuleiro e a cidade aparece de pé, em 3D.
              O código de ativação vem na sacola.
            </span>
            <span className={estilos.appDestaqueLink}>Ver como funciona</span>
          </span>
        </a>
      )}

      {produto.aceitaNome && (
        <div className={estilos.nomeCaixa}>
          <div>
            <h2 className={estilos.nomeCaixaTitulo}>
              Quer o nome da criança na cidade?
            </h2>
            <p className={estilos.nomeCaixaTexto}>
              É opcional e não custa nada. Sem nome, a peça vem só com a marca
              Super Pista.
            </p>
          </div>
          <div className={estilos.nomeCampo}>
            <CampoDoNome
              nome={nome}
              artigo={artigo}
              aoMudar={mudarNome}
              aoEscolherArtigo={escolherArtigo}
            />
          </div>
          <div className={estilos.nomePrevia}>
            <Medalhao nome={nome} artigo={artigo} />
          </div>
        </div>
      )}

      <div className={estilos.compraLinha}>
        <Quantidade valor={quantidade} aoMudar={setQuantidade} />
        <button
          className={landing.botao}
          type="button"
          onClick={colocarNaSacola}
        >
          Colocar na sacola
        </button>
      </div>

      {/* a região existe desde o começo, para o leitor de tela anunciar o
          que entra nela */}
      <div role="status">
        {colocado && (
          <div className={estilos.naSacola}>
            <p>Está na sacola: {colocado}</p>
            <Link href={LINK_SACOLA}>Ver a sacola</Link>
          </div>
        )}
      </div>

      {produto.garantias && (
        <ul className={`${estilos.garantias} ${landing.dado}`}>
          {produto.garantias.map((garantia) => (
            <li key={garantia}>{garantia}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Compra;
