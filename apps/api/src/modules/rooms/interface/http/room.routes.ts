import {
  errorResponseSchema,
  paginatedRoomsSchema,
  roomListQuerySchema,
  roomLocaleQuerySchema,
  roomResponseSchema,
} from "@miranda/contract";
import type { FastifyInstance, FastifyReply } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { createAuthenticate, createAuthorize } from "../../../../plugins/auth";
import type { AuthContainer } from "../../../auth/container";
import type { RoomsContainer } from "../../container";
import type { RoomError } from "../../domain/errors";
import { toRoomDto } from "./room.presenter";

const roomIdParamsSchema = z.object({
  id: z.string().uuid(),
});

const roomSlugParamsSchema = z.object({
  slug: z.string().min(1),
});

function sendRoomError(reply: FastifyReply, error: RoomError) {
  const status = error.code === "ROOM_NOT_FOUND" ? 404 : 422;

  return reply.code(status).send({
    error: { code: error.code, message: error.message },
  });
}

export function registerRoomRoutes(
  app: FastifyInstance,
  container: RoomsContainer,
  auth: AuthContainer,
): void {
  const server = app.withTypeProvider<ZodTypeProvider>();
  const authenticate = createAuthenticate(auth.tokens);
  const authorize = createAuthorize(["ADMIN", "MANAGER", "RECEPTIONIST"]);

  server.get(
    "/api/v1/public/rooms",
    {
      schema: {
        querystring: roomListQuerySchema,
        response: {
          200: paginatedRoomsSchema,
        },
      },
    },
    async (request) => {
      const { locale, ...query } = request.query;
      const page = await container.listRooms.execute({ ...query, active: true });

      return {
        data: page.data.map((room) => toRoomDto(room, locale)),
        meta: page.meta,
      };
    },
  );

  server.get(
    "/api/v1/public/rooms/:slug",
    {
      schema: {
        params: roomSlugParamsSchema,
        querystring: roomLocaleQuerySchema,
        response: {
          200: roomResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await container.getRoomBySlug.execute(request.params.slug);

      if (!result.ok) {
        return sendRoomError(reply, result.error);
      }

      return { data: toRoomDto(result.value, request.query.locale) };
    },
  );

  server.get(
    "/api/v1/admin/rooms",
    {
      preHandler: [authenticate, authorize],
      schema: {
        querystring: roomListQuerySchema,
        response: {
          200: paginatedRoomsSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    async (request) => {
      const { locale, ...query } = request.query;
      const page = await container.listRooms.execute(query);

      return {
        data: page.data.map((room) => toRoomDto(room, locale)),
        meta: page.meta,
      };
    },
  );

  server.get(
    "/api/v1/admin/rooms/:id",
    {
      preHandler: [authenticate, authorize],
      schema: {
        params: roomIdParamsSchema,
        querystring: roomLocaleQuerySchema,
        response: {
          200: roomResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await container.getRoomById.execute(request.params.id);

      if (!result.ok) {
        return sendRoomError(reply, result.error);
      }

      return { data: toRoomDto(result.value, request.query.locale) };
    },
  );
}
