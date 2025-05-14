FROM node:20-alpine

# Install dependencies 
WORKDIR /app

# Install development tools
RUN apk add --no-cache git libc6-compat wget

# Copy files
COPY package.json yarn.lock ./
COPY . .

# Install dependencies
RUN yarn install

# Set environment
ENV NODE_ENV=development
ENV HOST=0.0.0.0

# Generate Prisma client
RUN npx prisma generate

# Initialize database
RUN npx prisma db push

EXPOSE 3000

# Create the startup script with correct permissions and line endings
RUN printf '#!/bin/sh\n\
cd /app\n\
if [ ! -f /app/prisma/dev.db ]; then\n\
  echo "Database not found, initializing..."\n\
  npx prisma db push\n\
fi\n\
echo "Starting application in development mode..."\n\
yarn dev\n' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"] 