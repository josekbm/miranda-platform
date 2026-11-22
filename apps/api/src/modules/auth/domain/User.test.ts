import { describe, expect, it } from "vitest";
import { fixedNow } from "../test/factories";
import { AuthValidationError } from "./errors";
import { User } from "./User";

function makeUser(overrides: Partial<Parameters<typeof User.reconstitute>[0]> = {}) {
  return User.reconstitute({
    id: "00000000-0000-4000-8000-000000000001",
    email: "  ADMIN@MIRANDA.TEST  ",
    passwordHash: "hashed:secret",
    name: "  Miranda Admin  ",
    phone: null,
    role: "ADMIN",
    status: "ACTIVE",
    avatarUrl: null,
    createdAt: fixedNow,
    updatedAt: fixedNow,
    ...overrides,
  });
}

describe("User", () => {
  it("normalizes email and name", () => {
    const user = makeUser();

    expect(user.email).toBe("admin@miranda.test");
    expect(user.name).toBe("Miranda Admin");
  });

  it("rejects invalid users", () => {
    expect(() => makeUser({ email: "invalid" })).toThrow(AuthValidationError);
    expect(() => makeUser({ email: "  " })).toThrow(AuthValidationError);
    expect(() => makeUser({ name: "  " })).toThrow(AuthValidationError);
    expect(() => makeUser({ passwordHash: "" })).toThrow(AuthValidationError);
  });

  it("exposes a public representation without the password hash", () => {
    const publicUser = makeUser().toPublic();

    expect(publicUser).not.toHaveProperty("passwordHash");
    expect(publicUser.email).toBe("admin@miranda.test");
    expect(publicUser.role).toBe("ADMIN");
  });
});
