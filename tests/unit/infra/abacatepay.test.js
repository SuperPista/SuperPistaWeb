import crypto from "node:crypto";
import abacatepay from "infra/abacatepay.js";

// A chave pública da documentação da AbacatePay, a mesma de infra/abacatepay.js.
const SIGNATURE_KEY =
  "t9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9";

function sign(rawBody) {
  return crypto
    .createHmac("sha256", SIGNATURE_KEY)
    .update(rawBody, "utf8")
    .digest("base64");
}

const originalSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;

// Atribuir undefined a process.env grava o texto "undefined".
afterEach(() => {
  if (originalSecret === undefined) {
    delete process.env.ABACATEPAY_WEBHOOK_SECRET;
  } else {
    process.env.ABACATEPAY_WEBHOOK_SECRET = originalSecret;
  }
});

describe("infra/abacatepay.js", () => {
  describe(".isWebhookSecretValid()", () => {
    test("with the configured secret", () => {
      process.env.ABACATEPAY_WEBHOOK_SECRET = "segredo-do-webhook";

      expect(abacatepay.isWebhookSecretValid("segredo-do-webhook")).toBe(true);
    });

    test.each([
      ["a different secret", "outro-segredo"],
      ["a prefix of the secret", "segredo"],
      ["no secret", undefined],
      ["a repeated query parameter", ["segredo-do-webhook"]],
    ])("rejects %s", (_label, secret) => {
      process.env.ABACATEPAY_WEBHOOK_SECRET = "segredo-do-webhook";

      expect(abacatepay.isWebhookSecretValid(secret)).toBe(false);
    });

    test("rejects everything when no secret is configured", () => {
      delete process.env.ABACATEPAY_WEBHOOK_SECRET;

      expect(abacatepay.isWebhookSecretValid("")).toBe(false);
      expect(abacatepay.isWebhookSecretValid("qualquer")).toBe(false);
    });
  });

  describe(".isWebhookSignatureValid()", () => {
    const rawBody = JSON.stringify({
      id: "log_abc123",
      event: "checkout.completed",
      data: { checkout: { id: "bill_abc123", status: "PAID" } },
    });

    test("with the signature of the body", () => {
      expect(abacatepay.isWebhookSignatureValid(rawBody, sign(rawBody))).toBe(
        true,
      );
    });

    test("rejects a body changed after signing", () => {
      const changed = rawBody.replace("PAID", "PENDING");

      expect(abacatepay.isWebhookSignatureValid(changed, sign(rawBody))).toBe(
        false,
      );
    });

    test("rejects a missing signature", () => {
      expect(abacatepay.isWebhookSignatureValid(rawBody, undefined)).toBe(
        false,
      );
    });
  });
});
