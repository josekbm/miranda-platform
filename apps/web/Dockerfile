FROM node:24-alpine AS build

RUN corepack enable && corepack prepare pnpm@12.21.0 --activate
WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @miranda/web build
RUN pnpm --filter @miranda/web deploy --prod /prod/web
RUN cp -r apps/web/dist /prod/web/dist
RUN rm -rf /prod/web/.turbo /prod/web/.vscode

FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4321

COPY --from=build /prod/web ./

EXPOSE 4321

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4321/ >/dev/null || exit 1

CMD ["node", "dist/server/entry.mjs"]
