import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { healthResponseSchema } from "@miranda/contract";
import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";
import { type AppContainer, buildContainer } from "./container";
import { env } from "./env";
import { getPrisma } from "./lib/prisma";
import { registerAuthRoutes } from "./modules/auth/interface/http/auth.routes";
import { registerBookingRoutes } from "./modules/bookings/interface/http/booking.routes";
import { registerRoomRoutes } from "./modules/rooms/interface/http/room.routes";

export interface BuildAppOptions {
  container?: AppContainer;
  logger?: boolean;
}

export function buildApp(options: BuildAppOptions = {}) {
  const app = Fastify({
    logger:
      options.logger === false
        ? false
        : env.NODE_ENV === "development"
          ? {
              level: "debug",
              transport: {
                target: "pino-pretty",
                options: { colorize: true, translateTime: "HH:MM:ss" },
              },
            }
          : { level: "info" },
    trustProxy: true,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(helmet);
  app.register(cors, {
    origin: env.CORS_ORIGINS,
    credentials: true,
  });
  app.register(cookie, { secret: env.COOKIE_SECRET });
  app.register(rateLimit, { max: 100, timeWindow: "1 minute" });
  app.register(swagger, {
    openapi: {
      info: {
        title: "Miranda API",
        description: "API de la plataforma de Hotel Miranda",
        version: "0.1.0",
      },
      servers: [{ url: env.API_URL }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });
  app.register(swaggerUi, { routePrefix: "/docs" });

  const container = options.container ?? buildContainer();

  app.register(async (instance) => {
    registerAuthRoutes(instance, container.auth);
    registerBookingRoutes(instance, container.bookings, container.auth);
    registerRoomRoutes(instance, container.rooms, container.auth);

    instance.get(
      "/health",
      {
        schema: {
          response: {
            200: healthResponseSchema,
          },
        },
      },
      async () => ({ status: "ok" as const }),
    );

    instance.get(
      "/",
      {
        schema: {
          response: {
            200: z.object({
              name: z.string(),
              version: z.string(),
              docs: z.string(),
            }),
          },
        },
      },
      async () => ({
        name: "Miranda API",
        version: "0.1.0",
        docs: "/docs",
      }),
    );
  });

  app.addHook("onClose", async () => {
    if (!options.container) {
      await getPrisma().$disconnect();
    }
  });

  return app;
}

export type App = ReturnType<typeof buildApp>;
