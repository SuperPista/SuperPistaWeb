import { useState } from "react";

import estilos from "components/conta/conta.module.css";
import Aviso from "components/conta/Aviso.js";
import { pedir } from "components/conta/pedir.js";

// Baixa em JSON tudo o que o banco guarda sobre a conta (LGPD, art. 18). É um
// direito que precisa estar à mão, mas quase ninguém usa: é uma linha
// discreta no pé da placa da Minha conta, sem título nem botão da marca.
function BaixarDados() {
  const [baixando, setBaixando] = useState(false);
  const [erro, setErro] = useState(null);

  async function baixar() {
    setBaixando(true);
    setErro(null);

    const resposta = await pedir("/api/v1/user/export");

    setBaixando(false);

    if (!resposta.ok) {
      setErro(resposta.corpo);
      return;
    }

    const arquivo = new Blob([JSON.stringify(resposta.corpo, null, 2)], {
      type: "application/json",
    });
    const endereco = URL.createObjectURL(arquivo);
    const link = document.createElement("a");
    const dia = new Date().toISOString().split("T")[0];

    link.href = endereco;
    link.download = `superpista-meus-dados-${dia}.json`;
    link.click();
    URL.revokeObjectURL(endereco);
  }

  return (
    <>
      <p>
        Quer uma cópia de tudo o que guardamos sobre a sua conta?{" "}
        <button
          className={estilos.botaoTexto}
          type="button"
          disabled={baixando}
          onClick={baixar}
        >
          {baixando ? "Preparando o arquivo..." : "Baixar meus dados"}
        </button>
      </p>
      <Aviso erro={erro} />
    </>
  );
}

export default BaixarDados;
