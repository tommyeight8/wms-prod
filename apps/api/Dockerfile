# ═══════════════════════════════════════════════════════════════════════════════
# WMS API Dockerfile (Production)
# ═══════════════════════════════════════════════════════════════════════════════

FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copy everything, then install (pnpm needs full workspace context)
COPY . .

RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm --filter @wms/db exec prisma generate

# Build all packages in dependency order
RUN pnpm --filter @wms/types build
RUN pnpm --filter @wms/config build
RUN pnpm --filter @wms/auth build
RUN pnpm --filter @wms/db build
RUN pnpm --filter @wms/pubsub build
RUN pnpm --filter @wms/queue build
RUN pnpm --filter @wms/domain build
RUN pnpm --filter api build

# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

ENV NODE_ENV=production

COPY --from=builder /app ./

RUN pnpm prune --prod

WORKDIR /app/apps/api
EXPOSE 3000

CMD ["sh", "-c", "cd /app/packages/db && pnpm exec prisma migrate deploy && cd /app/apps/api && node dist/server.js"]