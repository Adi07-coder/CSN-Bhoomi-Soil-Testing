# AI Bhoomi — Developer Troubleshooting Guide

**Document ID**: DEV-TROUBLE-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0  

---

## 1. Common Issues & Verified Resolutions

### Issue 1: `ModuleNotFoundError: No module named 'greenlet'` or `asyncpg`
- **Cause**: SQLAlchemy 2.0 Asyncio engine requires `greenlet` C-extension and async database drivers.
- **Resolution**:
  ```powershell
  python -m pip install greenlet aiosqlite asyncpg
  ```

### Issue 2: `HTTP 409 Conflict` when deleting farm
- **Cause**: Farm has active PDF reports or assessments; system guards foreign key integrity to preserve legal audit records.
- **Resolution**:
  - If intentional permanent purge is desired, pass the cascade parameter:
    ```http
    DELETE /api/v1/farms/{farm_id}?cascade=true
    ```
  - Alternatively, archive the farm instead of hard-deleting:
    ```http
    PATCH /api/v1/farms/{farm_id} {"status": "archived"}
    ```

### Issue 3: Leaflet map tiles fail to load
- **Cause**: Client network block, adblocker interfering with CartoDB/OpenStreetMap CDNs, or missing internet connection.
- **Resolution**: Verify browser network tab; check `GET /api/v1/geo/providers/status` for tile provider status; ensure firewall allows outbound HTTPS to `*.tile.openstreetmap.org` and `*.basemaps.cartocdn.com`.

### Issue 4: `URLError: [WinError 10061] No connection could be made` during test runs
- **Cause**: The FastAPI backend server is not running on port 8000 when integration tests are invoked.
- **Resolution**:
  Start the backend server in a separate terminal:
  ```powershell
  uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
  ```
