import { describe, expect, it } from "vitest";
import { buildApp } from "../../../../app";
import { err, ok } from "../../../../lib/result";
import { createFakeContainer } from "../../../../test/container";
import type { AuthContainer } from "../../container";
import { InvalidCredentialsError } from "../../domain/errors";
import type { AuthSession } from "../../domain/ports";
import { makeUser } from "../../test/factories";

const session: AuthSession = {
  accessToken: "access-token",
  refreshToken: "refresh-token",
  accessTokenExpiresIn: 900,
  refreshTokenExpiresAt: new Date("2026-11-28T10:00:00.000Z"),
  user: makeUser().toPublic(),
};

function makeApp(auth: Partial<AuthContainer> = {}) {
  return buildApp({
    logger: false,
    container: createFakeContainer({ auth }),
  });
}

describe("auth routes", () => {
  it("logs in, sets the refresh cookie and hides the refresh token", async () => {
    const app = makeApp({
      login: {
        async execute() {
          return ok(session);
        },
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: { email: "admin@miranda.test", password: "Admin1234!" },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      data: {
        accessToken: "access-token",
        accessTokenExpiresIn: 900,
        refreshTokenExpiresAt: "2026-11-28T10:00:00.000Z",
        user: session.user,
      },
    });

    const cookie = String(response.headers["set-cookie"]);
    expect(cookie).toContain("miranda_refresh=refresh-token");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Path=/api/v1/auth");

    await app.close();
  });

  it("maps invalid credentials to 401", async () => {
    const app = makeApp({
      login: {
        async execute() {
          return err(new InvalidCredentialsError());
        },
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: { email: "admin@miranda.test", password: "wrong-password" },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toEqual({
      error: { code: "INVALID_CREDENTIALS", message: "Email or password is incorrect." },
    });

    await app.close();
  });

  it("returns the current user with a valid bearer token", async () => {
    const app = makeApp({
      getCurrentUser: {
        async execute() {
          return ok(session.user);
        },
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/auth/me",
      headers: { authorization: "Bearer valid" },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ data: { user: session.user } });

    await app.close();
  });

  it("rejects /me without a bearer token", async () => {
    const app = makeApp();

    const response = await app.inject({ method: "GET", url: "/api/v1/auth/me" });

    expect(response.statusCode).toBe(401);
    expect(response.json().error.code).toBe("UNAUTHORIZED");

    await app.close();
  });

  it("rotates the refresh cookie on refresh", async () => {
    const app = makeApp({
      refreshSession: {
        async execute() {
          return ok({ ...session, refreshToken: "rotated-refresh-token" });
        },
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/auth/refresh",
      headers: { cookie: "miranda_refresh=old-token" },
    });

    expect(response.statusCode).toBe(200);
    expect(String(response.headers["set-cookie"])).toContain(
      "miranda_refresh=rotated-refresh-token",
    );

    await app.close();
  });

  it("rejects refresh without a cookie", async () => {
    const app = makeApp();

    const response = await app.inject({ method: "POST", url: "/api/v1/auth/refresh" });

    expect(response.statusCode).toBe(401);
    expect(response.json().error.code).toBe("UNAUTHORIZED");

    await app.close();
  });

  it("logs out and clears the refresh cookie", async () => {
    let loggedOut = false;
    const app = makeApp({
      logout: {
        async execute() {
          loggedOut = true;
        },
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/auth/logout",
      headers: { cookie: "miranda_refresh=refresh-token" },
    });

    expect(response.statusCode).toBe(204);
    expect(loggedOut).toBe(true);
    expect(String(response.headers["set-cookie"])).toContain("miranda_refresh=");

    await app.close();
  });
});
