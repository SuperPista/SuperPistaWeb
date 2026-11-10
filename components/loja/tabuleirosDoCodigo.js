// O fallback permite exibir também respostas de servidores anteriores.
export function tabuleirosDoCodigo(item) {
  const boards = item.boards ?? [item.board];
  const cores = [...new Set(boards.filter(Boolean))];
  return `${cores.length === 1 ? "Tabuleiro" : "Tabuleiros"} ${cores.join(", ")}`;
}
