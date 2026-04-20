# Farm-map-Dev — Operations Guide

> Quick reference for common development operations.  
> **Last Updated**: 30 March 2026

---

## Table of Contents

- [Docker Compose](#docker-compose)
- [Backend (API Gateway)](#backend-api-gateway)
- [Frontend (Next.js)](#frontend-nextjs)
- [Database Operations](#database-operations)
- [Testing](#testing)
- [Linting & Formatting](#linting--formatting)
- [Troubleshooting](#troubleshooting)

---

## Docker Compose

### Start All Services (Development)

```bash
# Start core services (PostgreSQL, Redis, MinIO)
docker compose -f docker-compose.dev.yml up -d

# Start with API Gateway and Frontend
docker compose -f docker-compose.dev.yml up -d --build

# Start with observability (OTLP collector)
docker compose -f docker-compose.dev.yml --profile observability up -d
```

### Stop Services

```bash
# Stop all containers (preserves volumes)
docker compose -f docker-compose.dev.yml down

# Stop and remove volumes (⚠️ deletes all data)
docker compose -f docker-compose.dev.yml down -v
```

### View Status

```bash
# Show running containers
docker compose -f docker-compose.dev.yml ps

# View service logs
docker compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker compose -f docker-compose.dev.yml logs -f api-gateway
docker compose -f docker-compose.dev.yml logs -f frontend
docker compose -f docker-compose.dev.yml logs -f db
```

### Restart Individual Services

```bash
docker compose -f docker-compose.dev.yml restart api-gateway
docker compose -f docker-compose.dev.yml restart frontend
docker compose -f docker-compose.dev.yml restart db
```

### Rebuild After Code Changes

```bash
# Rebuild and restart a specific service
docker compose -f docker-compose.dev.yml up -d --build api-gateway
docker compose -f docker-compose.dev.yml up -d --build frontend

# Force rebuild without cache
docker compose -f docker-compose.dev.yml build --no-cache api-gateway
```

### Run Smoke Tests

```bash
./scripts/smoke-test.sh
```

---

## Backend (API Gateway)

### Local Development (without Docker)

```bash
cd services/api-gateway

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
# .venv\Scripts\activate   # Windows

# Install dependencies
pip install -e ".[dev]"

# Run the server (requires DB running)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Environment Variables

Create a `.env` file in project root or export:

```bash
export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export DATABASE_NAME=ai_platform
export DATABASE_USER=platform
export DATABASE_PASSWORD=devpassword
export REDIS_URL=redis://localhost:6379/0
export LOG_LEVEL=DEBUG
```

### Database Migrations (Alembic)

```bash
cd services/api-gateway

# Create a new migration
alembic revision --autogenerate -m "description of change"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1

# View current migration status
alembic current

# View migration history
alembic history --verbose
```

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `http://localhost:8000/api/v1/health` | Health check |
| `http://localhost:8000/docs` | Swagger UI |
| `http://localhost:8000/redoc` | ReDoc API docs |

---

## Frontend (Next.js)

### Local Development (without Docker)

```bash
cd services/frontend

# Install dependencies
npm install

# Run development server (with Turbopack)
npm run dev
```

### Build & Production

```bash
# Production build
npm run build

# Start production server
npm run start
```

### Useful Scripts

```bash
npm run lint        # ESLint + TypeScript check
npm run lint:fix    # Auto-fix lint issues
npm run format      # Prettier formatting
npm run test        # Run Jest tests
npm run test:watch  # Watch mode
npm run test:coverage  # Coverage report
```

### Frontend URLs

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Main application |
| `http://localhost:3000/api/health` | Next.js health check |

---

## Database Operations

### Connect to PostgreSQL

```bash
# Via Docker
docker exec -it ai-platform-db psql -U platform -d ai_platform

# Direct connection (requires psql)
PGPASSWORD=devpassword psql -h localhost -p 5432 -U platform -d ai_platform
```

### Common SQL Queries

```sql
-- List all tables
\dt

-- Describe table structure
\d table_name

-- List extensions
SELECT extname FROM pg_extension;

-- Check database size
SELECT pg_size_pretty(pg_database_size('ai_platform'));
```

### Reset Database

```bash
# Stop services, remove volumes, restart
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up -d db

# Re-run migrations
cd services/api-gateway && alembic upgrade head
```

---

## Redis Operations

### Connect to Redis CLI

```bash
# Via Docker
docker exec -it ai-platform-redis redis-cli

# Direct connection
redis-cli -h localhost -p 6379
```

### Common Commands

```bash
PING                    # Test connection
KEYS *                  # List all keys
GET key_name            # Get value
DEL key_name            # Delete key
FLUSHALL                # Clear all data
INFO                    # Server info
```

---

## MinIO (S3-Compatible Storage)

### Access Points

| URL | Description |
|-----|-------------|
| `http://localhost:9001` | MinIO Console (Web UI) |
| `http://localhost:9000` | MinIO API endpoint |

**Default credentials**: `minioadmin` / `minioadmin`

### MinIO Client (mc)

```bash
# Configure alias
mc alias set local http://localhost:9000 minioadmin minioadmin

# List buckets
mc ls local

# Create bucket
mc mb local/my-bucket

# Upload file
mc cp myfile.txt local/my-bucket/

# List files in bucket
mc ls local/my-bucket
```

---

## Testing

### Backend Tests

```bash
cd services/api-gateway

# Run all tests
pytest

# Run with coverage
pytest --cov --cov-report=term-missing

# Run specific test file
pytest tests/unit/test_health.py

# Run specific test
pytest tests/unit/test_health.py::test_health_check

# Run only unit tests
pytest -m unit

# Run only integration tests (requires DB)
pytest -m integration

# Verbose output
pytest -v
```

### Frontend Tests

```bash
cd services/frontend

npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage
npm test -- --testPathPattern="ComponentName"  # Specific tests
```

---

## Linting & Formatting

### Backend (Python)

```bash
cd services/api-gateway

# Lint with Ruff
ruff check .

# Auto-fix issues
ruff check --fix .

# Format code
ruff format .

# Type checking
mypy app/
```

### Frontend (TypeScript)

```bash
cd services/frontend

# Lint
npm run lint

# Auto-fix
npm run lint:fix

# Format with Prettier
npm run format

# Type check only
npx tsc --noEmit
```

---

## Troubleshooting

### Docker Issues

```bash
# View container logs
docker logs ai-platform-api -f
docker logs ai-platform-db -f

# Check container health
docker inspect ai-platform-db --format='{{.State.Health.Status}}'

# Enter container shell
docker exec -it ai-platform-api /bin/bash

# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Nuclear option: reset everything
docker compose -f docker-compose.dev.yml down -v
docker system prune -af
docker compose -f docker-compose.dev.yml up -d --build
```

### Port Conflicts

| Service | Port | Check |
|---------|------|-------|
| PostgreSQL | 5432 | `lsof -i :5432` |
| Redis | 6379 | `lsof -i :6379` |
| MinIO API | 9000 | `lsof -i :9000` |
| MinIO Console | 9001 | `lsof -i :9001` |
| API Gateway | 8000 | `lsof -i :8000` |
| Frontend | 3000 | `lsof -i :3000` |
| OTLP gRPC | 4317 | `lsof -i :4317` |
| OTLP HTTP | 4318 | `lsof -i :4318` |

### Database Connection Issues

```bash
# Verify DB is running
docker compose -f docker-compose.dev.yml ps db

# Check DB logs
docker compose -f docker-compose.dev.yml logs db

# Test connection
PGPASSWORD=devpassword psql -h localhost -p 5432 -U platform -d ai_platform -c "SELECT 1;"
```

### Common Errors

| Error | Solution |
|-------|----------|
| `ECONNREFUSED` on API | Ensure api-gateway container is running |
| `Connection refused` on DB | Wait for db health check or restart: `docker compose restart db` |
| `Module not found` (Python) | Activate venv: `source .venv/bin/activate` |
| `Module not found` (Node) | Run `npm install` in frontend directory |
| `Permission denied` on scripts | `chmod +x scripts/*.sh` |
| Port already in use | Kill process: `kill $(lsof -t -i:PORT)` |

---

## Quick Reference

### Start Everything

```bash
docker compose -f docker-compose.dev.yml up -d --build
./scripts/smoke-test.sh
```

### Daily Development

```bash
# Infrastructure only (run services locally)
docker compose -f docker-compose.dev.yml up -d db redis minio

# Backend
cd services/api-gateway && source .venv/bin/activate && uvicorn app.main:app --reload

# Frontend (separate terminal)
cd services/frontend && npm run dev
```

### Before Committing

```bash
# Backend
cd services/api-gateway
ruff check --fix . && ruff format .
pytest --cov
mypy app/

# Frontend
cd services/frontend
npm run lint:fix && npm run format
npm run test
```
