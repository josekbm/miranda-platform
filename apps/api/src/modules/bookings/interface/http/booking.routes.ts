import {
  bookingListQuerySchema,
  bookingResponseSchema,
  createBookingInputSchema,
  errorResponseSchema,
  paginatedBookingsSchema,
  updateBookingStatusInputSchema,
} from "@miranda/contract";
import type { FastifyInstance, FastifyReply } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { createAuthenticate, createAuthorize } from "../../../../plugins/auth";
import type { AuthContainer } from "../../../auth/container";
import type { BookingsContainer } from "../../container";
import type { BookingError } from "../../domain/errors";
import { toBookingDto } from "./booking.presenter";

const bookingIdParamsSchema = z.object({
  id: z.string().uuid(),
});

function sendBookingError(reply: FastifyReply, error: BookingError) {
  const status =
    error.code === "ROOM_NOT_FOUND" || error.code === "BOOKING_NOT_FOUND"
      ? 404
      : error.code === "ROOM_NOT_AVAILABLE" || error.code === "INVALID_STATUS_TRANSITION"
        ? 409
        : 422;

  return reply.code(status).send({
    error: { code: error.code, message: error.message },
  });
}

export function registerBookingRoutes(
  app: FastifyInstance,
  container: BookingsContainer,
  auth: AuthContainer,
): void {
  const server = app.withTypeProvider<ZodTypeProvider>();
  const authenticate = createAuthenticate(auth.tokens);
  const authorize = createAuthorize(["ADMIN", "MANAGER", "RECEPTIONIST"]);

  server.post(
    "/api/v1/public/bookings",
    {
      config: {
        rateLimit: { max: 10, timeWindow: "1 minute" },
      },
      schema: {
        body: createBookingInputSchema,
        response: {
          201: bookingResponseSchema,
          404: errorResponseSchema,
          409: errorResponseSchema,
          422: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await container.createBooking.execute({
        ...request.body,
        source: "WEBSITE",
      });

      if (!result.ok) {
        return sendBookingError(reply, result.error);
      }

      return reply.code(201).send({ data: toBookingDto(result.value) });
    },
  );

  server.get(
    "/api/v1/admin/bookings",
    {
      preHandler: [authenticate, authorize],
      schema: {
        querystring: bookingListQuerySchema,
        response: {
          200: paginatedBookingsSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    async (request) => {
      const page = await container.listBookings.execute(request.query);

      return {
        data: page.data.map(toBookingDto),
        meta: page.meta,
      };
    },
  );

  server.get(
    "/api/v1/admin/bookings/:id",
    {
      preHandler: [authenticate, authorize],
      schema: {
        params: bookingIdParamsSchema,
        response: {
          200: bookingResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await container.getBooking.execute(request.params.id);

      if (!result.ok) {
        return sendBookingError(reply, result.error);
      }

      return { data: toBookingDto(result.value) };
    },
  );

  server.patch(
    "/api/v1/admin/bookings/:id/status",
    {
      preHandler: [authenticate, authorize],
      schema: {
        params: bookingIdParamsSchema,
        body: updateBookingStatusInputSchema,
        response: {
          200: bookingResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      if (request.body.status === "CANCELLED" && request.auth?.role === "RECEPTIONIST") {
        return reply.code(403).send({
          error: {
            code: "FORBIDDEN",
            message: "Receptionists cannot cancel bookings.",
          },
        });
      }

      const result = await container.updateBookingStatus.execute(
        request.params.id,
        request.body.status,
      );

      if (!result.ok) {
        return sendBookingError(reply, result.error);
      }

      return { data: toBookingDto(result.value) };
    },
  );
}
