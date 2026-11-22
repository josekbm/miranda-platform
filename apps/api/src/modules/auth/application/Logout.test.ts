import { describe, expect, it } from "vitest";
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
import { Logout } from "./Logout";

function setup() {
  const users = new InMemoryUserRepository([makeUser()]);
  const passwordHasher = new FakePasswordHasher();
  const tokens = new FakeTokenService();
  const refreshTokens = new InMemoryRefreshTokenRepository();
  const refreshTokenService = new FakeRefreshTokenService();
  const ids = new SequentialIdGenerator();
  const clock = new FakeClock(fixedNow);
  const login = new Login(
    users,
    passwordHasher,
    tokens,
    refreshTokens,
    refreshTokenService,
    ids,
    clock,
  );
  const logout = new Logout(refreshTokens, refreshTokenService, clock);

  return { login, logout, refreshTokens };
}

describe("Logout", () => {
  it("revokes the current refresh token", async () => {
    const { login, logout, refreshTokens } = setup();
    const session = await login.execute({
      email: "admin@miranda.test",
      password: "Admin1234!",
    });

    expect(session.ok).toBe(true);
    if (!session.ok) return;

    await logout.execute({ refreshToken: session.value.refreshToken });

    const stored = await refreshTokens.findByHash("hash:refresh-1");
    expect(stored?.revokedAt).toEqual(fixedNow);
  });

  it("is idempotent for unknown or already revoked tokens", async () => {
    const { logout } = setup();

    await expect(logout.execute({ refreshToken: "unknown" })).resolves.toBeUndefined();
  });
});
