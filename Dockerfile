# Multi-platform Docker build with 2025 optimizations
FROM node:22-alpine AS builder
ARG TARGETPLATFORM
ARG BUILDPLATFORM
WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Create asset directories if they don't exist
RUN mkdir -p assets/source/sprites assets/source/ui assets/processed

# Build application for Docker (with TypeScript compilation)
RUN npm run build

# Generate build info (skip git commands in Docker)
RUN echo '{"version":"docker-build","buildTime":"'$(date -Iseconds)'","gitCommit":"docker","gitBranch":"docker","nodeVersion":"'$(node --version)'","npmVersion":"'$(npm --version)'","environment":"production"}' > dist/build-info.json

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Security headers and optimizations
RUN echo "add_header X-Frame-Options SAMEORIGIN always;" >> /etc/nginx/conf.d/security.conf && \
    echo "add_header X-Content-Type-Options nosniff always;" >> /etc/nginx/conf.d/security.conf && \
    echo "add_header X-XSS-Protection '1; mode=block' always;" >> /etc/nginx/conf.d/security.conf && \
    echo "add_header Content-Security-Policy \"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';\" always;" >> /etc/nginx/conf.d/security.conf

# Set proper ownership for existing nginx user
RUN chown -R nginx:nginx /usr/share/nginx/html

USER nginx
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]