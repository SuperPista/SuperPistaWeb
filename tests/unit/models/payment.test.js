import payment from "models/payment.js";
import { SLUG_DO_TABULEIRO, produtoPorSlug } from "components/loja/catalogo.js";

describe("models/payment.js", () => {
  describe(".maxInstallments()", () => {
    test.each([
      [500, 1],
      [1000, 1],
      [5990, 5],
      [11999, 11],
      [12000, 12],
      [24900, 12],
      [99900, 12],
    ])("with a total of %i cents", (total, esperado) => {
      expect(payment.maxInstallments(total)).toBe(esperado);
    });
  });

  describe(".productIdVariable()", () => {
    test("is named after the product", () => {
      const tabuleiro = produtoPorSlug(SLUG_DO_TABULEIRO);

      expect(payment.productIdVariable(tabuleiro)).toBe(
        "ABACATEPAY_PRODUCT_TABULEIRO_VERMELHO",
      );
    });
  });
});
