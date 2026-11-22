import { describe, expect, it } from "vitest";
import { makeUser } from "../test/factories";
import { InMemoryUserRepository } from "../test/fakes";
import { GetCurrentUser } from "./GetCurrentUser";

describe("GetCurrentUser", () => {
  it("returns the public user for an active user", async () => {
    const user = makeUser();
    const useCase = new GetCurrentUser(new InMemoryUserRepository([user]));

    const result = await useCase.execute(user.id);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.email).toBe("admin@miranda.test");
    expect(result.value).not.toHaveProperty("passwordHash");
  });

  it("returns UNAUTHORIZED for an unknown user", async () => {
    const useCase = new GetCurrentUser(new InMemoryUserRepository());

    const result = await useCase.execute("missing");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("UNAUTHORIZED");
  });

  it("returns UNAUTHORIZED for an inactive user", async () => {
    const user = makeUser({ status: "INACTIVE" });
    const useCase = new GetCurrentUser(new InMemoryUserRepository([user]));

    const result = await useCase.execute(user.id);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("UNAUTHORIZED");
  });
});
