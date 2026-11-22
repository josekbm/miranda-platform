import { describe, expect, it } from "vitest";
import type { UserProps } from "../domain/User";
import { fixedNow, makeUser } from "../test/factories";
import {
  FakeClock,
  FakePasswordHasher,
  FakeRefreshTokenService,
  FakeTokenService,
  ImmediateUnitOfWork,
  InMemoryRefreshTokenRepository,
  InMemoryUserRepository,
  SequentialIdGenerator,
} from "../test/fakes";
import { Login } from "./Login";
import { RefreshSession } from "./RefreshSession";

function setup(userOverrides: Partial<UserProps> = {}) {
  const user = makeUser(userOverrides);
  const users = new InMemoryUserRepository([user]);
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
  const refreshSession = new RefreshSession(
    users,
    tokens,
    refreshTokens,
    refreshTokenService,
    ids,
    clock,
    new ImmediateUnitOfWork(),
  );

  return { login, refreshSession, refreshTokens, refreshTokenService, users };
}

describe("RefreshSession", () => {
  it("rotates the refresh token and revokes the previous one", async () => {
    const { login, refreshSession, refreshTokens } = setup();
    const session = await login.execute({
      email: "admin@miranda.test",
      password: "Admin1234!",
    });

    expect(session.ok).toBe(true);
    if (!session.ok) return;

    const result = await refreshSession.execute({
      refreshToken: session.value.refreshToken,
      userAgent: "vitest",
      ip: "127.0.0.1",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.refreshToken).toBe("refresh-2");
    expect(refreshTokens.records.size).toBe(2);

    const previous = await refreshTokens.findByHash("hash:refresh-1");
    const next = await refreshTokens.findByHash("hash:refresh-2");

    expect(previous?.revokedAt).toEqual(fixedNow);
    expect(next?.revokedAt).toBeNull();
  });

  it("rejects unknown refresh tokens", async () => {
    const { refreshSession } = setup();

    const result = await refreshSession.execute({ refreshToken: "unknown" });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("INVALID_REFRESH_TOKEN");
  });

  it("rejects expired refresh tokens", async () => {
    const { login } = setup();
    const session = await login.execute({
      email: "admin@miranda.test",
      password: "Admin1234!",
    });

    expect(session.ok).toBe(true);
    if (!session.ok) return;

    const clock = new FakeClock(new Date(fixedNow.getTime() + 8 * 24 * 60 * 60 * 1000));
    const refreshTokens = new InMemoryRefreshTokenRepository();
    const refreshTokenService = new FakeRefreshTokenService();
    const expiredSession = new RefreshSession(
      new InMemoryUserRepository([makeUser()]),
      new FakeTokenService(),
      refreshTokens,
      refreshTokenService,
      new SequentialIdGenerator(),
      clock,
      new ImmediateUnitOfWork(),
    );

    await refreshTokens.create({
      id: "expired",
      userId: "00000000-0000-4000-8000-000000000001",
      tokenHash: refreshTokenService.hash("expired-token"),
      expiresAt: fixedNow,
      userAgent: null,
      ip: null,
    });

    const result = await expiredSession.execute({ refreshToken: "expired-token" });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("INVALID_REFRESH_TOKEN");
  });

  it("rejects revoked refresh tokens", async () => {
    const { login, refreshSession, refreshTokens } = setup();
    const session = await login.execute({
      email: "admin@miranda.test",
      password: "Admin1234!",
    });

    expect(session.ok).toBe(true);
    if (!session.ok) return;

    const firstRefresh = await refreshSession.execute({
      refreshToken: session.value.refreshToken,
    });
    expect(firstRefresh.ok).toBe(true);

    const replay = await refreshSession.execute({
      refreshToken: session.value.refreshToken,
    });

    expect(replay.ok).toBe(false);
    if (replay.ok) return;
    expect(replay.error.code).toBe("INVALID_REFRESH_TOKEN");
    expect(refreshTokens.records.size).toBe(2);
  });

  it("rejects inactive users", async () => {
    const { login, refreshSession, users } = setup();
    const session = await login.execute({
      email: "admin@miranda.test",
      password: "Admin1234!",
    });

    expect(session.ok).toBe(true);
    if (!session.ok) return;

    const inactive = makeUser({ status: "INACTIVE" });
    users.save(inactive);

    const result = await refreshSession.execute({
      refreshToken: session.value.refreshToken,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("USER_INACTIVE");
  });
});
