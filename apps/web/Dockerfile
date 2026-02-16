# ═══════════════════════════════════════════════════════════════════════════════
# WMS Web Frontend Dockerfile (Production)
# ═══════════════════════════════════════════════════════════════════════════════

FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @wms/types build

RUN pnpm --filter web build

# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:alpine AS runner

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Create nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    gzip on; \
    gzip_types text/plain text/css application/javascript application/json; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]