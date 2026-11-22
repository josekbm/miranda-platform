FROM node:24-alpine AS build

RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@12.21.0 --activate
WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

ENV DATABASE_URL=postgresql://miranda:miranda@localhost:5432/miranda
RUN pnpm --filter @miranda/api exec prisma generate
RUN pnpm --filter @miranda/api build
RUN pnpm --filter @miranda/api deploy --prod /prod/api
RUN cp -r apps/api/dist /prod/api/dist
RUN cp -r apps/api/prisma /prod/api/prisma
RUN cp apps/api/prisma.config.ts /prod/api/prisma.config.ts
RUN rm -rf /prod/api/.turbo /prod/api/.vscode

FROM node:24-alpine

RUN apk add --no-cache openssl wget
WORKDIR /app

ENV NODE_ENV=production \
    API_PORT=3000 \
    HOST=0.0.0.0

COPY --from=build /prod/api ./
COPY infra/api/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health >/dev/null || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
