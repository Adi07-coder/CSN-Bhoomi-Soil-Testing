# AI Bhoomi — Operations & Incident Runbook

**Document ID**: DEP-OPS-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Target Audience**: DevOps Engineers, Site Reliability Engineers, On-Call Support  
**Version**: 1.0.0  
**Status**: APPROVED  

---

## 1. Routine Operational Procedures

### 1.1 Service Health Verification
```bash
# Verify API HTTP Status
curl -i http://localhost:8000/health

# Verify Geocoding Provider
curl -i http://localhost:8000/api/v1/geo/providers/status

# Check Docker Container States
docker ps --filter "name=aibhoomi"
```

### 1.2 Backing Up Relational Database
```bash
# For PostgreSQL (Docker):
docker exec -t aibhoomi_postgis pg_dump -U aibhoomi_user aibhoomi_prod | gzip > backup_$(date +%F_%T).sql.gz

# For SQLite (Dev):
cp ./ai_bhoomi_dev.db ./backups/ai_bhoomi_$(date +%F_%T).db
```

### 1.3 Restarting Services
```bash
# Graceful restart of API backend
docker-compose restart backend

# Full restart
docker-compose down && docker-compose up -d
```

---

## 2. Emergency Incident Triage Playbooks

### Incident 1: API Returns 500 on Farm Operations
- **Symptom**: Farmer receives server error when managing farm parcels.
- **Root Cause Check**: Database session lock or unhandled foreign key constraints.
- **Triage Action**:
  1. Inspect container logs: `docker logs --tail 100 aibhoomi_api`.
  2. If foreign key constraint failure is logged, verify whether client invoked delete without `?cascade=true` on a farm with child reports.
  3. Ensure database connection pool is not exhausted (`max_connections` in Postgres).

### Incident 2: Geocoding Autocomplete Fails
- **Symptom**: User types village/taluka name into map search, but no dropdown suggestions appear.
- **Root Cause Check**: External Geoapify API quota exhausted or rate limit triggered.
- **Triage Action**:
  1. Check `GET /api/v1/geo/providers/status`.
  2. Test Geoapify key directly: `curl "https://api.geoapify.com/v1/geocode/autocomplete?text=Pune&apiKey=$GEOAPIFY_API_KEY"`.
  3. If rate-limited, rotate to backup `GEOAPIFY_API_KEY` in `.env` and reload API.
  4. Application will automatically fallback to administrative bounding box extraction.

### Incident 3: Model Rollback
- **Symptom**: Inaccurate or aberrant predictions observed after deploying a new candidate ML pipeline.
- **Triage Action**:
  ```bash
  # Execute instantaneous model rollback to previous validated version
  curl -X POST http://localhost:8000/api/v1/models/aibhoomi-soil-v1.0.0/rollback \
    -H "Authorization: Bearer $ADMIN_TOKEN"
  ```
