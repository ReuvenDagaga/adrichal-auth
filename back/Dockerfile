# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Production stage
FROM oven/bun:1-slim AS production

WORKDIR /app

# Copy dependencies and source from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/src ./src

# Create non-root user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs bunjs && \
    chown -R bunjs:nodejs /app

USER bunjs

# Expose port (adjust if needed)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["bun", "run", "src/index.ts"]
