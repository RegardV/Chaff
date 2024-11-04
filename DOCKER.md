# Docker Installation Guide

## Prerequisites

1. Install Docker:
   - [Docker Desktop for Windows/Mac](https://www.docker.com/products/docker-desktop/)
   - [Docker Engine for Linux](https://docs.docker.com/engine/install/)

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-username/fassets-liquidator.git
cd fassets-liquidator
```

2. Create configuration files:
```bash
# Copy environment template
cp .env.example .env

# Create secrets file (if you haven't already)
node setup.js
```

3. Build and run with Docker Compose:
```bash
docker compose up -d
```

## Manual Docker Build

If you prefer to build and run manually:

1. Build the image:
```bash
docker build -t fassets-liquidator .
```

2. Run the container:
```bash
docker run -d \
  --name fassets-liquidator \
  -p 3000:3000 \
  -v $(pwd)/secrets.json:/app/secrets.json:ro \
  -v $(pwd)/logs:/app/logs \
  --env-file .env \
  fassets-liquidator
```

## Container Management

- View logs:
```bash
docker logs -f fassets-liquidator
```

- Stop the container:
```bash
docker stop fassets-liquidator
```

- Restart the container:
```bash
docker restart fassets-liquidator
```

## Production Deployment

For production, we recommend using Docker Compose with proper volume mounts:

```yaml
version: '3.8'
services:
  liquidator:
    build: .
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NETWORK=coston
    volumes:
      - ./secrets.json:/app/secrets.json:ro
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Security Considerations

1. Always use volume mounts for sensitive files (secrets.json)
2. Never build secrets into the image
3. Use read-only mounts where possible
4. Keep the base image updated
5. Run as non-root user (already configured in Dockerfile)

## Troubleshooting

1. Container won't start:
   - Check logs: `docker logs fassets-liquidator`
   - Verify environment variables
   - Ensure secrets.json exists and is readable

2. Performance issues:
   - Monitor resources: `docker stats`
   - Check log volume
   - Consider resource limits in compose file

3. Network issues:
   - Verify port mappings
   - Check container networking
   - Ensure host firewall allows traffic