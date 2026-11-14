# AI Bhoomi — Production Deployment Guide

**Document ID**: DEP-GUIDE-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Target Environment**: Docker / Kubernetes / Cloud VPS (AWS EC2 / DigitalOcean / Hetzner)  
**Version**: 1.0.0  
**Status**: APPROVED  

---

## 1. Production Deployment Architecture

```mermaid
graph TD
    Internet((Public Internet)) -->|HTTPS Port 443| Nginx[NGINX Reverse Proxy / Ingress]
    
    subgraph Container Network (Docker Compose)
        Nginx -->|Port 80| Frontend[Static SPA: Vite Dist / Nginx]
        Nginx -->|Port 8000| BackendApp[FastAPI Gunicorn Workers x 4]
        BackendApp -->|Port 5432| PostGIS[(PostgreSQL 15 + PostGIS)]
        BackendApp --> Storage[(Persistent Volume: /app/reports)]
    end

    BackendApp -.->|HTTPS| Geoapify[Geoapify Cloud API]
    BackendApp -.->|HTTPS| GEE[Google Earth Engine]
```

---

## 2. Docker Compose Deployment

The repository includes a production-ready `docker-compose.yml`:
```yaml
version: '3.8'

services:
  db:
    image: postgis/postgis:15-3.3-alpine
    container_name: aibhoomi_postgis
    environment:
      POSTGRES_DB: aibhoomi_prod
      POSTGRES_USER: aibhoomi_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U aibhoomi_user -d aibhoomi_prod"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: aibhoomi_api
    environment:
      APP_ENV: production
      DATABASE_URL: postgresql+asyncpg://aibhoomi_user:${DB_PASSWORD}@db:5432/aibhoomi_prod
      SECRET_KEY: ${SECRET_KEY}
      GEE_DEMO_MODE: "False"
      GEOAPIFY_API_KEY: ${GEOAPIFY_API_KEY}
    volumes:
      - reports_data:/app/reports
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8000:8000"
    restart: unless-stopped

volumes:
  postgres_data:
  reports_data:
```

---

## 3. Deployment Steps

1. **Provision Virtual Server**: Ubuntu 22.04 LTS (Minimum 2 vCPU, 4 GB RAM, 40 GB NVMe SSD).
2. **Install Docker & Docker Compose**:
   ```bash
   sudo apt-get update && sudo apt-get install -y docker.io docker-compose
   ```
3. **Configure Environment Secrets**:
   Create `/opt/ai-bhoomi/.env` with high-entropy `SECRET_KEY` and `DB_PASSWORD`.
4. **Build Frontend Bundle**:
   ```bash
   npm run build
   # Outputs optimized production assets to dist/
   ```
5. **Launch Containers**:
   ```bash
   docker-compose up -d --build
   ```
6. **Verify Services**:
   ```bash
   curl -f http://localhost:8000/health
   # Expected: {"status": "ok", "app": "AI Bhoomi", "version": "1.0.0"}
   ```
