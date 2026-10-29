import orchestrator from "tests/orchestrator.js";
import createViacepFake, {
  CEP_DA_CIDADE_TODA,
  CEP_DE_RUA,
} from "tests/viacepFake.js";
import webserver from "infra/webserver.js";

const viacep = createViacepFake();

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await viacep.start();
});

afterAll(async () => {
  await viacep.stop();
});

beforeEach(() => {
  viacep.reset();
});

function getAddress(zipCode) {
  return fetch(`${webserver.origin}/api/v1/zip-codes/${zipCode}`);
}

describe("GET /api/v1/zip-codes/[zip_code]", () => {
  describe("Anonymous user", () => {
    test("With the zip code of a street", async () => {
      const response = await getAddress(CEP_DE_RUA);

      expect(response.status).toBe(200);
      expect(response.headers.get("cache-control")).toBe(
        "public, max-age=0, s-maxage=604800",
      );
      expect(await response.json()).toEqual({
        zip_code: "01310-100",
        street: "Avenida Paulista",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
      });
    });

    test("With the zip code written with a hyphen", async () => {
      const response = await getAddress("01310-100");

      expect(response.status).toBe(200);
      expect((await response.json()).street).toBe("Avenida Paulista");
      expect(viacep.requests()).toEqual(["/01310100/json/"]);
    });

    test("With the zip code of a whole city", async () => {
      const response = await getAddress(CEP_DA_CIDADE_TODA);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
        zip_code: "69945-000",
        street: "",
        neighborhood: "",
        city: "Acrelândia",
        state: "AC",
      });
    });

    test("With a zip code that does not exist", async () => {
      const response = await getAddress("99999999");

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({
        name: "NotFoundError",
        message: "Não achamos esse CEP.",
        action: "Confira os números ou escreva o endereço à mão.",
        status_code: 404,
      });
    });

    test.each(["0131010", "013101000", "0131O100", "01.310-100"])(
      "With a malformed zip code: %s",
      async (zipCode) => {
        const response = await getAddress(zipCode);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({
          name: "ValidationError",
          message: "O CEP tem 8 números.",
          action: "Envie o CEP só com os números, ou no formato 00000-000.",
          status_code: 400,
        });
        expect(viacep.requests()).toHaveLength(0);
      },
    );

    test("When ViaCEP fails", async () => {
      viacep.fail();

      const response = await getAddress(CEP_DE_RUA);

      // Erro não fica no cache: o próximo pedido pergunta de novo.
      expect(response.status).toBe(500);
      expect(response.headers.get("cache-control") ?? "").not.toContain(
        "s-maxage",
      );
    });
  });
});
