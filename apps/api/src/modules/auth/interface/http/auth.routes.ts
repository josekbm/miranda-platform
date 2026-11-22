import {
  authResponseSchema,
  errorResponseSchema,
  loginInputSchema,
  meResponseSchema,
} from "@miranda/contract";
import type { FastifyInstance, FastifyReply } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { env } from "../../../../env";
import { createAuthenticate } from "../../../../plugins/auth";
import type { AuthContainer } from "../../container";
import type { AuthError } from "../../domain/errors";
import { toAuthResponse } from "./auth.presenter";

const REFRESH_COOKIE = "miranda_refresh";
const COOKIE_PATH = "/api/v1/auth";

function setRefreshCookie(reply: FastifyReply, token: string, expiresAt: Date): void {
  reply.setCookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: COOKIE_PATH,
    expires: expiresAt,
  });
}

function clearRefreshCookie(reply: FastifyReply): void {
  reply.clearCookie(REFRESH_COOKIE, { path: COOKIE_PATH });
}

function sendAuthError(reply: FastifyReply, error: AuthError) {
  const status =
    error.code === "INVALID_CREDENTIALS" ||
    error.code === "INVALID_REFRESH_TOKEN" ||
    error.code === "UNAUTHORIZED"
      ? 401
      : error.code === "USER_INACTIVE"
        ? 403
        : 422;

  return reply.code(status).send({
    error: { code: error.code, message: error.message },
  });
}

export function registerAuthRoutes(app: FastifyInstance, container: AuthContainer): void {
  const server = app.withTypeProvider<ZodTypeProvider>();
  const authenticate = createAuthenticate(container.tokens);

  server.post(
    "/api/v1/auth/login",
    {
      config: {
        rateLimit: { max: 5, timeWindow: "1 minute" },
      },
      schema: {
        body: loginInputSchema,
        response: {
          200: authResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          422: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const userAgent = request.headers["user-agent"];
      const result = await container.login.execute({
        email: request.body.email,
        password: request.body.password,
        ip: request.ip,
        ...(userAgent ? { userAgent } : {}),
      });

      if (!result.ok) {
        return sendAuthError(reply, result.error);
      }

      setRefreshCookie(reply, result.value.refreshToken, result.value.refreshTokenExpiresAt);
      return { data: toAuthResponse(result.value) };
    },
  );

  server.post(
    "/api/v1/auth/refresh",
    {
      schema: {
        response: {
          200: authResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const refreshToken = request.cookies[REFRESH_COOKIE];

      if (!refreshToken) {
        return reply.code(401).send({
          error: { code: "UNAUTHORIZED", message: "Missing refresh token." },
        });
      }

      const userAgent = request.headers["user-agent"];
      const result = await container.refreshSession.execute({
        refreshToken,
        ip: request.ip,
        ...(userAgent ? { userAgent } : {}),
      });

      if (!result.ok) {
        clearRefreshCookie(reply);
        return sendAuthError(reply, result.error);
      }

      setRefreshCookie(reply, result.value.refreshToken, result.value.refreshTokenExpiresAt);
      return { data: toAuthResponse(result.value) };
    },
  );

  server.post("/api/v1/auth/logout", async (request, reply) => {
    const refreshToken = request.cookies[REFRESH_COOKIE];

    if (refreshToken) {
      await container.logout.execute({ refreshToken });
    }

    clearRefreshCookie(reply);
    return reply.code(204).send();
  });

  server.get(
    "/api/v1/auth/me",
    {
      preHandler: authenticate,
      schema: {
        response: {
          200: meResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      if (!request.auth) {
        return reply.code(401).send({
          error: { code: "UNAUTHORIZED", message: "Authentication is required." },
        });
      }

      const result = await container.getCurrentUser.execute(request.auth.sub);

      if (!result.ok) {
        return sendAuthError(reply, result.error);
      }

      return { data: { user: result.value } };
    },
  );
}
