# syntax=docker/dockerfile:1.7

# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --include=dev

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN chmod -R a+rX ./public

# Pre-create the writable data dir so the named-volume mount in
# docker-compose.yml inherits ownership/perms instead of starting root-owned.
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
