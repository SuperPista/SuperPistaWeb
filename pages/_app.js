import { useEffect } from "react";
import { acordar } from "components/loja/acordar.js";
import useSacola from "components/loja/useSacola.js";
import usePedido from "components/loja/usePedido.js";
import { useNomeGuardado } from "components/nome/useNomeDaCrianca.js";

// O único trabalho daqui é ler, depois de a página montar, o que ficou
// guardado no navegador: a sacola, o pedido e o nome da criança.
function App({ Component, pageProps }) {
  useEffect(() => {
    acordar(useSacola);
    acordar(usePedido);
    acordar(useNomeGuardado);
  }, []);

  return <Component {...pageProps} />;
}

export default App;
