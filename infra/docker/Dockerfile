# Multi-stage hardened production Dockerfile for VYRON Platform
# Stage 1: Build & bundle
FROM node:20-alpine AS builder

WORKDIR /app

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache libc6-compat

# Install dependencies with lockfile immutability
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source trees and configurations
COPY . .

# Run production build (Vite + Nitro client & SSR server)
RUN npm run build

# Stage 2: Distroless/unprivileged runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Create unprivileged group & user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 vyronuser

# Copy built server output and public client assets
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Enforce file permissions
RUN chown -R vyronuser:nodejs /app

USER vyronuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

CMD ["node", ".output/server/index.mjs"]
