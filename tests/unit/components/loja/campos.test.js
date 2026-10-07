import {
  DADOS_VAZIOS,
  conferirDados,
  cpfValido,
  formatarCelular,
  formatarCep,
  formatarCpf,
} from "components/loja/campos.js";

const DADOS_CERTOS = {
  nome: "Marina Albuquerque",
  email: "marina@example.com",
  celular: "(11) 98765-4321",
  cpf: "529.982.247-25",
  cep: "01310-100",
  rua: "Avenida Paulista",
  numero: "1000",
  complemento: "",
  bairro: "Bela Vista",
  cidade: "São Paulo",
  estado: "SP",
};

describe("components/loja/campos.js", () => {
  describe(".formatarCpf()", () => {
    test.each([
      ["", ""],
      ["529", "529"],
      ["5299", "529.9"],
      ["5299822", "529.982.2"],
      ["5299822472", "529.982.247-2"],
      ["52998224725", "529.982.247-25"],
      ["529.982.247-25", "529.982.247-25"],
      ["529982247259999", "529.982.247-25"],
      ["52a9", "529"],
    ])("with %j", (digitado, esperado) => {
      expect(formatarCpf(digitado)).toBe(esperado);
    });
  });

  describe(".formatarCep()", () => {
    test.each([
      ["", ""],
      ["01310", "01310"],
      ["013101", "01310-1"],
      ["01310100", "01310-100"],
      ["01310-1009", "01310-100"],
    ])("with %j", (digitado, esperado) => {
      expect(formatarCep(digitado)).toBe(esperado);
    });
  });

  describe(".formatarCelular()", () => {
    test.each([
      ["", ""],
      ["1", "(1"],
      ["11", "(11"],
      ["119", "(11) 9"],
      ["119876", "(11) 9876"],
      ["1198765432", "(11) 9876-5432"],
      ["11987654321", "(11) 98765-4321"],
      ["(11) 98765-43219", "(11) 98765-4321"],
    ])("with %j", (digitado, esperado) => {
      expect(formatarCelular(digitado)).toBe(esperado);
    });
  });

  describe(".cpfValido()", () => {
    test.each(["529.982.247-25", "52998224725", "111.444.777-35"])(
      "with a valid CPF: %s",
      (cpf) => {
        expect(cpfValido(cpf)).toBe(true);
      },
    );

    test.each([
      "",
      "529.982.247-2",
      "529.982.247-26",
      "529.982.247-15",
      "111.111.111-11",
      "000.000.000-00",
    ])("with an invalid CPF: %j", (cpf) => {
      expect(cpfValido(cpf)).toBe(false);
    });
  });

  describe(".conferirDados()", () => {
    test("with everything right", () => {
      expect(conferirDados(DADOS_CERTOS)).toEqual({});
    });

    test("with everything empty, in the order of the screen", () => {
      expect(Object.keys(conferirDados(DADOS_VAZIOS))).toEqual([
        "nome",
        "email",
        "celular",
        "cpf",
        "cep",
        "rua",
        "numero",
        "bairro",
        "cidade",
        "estado",
      ]);
    });

    test.each([
      ["nome", "Marina"],
      ["email", "marina@example"],
      ["celular", "(11) 9876"],
      ["cpf", "529.982.247-26"],
      ["cep", "01310"],
      ["rua", "   "],
      ["estado", "XX"],
    ])("with a wrong %s", (campo, valor) => {
      const erros = conferirDados({ ...DADOS_CERTOS, [campo]: valor });

      expect(Object.keys(erros)).toEqual([campo]);
    });
  });
});
