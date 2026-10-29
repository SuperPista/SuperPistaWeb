import order from "models/order.js";
import { ValidationError } from "infra/errors.js";
import { SLUG_DO_TABULEIRO, produtoPorSlug } from "components/loja/catalogo.js";

const tabuleiro = produtoPorSlug(SLUG_DO_TABULEIRO);

function validInput(overrides = {}) {
  return {
    customer: {
      name: "  Marina   Albuquerque ",
      email: " marina@example.com ",
      phone: "(11) 98765-4321",
      tax_id: "529.982.247-25",
    },
    shipping_address: {
      zip_code: "01310100",
      street: "Avenida Paulista",
      number: "1000",
      complement: "",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
    },
    items: [
      {
        slug: SLUG_DO_TABULEIRO,
        quantity: 2,
        child_name: "Celinha",
        article: "da",
      },
      { slug: SLUG_DO_TABULEIRO, quantity: 1, child_name: "", article: "" },
    ],
    ...overrides,
  };
}

describe("models/order.js", () => {
  describe(".prepare()", () => {
    test("with valid input", () => {
      const prepared = order.prepare(validInput());

      expect(prepared.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(prepared.code).toMatch(/^SP-[2-9A-HJ-NP-Z]{6}$/);
      expect(prepared.items).toEqual([
        {
          slug: SLUG_DO_TABULEIRO,
          product_name: tabuleiro.nome,
          child_name: "Celinha",
          article: "da",
          quantity: 2,
          unit_price: tabuleiro.preco,
          amount: tabuleiro.preco * 2,
        },
        {
          slug: SLUG_DO_TABULEIRO,
          product_name: tabuleiro.nome,
          child_name: "",
          article: "",
          quantity: 1,
          unit_price: tabuleiro.preco,
          amount: tabuleiro.preco,
        },
      ]);
      expect(prepared.subtotal).toBe(tabuleiro.preco * 3);
      expect(prepared.shipping).toBe(0);
      expect(prepared.total).toBe(prepared.subtotal);
      expect(prepared.customer).toEqual({
        name: "Marina Albuquerque",
        email: "marina@example.com",
        phone: "11987654321",
        tax_id: "52998224725",
      });
      expect(prepared.shipping_address).toEqual({
        zip_code: "01310-100",
        street: "Avenida Paulista",
        number: "1000",
        complement: "",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
      });
    });

    test("ignores any price sent by the browser", () => {
      const input = validInput();
      input.items[0].unit_price = 1;
      input.items[0].amount = 1;
      input.total = 1;

      const prepared = order.prepare(input);

      expect(prepared.items[0].unit_price).toBe(tabuleiro.preco);
      expect(prepared.total).toBe(tabuleiro.preco * 3);
    });

    test("drops the article when there is no child name", () => {
      const prepared = order.prepare(
        validInput({
          items: [{ slug: SLUG_DO_TABULEIRO, quantity: 1, article: "do" }],
        }),
      );

      expect(prepared.items[0].child_name).toBe("");
      expect(prepared.items[0].article).toBe("");
    });

    test("with a product that is coming soon", () => {
      expect(() =>
        order.prepare(
          validInput({ items: [{ slug: "kit-de-carrinhos", quantity: 1 }] }),
        ),
      ).toThrow(
        new ValidationError({
          message: "Um dos produtos da sacola ainda não está à venda.",
        }),
      );
    });

    test("with an invalid CPF", () => {
      const input = validInput();
      input.customer.tax_id = "111.111.111-11";

      expect(() => order.prepare(input)).toThrow(
        new ValidationError({
          message: "Esse CPF não confere. Veja se algum número ficou trocado.",
        }),
      );
    });

    test("without customer and address", () => {
      expect(() => order.prepare({ items: validInput().items })).toThrow(
        ValidationError,
      );
    });

    test.each([
      ["no body", undefined],
      ["no items", { items: undefined }],
      ["empty items", { items: [] }],
      ["unknown product", { items: [{ slug: "tabuleiro-roxo", quantity: 1 }] }],
      [
        "too many lines",
        {
          items: Array.from({ length: 31 }, () => ({
            slug: SLUG_DO_TABULEIRO,
            quantity: 1,
          })),
        },
      ],
      ["zero quantity", { items: [{ slug: SLUG_DO_TABULEIRO, quantity: 0 }] }],
      [
        "quantity above the limit",
        { items: [{ slug: SLUG_DO_TABULEIRO, quantity: 11 }] },
      ],
      [
        "fractional quantity",
        { items: [{ slug: SLUG_DO_TABULEIRO, quantity: 1.5 }] },
      ],
      [
        "quantity as text",
        { items: [{ slug: SLUG_DO_TABULEIRO, quantity: "2" }] },
      ],
      [
        "child name with accent",
        {
          items: [
            {
              slug: SLUG_DO_TABULEIRO,
              quantity: 1,
              child_name: "João",
              article: "do",
            },
          ],
        },
      ],
      [
        "child name without article",
        {
          items: [
            { slug: SLUG_DO_TABULEIRO, quantity: 1, child_name: "Daniel" },
          ],
        },
      ],
    ])("rejects %s", (_label, overrides) => {
      const input = overrides === undefined ? undefined : validInput(overrides);

      expect(() => order.prepare(input)).toThrow(ValidationError);
    });
  });

  describe(".toPublic()", () => {
    const stored = {
      id: "6f1c2a8e-3b5d-4e7f-9a0b-1c2d3e4f5a6b",
      code: "SP-7KQ2MX",
      status: "pending",
      items: [],
      subtotal: 24900,
      shipping: 0,
      total: 24900,
      customer_name: "Marina Albuquerque",
      customer_email: "marina@example.com",
      customer_phone: "11987654321",
      customer_tax_id: "52998224725",
      shipping_address: {},
      abacatepay_checkout_id: "bill_abc123",
      payment_url: "https://app.abacatepay.com/pay/bill_abc123",
      dev_mode: true,
      paid_at: null,
      created_at: new Date("2026-10-21T12:00:00.000Z"),
      updated_at: new Date("2026-10-21T12:00:00.000Z"),
    };

    test("leaves out e-mail, phone, CPF and the checkout id", () => {
      const output = order.toPublic(stored);

      expect(output).not.toHaveProperty("customer_email");
      expect(output).not.toHaveProperty("customer_phone");
      expect(output).not.toHaveProperty("customer_tax_id");
      expect(output).not.toHaveProperty("abacatepay_checkout_id");
      expect(output.payment_url).toBe(stored.payment_url);
    });

    test("hides the payment link once the order is no longer pending", () => {
      const output = order.toPublic({ ...stored, status: "paid" });

      expect(output.payment_url).toBeNull();
    });
  });
});
