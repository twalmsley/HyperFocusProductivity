FROM node:20-alpine

# Install dependencies 
WORKDIR /app

# Install development tools
RUN apk add --no-cache git libc6-compat wget openssl

# Copy package files first for better layer caching
COPY package.json yarn.lock ./
COPY prisma ./prisma/

# Install dependencies with the right order
RUN yarn install

# Add wait-on for PostgreSQL readiness
RUN yarn add wait-on --non-interactive

# Copy the rest of the app
COPY . .

RUN yarn build

COPY .env.docker.prod .output/server/.env

# Set environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Clean and regenerate Prisma client
RUN rm -rf node_modules/.prisma
RUN npx prisma generate

# Build application
EXPOSE 3000

# Create the startup script with correct permissions and line endings
RUN printf '#!/bin/sh\n\
cd /app\n\
echo "Starting database initialization..."\n\
bash /app/scripts/docker-init-db.sh\n\
echo "Starting application..."\n\
node .output/server/index.mjs\n' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"] 