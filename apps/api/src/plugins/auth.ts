import type { FastifyReply, FastifyRequest } from "fastify";
import type { AccessTokenPayload, TokenService } from "../modules/auth/domain/ports";
import type { Role } from "../modules/auth/domain/roles";

declare module "fastify" {
  interface FastifyRequest {
    auth?: AccessTokenPayload;
  }
}

export function createAuthenticate(tokens: TokenService) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const header = request.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return reply.code(401).send({
        error: { code: "UNAUTHORIZED", message: "Missing bearer token." },
      });
    }

    try {
      request.auth = await tokens.verifyAccessToken(header.slice(7).trim());
    } catch {
      return reply.code(401).send({
        error: { code: "UNAUTHORIZED", message: "Invalid or expired token." },
      });
    }
  };
}

export function createAuthorize(roles: readonly Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.auth || !roles.includes(request.auth.role)) {
      return reply.code(403).send({
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission for this action.",
        },
      });
    }
  };
}
