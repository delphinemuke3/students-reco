# Multi-stage Dockerfile: build stage + small production image
# Stage 1: builder (install all deps and run any build)
FROM node:18-alpine AS builder
WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy source and run optional build (if present)
COPY . .
RUN npm run build --if-present

# Stage 2: production (only runtime + production deps)
FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copy package files and install only production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy app files (dockerignore ensures node_modules not copied from context)
COPY --chown=node:node . .

# Use non-root node user provided by official image
USER node

EXPOSE 3000

# Healthcheck endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- --timeout=2000 http://localhost:3000/health || exit 1

# Start command
CMD ["node", "index.js"]
