// Dinheiro na loja é sempre um inteiro em centavos: 24900 são R$ 249,00. Só
// vira texto na hora de mostrar, para nenhuma conta ser feita com vírgula.
const REAIS = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const MILHARES = new Intl.NumberFormat("pt-BR");

export function formatarReais(centavos) {
  return REAIS.format(centavos / 100);
}

// O preço em duas partes, para o cartaz mostrar os reais grandes e os centavos
// pequenos ao lado.
export function partesDoPreco(centavos) {
  return {
    reais: MILHARES.format(Math.trunc(centavos / 100)),
    centavos: String(centavos % 100).padStart(2, "0"),
  };
}
