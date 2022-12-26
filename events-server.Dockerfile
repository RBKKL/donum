FROM node:18-slim AS base

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

RUN apt-get update && apt-get install -y git openssl python3 build-essential
RUN npm i -g pnpm

FROM base AS builder
WORKDIR /app

RUN pnpm add -g turbo
COPY . .
RUN turbo prune --scope=@donum/events-server
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app
 
COPY .gitignore .gitignore
COPY --from=builder /app/out/ .
RUN pnpm install
 
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nodejs
# USER nodejs

EXPOSE 8000
 
CMD ["pnpm", "--filter", "@donum/events-server", "start"]