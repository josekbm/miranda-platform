import { describe, expect, it } from "vitest";
import type { UserProps } from "../domain/User";
import { fixedNow, makeUser } from "../test/factories";
import {
  FakeClock,
  FakePasswordHasher,
  FakeRefreshTokenService,
  FakeTokenService,
  InMemoryRefreshTokenRepository,
  InMemoryUserRepository,
  SequentialIdGenerator,
} from "../test/fakes";
import { Login } from "./Login";

function setup(userOverrides: Partial<UserProps> = {}) {
  const user = makeUser(userOverrides);
  const users = new InMemoryUserRepository([user]);
  const passwordHasher = new FakePasswordHasher();
  const tokens = new FakeTokenService();
  const refreshTokens = new InMemoryRefreshTokenRepository();
  const refreshTokenService = new FakeRefreshTokenService();
  const ids = new SequentialIdGenerator();
  const clock = new FakeClock(fixedNow);
  const useCase = new Login(
    users,
    passwordHasher,
    tokens,
    refreshTokens,
    refreshTokenService,
    ids,
    clock,
  );

  return { useCase, users, refreshTokens, refreshTokenService };
}

describe("Login", () => {
  it("returns an auth session for valid credentials", async () => {
    const { useCase, refreshTokens } = setup();

    const result = await useCase.execute({
      email: "  ADMIN@MIRANDA.TEST ",
      password: "Admin1234!",
      userAgent: "vitest",
      ip: "127.0.0.1",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.accessToken).toBe("access:00000000-0000-4000-8000-000000000001:ADMIN");
    expect(result.value.refreshToken).toBe("refresh-1");
    expect(result.value.user.email).toBe("admin@miranda.test");
    expect(result.value.accessTokenExpiresIn).toBe(900);
    expect(refreshTokens.records.size).toBe(1);

    const stored = await refreshTokens.findByHash("hash:refresh-1");
    expect(stored?.userAgent).toBe("vitest");
    expect(stored?.ip).toBe("127.0.0.1");
  });

  it("rejects an unknown email without leaking whether it exists", async () => {
    const { useCase } = setup();

    const result = await useCase.execute({
      email: "nobody@miranda.test",
      password: "Admin1234!",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("rejects a wrong password", async () => {
    const { useCase } = setup();

    const result = await useCase.execute({
      email: "admin@miranda.test",
      password: "wrong-password",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("rejects inactive users", async () => {
    const { useCase } = setup({ status: "INACTIVE" });

    const result = await useCase.execute({
      email: "admin@miranda.test",
      password: "Admin1234!",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("USER_INACTIVE");
  });
});
