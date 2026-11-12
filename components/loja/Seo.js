import Head from "next/head";
import { REDES_SOCIAIS, urlAbsoluta } from "components/loja/links.js";

const IMAGEM_PADRAO = "/loja/tabuleiro-vermelho-montado.webp";

// Metatags de SEO, Open Graph (redes sociais e WhatsApp), Twitter Card e
// dados estruturados JSON-LD (Schema.org). Centraliza a presença orgânica
// de todas as páginas públicas e privadas do Super Pista.
function Seo({
  titulo,
  descricao,
  caminho = "",
  imagem = IMAGEM_PADRAO,
  tipo = "website",
  indexar = true,
  dadosEstruturados,
}) {
  const url = urlAbsoluta(caminho);
  const urlImagem = urlAbsoluta(imagem);
  const esquemas = Array.isArray(dadosEstruturados)
    ? dadosEstruturados.filter(Boolean)
    : dadosEstruturados
      ? [dadosEstruturados]
      : [];

  return (
    <>
      <Head>
        <title>{titulo}</title>
        {descricao && <meta name="description" content={descricao} />}

        {!indexar && <meta name="robots" content="noindex, nofollow" />}

        {indexar && <link rel="canonical" href={url} />}

        {/* Open Graph / WhatsApp / Facebook */}
        {indexar && <meta property="og:site_name" content="Super Pista" />}
        {indexar && <meta property="og:locale" content="pt_BR" />}
        {indexar && <meta property="og:type" content={tipo} />}
        {indexar && <meta property="og:url" content={url} />}
        {indexar && <meta property="og:title" content={titulo} />}
        {indexar && descricao && (
          <meta property="og:description" content={descricao} />
        )}
        {indexar && <meta property="og:image" content={urlImagem} />}

        {/* Twitter Card */}
        {indexar && <meta name="twitter:card" content="summary_large_image" />}
        {indexar && <meta name="twitter:title" content={titulo} />}
        {indexar && descricao && (
          <meta name="twitter:description" content={descricao} />
        )}
        {indexar && <meta name="twitter:image" content={urlImagem} />}
      </Head>

      {/* Dados Estruturados Schema.org / Rich Snippets */}
      {esquemas.map((esquema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(esquema),
          }}
        />
      ))}
    </>
  );
}

export function esquemaDoProduto(produto) {
  if (!produto) return null;
  const precoEmReais = produto.preco
    ? (produto.preco / 100).toFixed(2)
    : undefined;
  const foto = produto.fotos?.[0]?.src || IMAGEM_PADRAO;

  const esquema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produto.nome,
    description: produto.resumo,
    image: urlAbsoluta(foto),
    brand: {
      "@type": "Brand",
      name: "Super Pista",
    },
  };

  if (precoEmReais) {
    esquema.offers = {
      "@type": "Offer",
      price: precoEmReais,
      priceCurrency: "BRL",
      availability: produto.emBreve
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
      url: urlAbsoluta(`/loja/${produto.slug}`),
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil: "2027-12-31",
    };
  }

  return esquema;
}

export function esquemaFaq(perguntas) {
  if (!perguntas || !perguntas.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: perguntas.map((item) => ({
      "@type": "Question",
      name: item.pergunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.resposta,
      },
    })),
  };
}

export function esquemaOrganizacaoEWebsite() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Super Pista",
      url: urlAbsoluta("/"),
      logo: urlAbsoluta("/landing/logo-super-pista-3d.webp"),
      sameAs: REDES_SOCIAIS.map((rede) => rede.url),
      contactPoint: {
        "@type": "ContactPoint",
        email: "contato@superpista.com",
        contactType: "customer service",
        areaServed: "BR",
        availableLanguage: "Portuguese",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Super Pista",
      url: urlAbsoluta("/"),
    },
  ];
}

export default Seo;
