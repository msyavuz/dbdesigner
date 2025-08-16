# --------------------------------
# Base image
# --------------------------------
FROM oven/bun:1 AS base
WORKDIR /app


FROM base AS install
COPY package.json bun.lock ./
COPY server/package.json ./server/
COPY client/package.json ./client/
COPY shared/package.json ./shared/

# Install all deps (Bun workspace-aware)
RUN bun install --frozen-lockfile

# --------------------------------
# Build stage
# --------------------------------
FROM base AS build
WORKDIR /app

# Copy source code
COPY . .

# Build shared first, then server and client
RUN bun run build:shared
RUN bun run build:server
RUN bun run build:client

# --------------------------------
# Server runtime
# --------------------------------
FROM oven/bun:1 AS server
WORKDIR /app

COPY --from=build /app ./

EXPOSE 3000
CMD ["bun", "run", "server/dist/index.js"]

# --------------------------------
# Client runtime (static serving)
# --------------------------------
FROM oven/bun:1 AS client
WORKDIR /app

# Use only client build output
COPY --from=build /app/client/dist ./dist

# Install a simple static server
RUN bun add -g serve

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
