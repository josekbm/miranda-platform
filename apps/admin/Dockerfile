FROM node:24-alpine AS build

RUN corepack enable && corepack prepare pnpm@12.21.0 --activate
WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

ARG VITE_API_URL=http://localhost:3000
ARG VITE_PUBLIC_SITE_URL=http://localhost:4321
ARG VITE_DEMO_MODE=true

ENV VITE_API_URL=$VITE_API_URL \
    VITE_PUBLIC_SITE_URL=$VITE_PUBLIC_SITE_URL \
    VITE_DEMO_MODE=$VITE_DEMO_MODE

RUN pnpm --filter @miranda/admin build

FROM nginx:alpine

COPY infra/admin/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/admin/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/health || exit 1
