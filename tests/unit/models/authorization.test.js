import authorization from "models/authorization.js";
import { InternalServerError } from "infra/errors.js";

describe("models/authorization.js", () => {
  describe(".can()", () => {
    test("without `user`", () => {
      expect(() => {
        authorization.can();
      }).toThrow(InternalServerError);
    });

    test("without `user.features`", () => {
      const createdUser = {
        username: "UserWithoutFeatures",
      };

      expect(() => {
        authorization.can(createdUser);
      }).toThrow(InternalServerError);
    });

    test("with unknown `feature`", () => {
      const createdUser = {
        features: [],
      };

      expect(() => {
        authorization.can(createdUser, "unknown:feature");
      }).toThrow(InternalServerError);
    });

    test("with valid `user` and known `feature`", () => {
      const createdUser = {
        features: ["create:user"],
      };

      expect(authorization.can(createdUser, "create:user")).toBe(true);
    });
  });

  describe(".filterOutput()", () => {
    test("without `user`", () => {
      expect(() => {
        authorization.filterOutput();
      }).toThrow(InternalServerError);
    });

    test("without `user.features`", () => {
      const createdUser = {
        username: "UserWithoutFeatures",
      };

      expect(() => {
        authorization.filterOutput(createdUser);
      }).toThrow(InternalServerError);
    });

    test("with unknown `feature`", () => {
      const createdUser = {
        features: [],
      };

      expect(() => {
        authorization.filterOutput(createdUser, "unknown:feature");
      }).toThrow(InternalServerError);
    });

    test("with valid `user`, known `feature` but no `resource`", () => {
      const createdUser = {
        features: ["read:user"],
      };

      expect(() => {
        authorization.filterOutput(createdUser, "read:user");
      }).toThrow(InternalServerError);
    });

    test("with valid `user`, known `feature` and `resource`", () => {
      const createdUser = {
        features: ["read:user"],
      };

      const resource = {
        id: 1,
        username: "resource",
        features: ["read:user"],
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
        email: "resource@resource.com",
        password: "resource",
      };

      const result = authorization.filterOutput(
        createdUser,
        "read:user",
        resource,
      );

      expect(result).toEqual({
        id: 1,
        username: "resource",
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      });
    });

    // `features` é o mapa de privilégios da conta, e esta é a visão de um
    // usuário sobre outro. Exposta, dizia a qualquer um qual username pode
    // mexer em outras contas.
    test("`read:user` never exposes features, email or password", () => {
      const result = authorization.filterOutput(
        { features: ["read:user"] },
        "read:user",
        {
          id: 1,
          username: "resource",
          features: ["update:user:others", "delete:user:others"],
          email: "resource@resource.com",
          password: "$2a$hash",
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: "2026-01-01T00:00:00.000Z",
        },
      );

      expect(result).not.toHaveProperty("features");
      expect(result).not.toHaveProperty("email");
      expect(result).not.toHaveProperty("password");
    });
  });

  describe(".can() with `delete:user`", () => {
    const owner = { id: "owner", features: ["delete:user"] };

    test("allows deleting the own account", () => {
      expect(authorization.can(owner, "delete:user", { id: "owner" })).toBe(
        true,
      );
    });

    test("forbids deleting another account", () => {
      expect(authorization.can(owner, "delete:user", { id: "other" })).toBe(
        false,
      );
    });

    test("allows deleting another account with `delete:user:others`", () => {
      const privileged = {
        id: "privileged",
        features: ["delete:user", "delete:user:others"],
      };

      expect(
        authorization.can(privileged, "delete:user", { id: "other" }),
      ).toBe(true);
    });
  });
});
