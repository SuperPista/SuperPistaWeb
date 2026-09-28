import { useState } from "react";
import { artigoDoNome } from "components/nome/artigo.js";

// O nome que aparece no campo e na prévia enquanto ninguém escreveu nada.
export const NOME_DE_EXEMPLO = "Daniel";

// Guarda o nome da criança e o "da" ou "do" que vai antes dele. O artigo segue
// o palpite pelo nome até a pessoa escolher um nos botões do campo, e a escolha
// vale até o campo ficar vazio, para não passar de um nome para o próximo.
function useNomeDaCrianca() {
  const [nome, setNome] = useState("");
  const [artigoEscolhido, setArtigoEscolhido] = useState(null);

  function mudarNome(novoNome) {
    setNome(novoNome);

    if (novoNome === "") {
      setArtigoEscolhido(null);
    }
  }

  return {
    nome,
    artigo: artigoEscolhido ?? artigoDoNome(nome || NOME_DE_EXEMPLO),
    mudarNome,
    escolherArtigo: setArtigoEscolhido,
  };
}

export default useNomeDaCrianca;
