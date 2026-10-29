import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { artigoDoNome } from "components/nome/artigo.js";

// O nome que aparece no campo e na prévia enquanto ninguém escreveu nada.
export const NOME_DE_EXEMPLO = "Daniel";

// O nome é um só para o site inteiro: o que a pessoa escreve na prévia da home
// ou da landing já está no campo quando ela chega à página do tabuleiro, e
// segue dali para a sacola. Fica guardado só nesta aba (sessionStorage), e a
// leitura do que estava guardado é feita por components/loja/acordar.js.
export const useNomeGuardado = create(
  persist(
    (set) => ({
      nome: "",
      artigoEscolhido: null,
      pronto: false,

      // a escolha do artigo vale até o campo ficar vazio, para não passar de
      // um nome para o próximo
      mudarNome: (novoNome) =>
        set(
          novoNome === ""
            ? { nome: "", artigoEscolhido: null }
            : { nome: novoNome },
        ),

      escolherArtigo: (artigo) => set({ artigoEscolhido: artigo }),
    }),
    {
      name: "superpista-nome",
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (estado) => ({
        nome: estado.nome,
        artigoEscolhido: estado.artigoEscolhido,
      }),
      skipHydration: true,
    },
  ),
);

// Guarda o nome da criança e o "da" ou "do" que vai antes dele. O artigo segue
// o palpite pelo nome até a pessoa escolher um nos botões do campo.
function useNomeDaCrianca() {
  const nome = useNomeGuardado((estado) => estado.nome);
  const artigoEscolhido = useNomeGuardado((estado) => estado.artigoEscolhido);
  const mudarNome = useNomeGuardado((estado) => estado.mudarNome);
  const escolherArtigo = useNomeGuardado((estado) => estado.escolherArtigo);

  return {
    nome,
    artigo: artigoEscolhido ?? artigoDoNome(nome || NOME_DE_EXEMPLO),
    mudarNome,
    escolherArtigo,
  };
}

export default useNomeDaCrianca;
