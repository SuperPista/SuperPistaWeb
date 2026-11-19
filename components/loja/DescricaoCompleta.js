import Image from "next/image";
import estilos from "components/loja/descricao.module.css";
import landing from "components/landing/landing.module.css";

const condicoesDoNome = [
  "Não haverá custos para adicionar o nome ou apelido da criança.",
  "Pode vir ou não com o nome da criança (é opcional). Descreva o nome ou apelido da criança no ato do pedido.",
  "É indicado até 10 letras (de A à Z).",
  "O nome fica somente sobre uma das 4 partes do produto.",
  "Não é permitido colocar mais que um nome ou caracteres especiais ou números ou símbolos ou desenhos.",
  "As letras contêm cores sortidas aleatórias, não é possível escolher as cores das letras.",
  "As letras têm altura aproximada de 3 cm.",
  "As letras poderão vir alinhadas ou distribuídas de maneira que preencha o espaço disponível, veja os exemplos. (Sem aviso prévio).",
  "ATENÇÃO: Por padrão o produto já vem com o nome da marca SUPERPISTA. Em caso de alta na demanda de pedidos, os nomes poderão vir impressos direto no tabuleiro ou colados com adesivo sobreposto ao produto, sem aviso prévio.",
];

export const DESCRICOES_POR_PRODUTO = {
  "tabuleiro-vermelho": {
    cidade: "A cidade vermelha",
    temaLower: "vermelho",
    tema: {
      nome: "Tema vermelho",
      classe: null,
      itens: [
        "Estádio",
        "Escola",
        "Academia",
        "Praça, sol e nuvens",
        "Banco",
        "Mecânica de motos",
        "Hospital, dentista",
        "Lanchonete",
        "Semáforos, radar",
      ],
    },
    ilustracoes: {
      pecas: {
        src: "/loja/descricao/tabuleiro-vermelho-1.jpg",
        largura: 2363,
        altura: 2364,
        descricao:
          "As quatro peças separadas, suas medidas e o local do nome da criança.",
      },
      montado: {
        src: "/loja/descricao/tabuleiro-vermelho-2.jpg",
        largura: 2363,
        altura: 2363,
        descricao:
          "As quatro peças montadas, formando o tabuleiro de 76 × 76 cm.",
      },
      nomes: {
        src: "/loja/descricao/tabuleiro-vermelho-3.jpg",
        largura: 2363,
        altura: 2363,
        descricao:
          "Exemplos de como ficam os nomes: Sayuri e Murilo com poucas letras; Bernadette e Sandrinho com muitas letras.",
      },
    },
  },
  "tabuleiro-amarelo": {
    cidade: "A cidade amarela",
    temaLower: "amarelo",
    tema: {
      nome: "Tema amarelo",
      classe: "temaAmarelo",
      itens: [
        "Polícia",
        "Apartamentos",
        "Pet shop",
        "Mecânica e guincho",
        "Posto de serviços",
        "Lava rápido",
        "Prédios comerciais",
        "Praça, sol e nuvens",
        "Semáforos, radar",
        "Helicóptero",
      ],
    },
    ilustracoes: {
      pecas: {
        src: "/loja/descricao/tabuleiro-amarelo-1.jpg",
        largura: 2363,
        altura: 2363,
        descricao:
          "As quatro peças separadas, suas medidas e o local do nome da criança.",
      },
      montado: {
        src: "/loja/descricao/tabuleiro-amarelo-2.jpg",
        largura: 2363,
        altura: 2363,
        descricao:
          "As quatro peças montadas, formando o tabuleiro de 76 × 76 cm.",
      },
      nomes: {
        src: "/loja/descricao/tabuleiro-amarelo-3.jpg",
        largura: 2364,
        altura: 2363,
        descricao:
          "Exemplos de como ficam os nomes: Amanda e Feliphe com poucas letras; Bernadette e Pedrinho com muitas letras.",
      },
    },
  },
};

export function temDescricaoCompleta(slug) {
  return Boolean(DESCRICOES_POR_PRODUTO[slug]);
}

function Ilustracao({ src, largura, altura, descricao }) {
  return (
    <figure className={estilos.figura}>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ampliar: ${descricao}`}
      >
        <Image
          src={src}
          alt={descricao}
          width={largura}
          height={altura}
          sizes="(min-width: 900px) 560px, 92vw"
          className={estilos.imagem}
        />
      </a>
      <figcaption>
        {descricao}{" "}
        <a href={src} target="_blank" rel="noopener noreferrer">
          Ampliar imagem
        </a>
      </figcaption>
    </figure>
  );
}

// Transcrição integral das descrições 4–7, acompanhada das ilustrações 1–3
// de cada tabuleiro que já possui material oficial.
export default function DescricaoCompleta({
  slug = "tabuleiro-vermelho",
} = {}) {
  const detalhes = DESCRICOES_POR_PRODUTO[slug];
  if (!detalhes) return null;

  const { cidade, temaLower, tema, ilustracoes } = detalhes;
  const classeTema = tema.classe
    ? `${estilos.tema} ${estilos[tema.classe]}`
    : estilos.tema;

  return (
    <section
      className={estilos.secao}
      id="descricao-completa"
      aria-labelledby="titulo-descricao"
    >
      <div className={`${landing.container} ${estilos.descricao}`}>
        <header className={estilos.cabecalho}>
          <h2 id="titulo-descricao" className={landing.h2}>
            Cada detalhe da sua Super Pista
          </h2>
          <nav className={estilos.indice} aria-label="Detalhes do produto">
            <a href="#montagem">Montagem e medidas</a>
            <a href="#personalizacao">Nome da criança</a>
            <a href="#temas">{cidade}</a>
            <a href="#modo-de-usar">Aplicativo 3D</a>
            <a href="#devolucao">Devolução</a>
          </nav>
        </header>
        <section className={estilos.bloco} id="montagem">
          <h3>Montagem e medidas do tabuleiro tema {temaLower}</h3>
          <p>
            Como montar: é só juntar as 4 partes numeradas indicadas no canto de
            cada peça. Cada peça mede 38 × 38 cm; o tabuleiro agrupado mede 76 ×
            76 cm. O nome da criança fica na parte 4.
          </p>
          <div className={estilos.grade}>
            <Ilustracao {...ilustracoes.pecas} />
            <Ilustracao {...ilustracoes.montado} />
          </div>
        </section>
        <section
          className={`${estilos.bloco} ${estilos.personalizacao}`}
          id="personalizacao"
        >
          <h3>Condições para uso de nomes personalizados no tabuleiro</h3>
          <div className={estilos.condicoes}>
            {condicoesDoNome.map((texto) => (
              <p key={texto}>{texto}</p>
            ))}
          </div>
          <div className={estilos.exemplo}>
            <Ilustracao {...ilustracoes.nomes} />
          </div>
        </section>
        <section className={estilos.bloco} id="temas">
          <h3>Conteúdo das artes</h3>
          <p>
            Conheça as artes impressas e os elementos 3D do tabuleiro tema{" "}
            {temaLower}:
          </p>
          <div>
            <div className={classeTema}>
              <h4>{tema.nome}</h4>
              <ul>
                {tema.itens.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p>
            <strong>
              Antes de finalizar a compra, verifique se você está comprando o
              produto certo.
            </strong>
          </p>
        </section>
        <section className={estilos.bloco} id="modo-de-usar">
          <h3>Como ver a mini cidade em 3D</h3>
          <p>Ativando a Realidade Aumentada no celular ou tablet.</p>
          <div className={estilos.instrucoes}>
            <div className={estilos.instrucao}>
              <h4>Verifique se o seu dispositivo é compatível</h4>
              <p>
                Veja a lista de dispositivos na descrição do produto /
                Dispositivos compatíveis.
              </p>
              <p>
                Antes de comprar, confira na Play Store ou na App Store se o seu
                aparelho é compatível com o aplicativo Super Pista.
              </p>
            </div>
            <div className={estilos.instrucao}>
              <h4>Baixe o app SUPERPISTA</h4>
              <p>Na loja Playstore ou Apple store.</p>
            </div>
            <div className={estilos.instrucao}>
              <h4>Se o produto é seu</h4>
              <p>
                Pode ser usado em até 2 dispositivos diferentes. No ato da
                compra é fornecido um código de segurança único. Abra o App
                SUPERPISTA e insira este código no campo indicado, pronto, é só
                usar. (Atenção: não insira o código em dispositivos de
                terceiros.)
              </p>
            </div>
            <div className={estilos.instrucao}>
              <h4>Se o produto é de um amigo</h4>
              <p>
                Faça o teste por 3 dias grátis, e após este período ele é
                bloqueado. Para desbloquear é necessário comprar o tabuleiro e
                inserir o código que acompanha o produto.
              </p>
            </div>
            <div className={estilos.instrucao}>
              <h4>Modo de usar</h4>
              <p>
                Aponte a câmera do dispositivo sobre a imagem ALVO indicada no
                tabuleiro (PARTE 1) e veja na tela do dispositivo as imagens da
                mini cidade surgir em 3D.
              </p>
            </div>
            <div className={estilos.instrucao}>
              <h4>Compartilhe as imagens 3D do tabuleiro</h4>
              <p>
                Ao clicar no botão da câmera é possível tirar uma foto, surgem
                opções de redes sociais, compartilhe com os amigos e familiares.
              </p>
            </div>
          </div>
        </section>
        <section
          className={`${estilos.bloco} ${estilos.devolucao}`}
          id="devolucao"
        >
          <h3>Devolução e reembolso</h3>
          <p>
            Você tem até 7 dias corridos para devolver o produto. A partir do
            dia em que recebeu o produto.
          </p>
          <p>
            <strong>Consulte condições:</strong> leia na descrição do produto.
          </p>
          <p>
            Você tem sete dias corridos depois de receber para devolver e
            receber o valor de volta, inclusive o frete. Para falar com a
            equipe, escreva para{" "}
            <a href="mailto:contato@superpista.com">contato@superpista.com</a>.
          </p>
        </section>
      </div>
    </section>
  );
}
