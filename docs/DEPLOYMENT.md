# Deployment Guide

## Docker Deployment

### Prerequisites

- Docker 24+
- Docker Compose v2+

### Quick Start

```bash
# Clone and deploy with Docker
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

This starts three containers:
- `f1-postgres` - PostgreSQL 16 database
- `f1-server` - Express API (port 3001)
- `f1-client` - Nginx-served React app (port 5173)

### Production Build

```bash
# Build all services
docker compose build

# Start in production
docker compose -f docker-compose.yml up -d
```

## Environment Variables

### Required Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3001` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `f1_predictor` |
| `DB_USER` | Database user | `f1_app` |
| `DB_PASSWORD` | Database password | `f1_secret_password` |
| `JWT_SECRET` | JWT signing secret | *(required in production)* |
| `JWT_REFRESH_SECRET` | JWT refresh secret | *(required in production)* |
| `JWT_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `VITE_API_URL` | API URL from client | `/api` |

### Production Secrets

For production, always override these:

```bash
# Generate strong secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For JWT_REFRESH_SECRET

# Use a strong DB password
# Use environment file or Docker secrets
```

## Database Migrations

```bash
# Run pending migrations
npm run db:migrate

# Seed development data
npm run db:seed
```

Migrations are stored in `server/src/infrastructure/persistence/migrations/`. The schema is bootstrapped from `database/schema.sql` when using Docker.

### Manual Migration

```bash
# Connect and run SQL
psql -h localhost -U f1_app -d f1_predictor -f database/schema.sql
```

## Production Build Commands

### Server

```bash
cd server
npm run build
# Output: server/dist/
```

### Client

```bash
cd client
npm run build
# Output: client/dist/
```

## Nginx Configuration

The client uses Nginx for production serving. See `client/nginx.conf`:

```nginx
server {
    listen 5173;
    root /usr/share/nginx/html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://server:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Health Checks

```bash
# Server health
curl http://localhost:3001/api/health

# Database health (via Docker)
docker exec f1-postgres pg_isready -U f1_app
```

## Backup & Restore

```bash
# Backup database
docker exec f1-postgres pg_dump -U f1_app f1_predictor > backup.sql

# Restore database
cat backup.sql | docker exec -i f1-postgres psql -U f1_app f1_predictor
```
