# HyperFocus Productivity - Docker Deployment

This guide explains how to run the HyperFocus Productivity application in a Docker container.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

Run the application with a single command:

```bash
./start-docker.sh
```

Or use Docker Compose directly:

```bash
docker-compose up -d
```

## Details

The application will be available at `http://localhost:3000`.

### What's included:

- The web application running on port 3000
- SQLite database stored inside the container
- Automated database initialization during the build

### Notes:

- The container runs in production mode
- No volumes are mounted, so all data is contained within the container
- If you need to persist data across container restarts, modify the Docker Compose file to add a volume

## Stopping the container

```bash
docker-compose down
```

## Viewing logs

```bash
docker-compose logs -f
``` 