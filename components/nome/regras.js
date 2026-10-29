// O que pode ser impresso no círculo da peça: um nome só, com letras de A a Z,
// até o limite, e o "da" ou "do" que vai antes dele. Vale para o campo do nome
// e para a conferência do pedido no servidor.
export const LIMITE_DE_LETRAS = 10;
export const ARTIGOS = ["da", "do"];

// Tira do que foi digitado o que não pode ser impresso.
export function limparNome(texto) {
  return texto.replace(/[^A-Za-z]/g, "").slice(0, LIMITE_DE_LETRAS);
}

export function nomeImprimivel(nome) {
  return /^[A-Za-z]+$/.test(nome) && nome.length <= LIMITE_DE_LETRAS;
}
