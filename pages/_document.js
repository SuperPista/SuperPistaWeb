import { Html, Head, Main, NextScript } from "next/document";

function Document() {
  return (
    <Html lang="pt-BR" data-scroll-behavior="smooth">
      <Head>
        {/* O emblema do logo, que é a parte dele que continua legível numa
            aba: o .ico leva 16, 32, 48 e 64 px, e o iOS usa o quadrado. */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
