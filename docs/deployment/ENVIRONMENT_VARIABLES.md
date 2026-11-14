# AI Bhoomi — Environment Variables Reference

**Document ID**: DEP-ENV-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0  
**Status**: APPROVED  

---

## 1. Environment Variable Reference Table

| Variable Name | Required? | Default Value | Example Placeholder | Sensitivity | Purpose & Consuming Service |
|:---|:---:|:---|:---|:---:|:---|
| `APP_ENV` | Yes | `development` | `production` | Low | Specifies runtime environment (`development` enables SQLite auto-migration; `production` enforces strict security). |
| `SECRET_KEY` | Yes | (Auto-generated in dev) | `k9#mP2$vL8@zQ1...` | **HIGH** | HMAC-SHA256 private key used by `app/core/security.py` to sign and verify farmer JWT session tokens. |
| `DATABASE_URL` | Yes | `sqlite+aiosqlite:///./ai_bhoomi_dev.db` | `postgresql+asyncpg://user:pass@db:5432/aibhoomi` | **HIGH** | Async SQLAlchemy database connection URI. |
| `GEE_DEMO_MODE`| No | `True` | `False` | Low | Boolean flag. When `True`, bypasses Google Earth Engine authentication and generates synthetic NDVI/EVI demo bands. |
| `GEOAPIFY_API_KEY` | Yes | (None) | `a1b2c3d4e5f6...` | Medium | API key for Geoapify forward and reverse administrative geocoding services. |
| `CORS_ORIGINS` | No | `http://localhost:5173,http://localhost:3000` | `https://app.aibhoomi.ag` | Low | Comma-delimited list of permitted CORS frontend client origins. |
| `REPORT_DIR` | No | `./reports` | `/var/data/reports` | Low | Local filesystem path where compiled vector PDF reports are stored. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `10080` (7 days) | `1440` (24 hours) | Low | JWT token expiration duration in minutes. |

---

## 2. Configuration Best Practices
1. **Production Secrets**: In production, `SECRET_KEY` and `DATABASE_URL` must be injected via secure secret managers (e.g., AWS Secrets Manager, HashiCorp Vault, Kubernetes Secrets).
2. **Never Commit Secrets**: The `.env` file is explicitly included in `.gitignore`. Only `.env.example` with non-sensitive placeholders is version-controlled.
