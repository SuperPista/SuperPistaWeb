import { useState } from "react";
import useSWR from "swr";

import estilos from "components/conta/conta.module.css";
import { pedir } from "components/conta/pedir.js";

async function buscarAtivacoes(caminho) {
  const resposta = await pedir(caminho);

  if (!resposta.ok) {
    throw resposta.corpo;
  }

  return resposta.corpo;
}

function MeusCodigos() {
  const {
    data: ativacoes,
    error,
    isLoading,
  } = useSWR("/api/v1/user/activations", buscarAtivacoes);
  const [copiado, setCopiado] = useState(null);

  async function copiar(codigo) {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(codigo);
      setTimeout(() => setCopiado(null), 3000);
    } catch {
      // Falha silenciosa de cópia no clipboard
    }
  }

  if (isLoading) {
    return (
      <div className={estilos.campo}>
        <h2 className={estilos.secaoTitulo}>Tabuleiros e códigos do app</h2>
        <p className={estilos.dica}>Buscando seus tabuleiros...</p>
      </div>
    );
  }

  if (error || !Array.isArray(ativacoes) || ativacoes.length === 0) {
    return (
      <div className={estilos.campo}>
        <h2 className={estilos.secaoTitulo}>Tabuleiros e códigos do app</h2>
        <p className={estilos.dica}>
          Quando você comprar um tabuleiro na loja, o código de ativação do
          aplicativo aparece aqui. Cada código pode ser usado em até 2 aparelhos
          diferentes.
        </p>
      </div>
    );
  }

  return (
    <div className={estilos.campo}>
      <h2 className={estilos.secaoTitulo}>Meus tabuleiros e códigos do app</h2>
      <p className={estilos.explica}>
        Use os códigos abaixo no aplicativo Super Pista para liberar a cidade
        correspondente em Realidade Aumentada. Cada código funciona em até 2
        aparelhos:
      </p>

      <ul className={estilos.lista}>
        {ativacoes.map((item) => (
          <li key={item.id} className={estilos.itemCodigo}>
            <div>
              <strong>Tabuleiro {item.board}</strong> — Pedido {item.order_code}
              <br />
              <span className={estilos.dica}>
                Aparelhos ativos: {item.devices_count} de 2
              </span>
            </div>
            <div className={estilos.blocoCodigo}>
              <code className={estilos.codigoTexto}>{item.code}</code>
              <button
                className={estilos.botaoTexto}
                type="button"
                onClick={() => copiar(item.code)}
              >
                {copiado === item.code ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MeusCodigos;
