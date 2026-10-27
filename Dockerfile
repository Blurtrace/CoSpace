# -----------------------------------------------------------------------------
# Dockerfile Multi-stage para CoSpace (Next.js 16 + TypeScript + TypeORM)
# -----------------------------------------------------------------------------

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 1. Instalación de dependencias reproducibles
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# 2. Compilación de producción
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desactivar telemetría durante la compilación
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# 3. Imagen final de ejecución ligera y segura
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Ejecución bajo usuario sin privilegios root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]

