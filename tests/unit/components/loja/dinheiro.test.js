import { formatarReais, partesDoPreco } from "components/loja/dinheiro.js";

// O Intl separa o cifrão do valor com um espaço que não quebra a linha.
function comEspacoComum(texto) {
  return texto.replace(/\s/g, " ");
}

describe("components/loja/dinheiro.js", () => {
  describe(".formatarReais()", () => {
    test.each([
      [0, "R$ 0,00"],
      [5, "R$ 0,05"],
      [2430, "R$ 24,30"],
      [24900, "R$ 249,00"],
      [124990, "R$ 1.249,90"],
    ])("with %i cents", (centavos, esperado) => {
      expect(comEspacoComum(formatarReais(centavos))).toBe(esperado);
    });
  });

  describe(".partesDoPreco()", () => {
    test.each([
      [24900, { reais: "249", centavos: "00" }],
      [2430, { reais: "24", centavos: "30" }],
      [5, { reais: "0", centavos: "05" }],
      [124990, { reais: "1.249", centavos: "90" }],
    ])("with %i cents", (centavos, esperado) => {
      expect(partesDoPreco(centavos)).toEqual(esperado);
    });
  });
});
