import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  adicionarLinha,
  mudarQuantidadeDaLinha,
  removerLinha,
  resumirSacola,
} from "components/loja/sacola.js";

// A sacola de compras. Fica no localStorage, para continuar cheia quando a
// pessoa fecha a aba e volta outro dia. As contas estão em sacola.js; aqui só
// mora o estado. A leitura do que estava guardado é feita por acordar.js.
const useSacola = create(
  persist(
    (set) => ({
      linhas: [],
      pronto: false,

      adicionar: (linha) =>
        set((estado) => ({ linhas: adicionarLinha(estado.linhas, linha) })),

      mudarQuantidade: (chave, quantidade) =>
        set((estado) => ({
          linhas: mudarQuantidadeDaLinha(estado.linhas, chave, quantidade),
        })),

      remover: (chave) =>
        set((estado) => ({ linhas: removerLinha(estado.linhas, chave) })),

      esvaziar: () => set({ linhas: [] }),
    }),
    {
      name: "superpista-sacola",
      version: 1,
      partialize: (estado) => ({ linhas: estado.linhas }),
      skipHydration: true,
    },
  ),
);

// As linhas já com produto, valores e totais, para as telas não refazerem a
// conta a cada renderização.
export function useResumoDaSacola() {
  const linhas = useSacola((estado) => estado.linhas);

  return useMemo(() => resumirSacola(linhas), [linhas]);
}

export default useSacola;
