import activationCode from "models/activationCode.js";
import database from "infra/database.js";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "infra/errors.js";

jest.mock("infra/database.js", () => ({
  query: jest.fn(),
  transaction: jest.fn(),
}));

const query = jest.fn();
const result = (rows) => ({ rows, rowCount: rows.length });
const items = (...boards) =>
  boards.map((board) => ({ slug: `tabuleiro-${board}`, quantity: 1 }));
const code = {
  id: "code-id",
  code: "7K9X-M2P4",
  order_id: "order-id",
  board: "vermelho",
  boards: ["vermelho", "amarelo"],
  order_status: "paid",
};

beforeEach(() => {
  jest.resetAllMocks();
  database.transaction.mockImplementation((work) => work({ query }));
});

describe("direitos dos tabuleiros comprados", () => {
  test.each([
    [items("vermelho"), ["vermelho"]],
    [items("amarelo"), ["amarelo"]],
    [items("vermelho", "amarelo"), ["vermelho", "amarelo"]],
    [
      items("vermelho", "amarelo", "verde", "azul"),
      ["vermelho", "amarelo", "verde", "azul"],
    ],
    [
      [{ slug: "tabuleiro-vermelho", quantity: 4 }, ...items("vermelho")],
      ["vermelho"],
    ],
    [
      [...items("amarelo"), { slug: "kit-de-carrinhos", quantity: 3 }],
      ["amarelo"],
    ],
    [
      [
        null,
        { slug: "tabuleiro-vermelho", quantity: 0 },
        { slug: "__proto__", quantity: 1 },
      ],
      [],
    ],
    [null, []],
  ])("extrai somente as cores compradas de %j", (lines, expected) => {
    expect(activationCode.boardsForItems(lines)).toEqual(expected);
  });

  test.each([
    [items("vermelho"), ["vermelho"]],
    [items("vermelho", "amarelo"), ["vermelho", "amarelo"]],
    [[{ slug: "tabuleiro-amarelo", quantity: 5 }], ["amarelo"]],
  ])("gera um único código por pedido para %j", async (lines, boards) => {
    query
      .mockResolvedValueOnce(result([{ id: "order-id" }]))
      .mockResolvedValueOnce(result([]))
      .mockResolvedValueOnce(result([{ ...code, board: boards[0], boards }]));
    const created = await activationCode.createForOrder("order-id", lines);
    expect(created).toHaveLength(1);
    expect(created[0].boards).toEqual(boards);
    const inserts = query.mock.calls.filter(([sql]) =>
      sql.text.includes("INSERT INTO"),
    );
    expect(inserts).toHaveLength(1);
    expect(inserts[0][0].values.slice(2)).toEqual([
      boards[0],
      boards,
      "order-id",
    ]);
    expect(inserts[0][0].values[1]).toMatch(
      /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/,
    );
  });

  test("pedidos sem tabuleiro não recebem código", async () => {
    expect(
      await activationCode.createForOrder("order-id", [
        { slug: "kit-de-carrinhos", quantity: 2 },
      ]),
    ).toEqual([]);
    expect(database.transaction).not.toHaveBeenCalled();
  });

  test("repetir a geração reutiliza o código sem ampliar os direitos", async () => {
    query
      .mockResolvedValueOnce(result([{ id: "order-id" }]))
      .mockResolvedValueOnce(result([code]));
    expect(
      await activationCode.createForOrder("order-id", items("azul")),
    ).toEqual([code]);
    expect(query).toHaveBeenCalledTimes(2);
  });

  test("não cria código sem pedido", async () => {
    query.mockResolvedValueOnce(result([]));
    await expect(
      activationCode.createForOrder("missing", items("vermelho")),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  test("tenta outro código se houver colisão aleatória", async () => {
    query
      .mockResolvedValueOnce(result([{ id: "order-id" }]))
      .mockResolvedValueOnce(result([]))
      .mockResolvedValueOnce(result([]))
      .mockResolvedValueOnce(result([code]));
    expect(
      await activationCode.createForOrder(
        "order-id",
        items("vermelho", "amarelo"),
      ),
    ).toEqual([code]);
    expect(query).toHaveBeenCalledTimes(4);
  });
});

describe("ativação de um código com vários tabuleiros", () => {
  test("devolve todas as cores compradas e mantém board para apps antigos", async () => {
    query
      .mockResolvedValueOnce(result([code]))
      .mockResolvedValueOnce(result([]))
      .mockResolvedValueOnce(result([]));
    expect(
      await activationCode.activate({
        code: " 7k9xm2p4 ",
        deviceId: " device-1 ",
      }),
    ).toEqual({
      success: true,
      board: "vermelho",
      boards: ["vermelho", "amarelo"],
      code: code.code,
      alreadyActive: false,
      devicesCount: 1,
      maxDevices: 2,
    });
    expect(query.mock.calls[0][0].values).toEqual([code.code]);
    expect(query.mock.calls[2][0].values.slice(1)).toEqual([
      code.id,
      "device-1",
      null,
    ]);
  });

  test("reativar no mesmo aparelho devolve todas as cores sem gastar outra vaga", async () => {
    query
      .mockResolvedValueOnce(result([code]))
      .mockResolvedValueOnce(result([{ device_id: "a" }, { device_id: "b" }]));
    expect(
      await activationCode.activate({ code: code.code, deviceId: "a" }),
    ).toMatchObject({
      boards: code.boards,
      alreadyActive: true,
      devicesCount: 2,
    });
    expect(query).toHaveBeenCalledTimes(2);
  });

  test("bloqueia o terceiro aparelho para o código inteiro", async () => {
    query
      .mockResolvedValueOnce(result([code]))
      .mockResolvedValueOnce(result([{ device_id: "a" }, { device_id: "b" }]));
    await expect(
      activationCode.activate({ code: code.code, deviceId: "c" }),
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(query).toHaveBeenCalledTimes(2);
  });

  test.each(["pending", "expired", "cancelled", "refunded"])(
    "não ativa pedido %s",
    async (status) => {
      query.mockResolvedValueOnce(result([{ ...code, order_status: status }]));
      await expect(
        activationCode.activate({ code: code.code, deviceId: "a" }),
      ).rejects.toBeInstanceOf(ForbiddenError);
      expect(query).toHaveBeenCalledTimes(1);
    },
  );

  test("mantém códigos avulsos sem pedido", async () => {
    query
      .mockResolvedValueOnce(
        result([{ ...code, order_id: null, order_status: null }]),
      )
      .mockResolvedValueOnce(result([]))
      .mockResolvedValueOnce(result([]));
    expect(
      await activationCode.activate({ code: code.code, deviceId: "a" }),
    ).toMatchObject({ success: true, boards: code.boards });
  });

  test("recusa código inexistente", async () => {
    query.mockResolvedValueOnce(result([]));
    await expect(
      activationCode.activate({ code: code.code, deviceId: "a" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  test.each([
    ["", "a"],
    [code.code, ""],
    [null, null],
  ])("valida código e aparelho", async (input, deviceId) => {
    await expect(
      activationCode.activate({ code: input, deviceId }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(database.transaction).not.toHaveBeenCalled();
  });

  test("consultas sem aparelho ou email retornam lista vazia", async () => {
    expect(await activationCode.findActiveBoardsByDevice("")).toEqual([]);
    expect(await activationCode.findAllByCustomerEmail("")).toEqual([]);
    expect(database.query).not.toHaveBeenCalled();
  });
});
