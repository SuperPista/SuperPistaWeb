import activationCode from "models/activationCode.js";
import { ValidationError } from "infra/errors.js";

describe("models/activationCode", () => {
  test("Exporta configurações esperadas para os tabuleiros", () => {
    expect(activationCode.MAX_DEVICES_PER_CODE).toBe(2);

    expect(activationCode.BOARD_CONFIG["tabuleiro-vermelho"]).toEqual({
      board: "vermelho",
    });
    expect(activationCode.BOARD_CONFIG["tabuleiro-amarelo"]).toEqual({
      board: "amarelo",
    });
    expect(activationCode.BOARD_CONFIG["tabuleiro-verde"]).toEqual({
      board: "verde",
    });
    expect(activationCode.BOARD_CONFIG["tabuleiro-azul"]).toEqual({
      board: "azul",
    });
  });

  test("Valida campos obrigatórios ao tentar ativar", async () => {
    await expect(
      activationCode.activate({ code: "", deviceId: "device-123" }),
    ).rejects.toBeInstanceOf(ValidationError);

    await expect(
      activationCode.activate({ code: "7K9X-M2P4", deviceId: "" }),
    ).rejects.toBeInstanceOf(ValidationError);

    await expect(
      activationCode.activate({ code: null, deviceId: null }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  test("Retorna array vazio quando deviceId for vazio em findActiveBoardsByDevice", async () => {
    const boards = await activationCode.findActiveBoardsByDevice("");
    expect(boards).toEqual([]);
  });

  test("Retorna array vazio quando email for vazio em findAllByCustomerEmail", async () => {
    const activations = await activationCode.findAllByCustomerEmail("");
    expect(activations).toEqual([]);
  });
});
