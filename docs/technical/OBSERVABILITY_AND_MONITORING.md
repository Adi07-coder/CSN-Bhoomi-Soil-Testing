# AI Bhoomi — Observability and Monitoring

**Document ID**: TECH-OBS-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0  
**Status**: APPROVED  

---

## 1. Observability Overview

AI Bhoomi implements structured logging, audit trails, and health probes to maintain system transparency and diagnose issues across user sessions and ML model inferences.

---

## 2. Structured Audit Logging

### 2.1 Audit Log Architecture
Every critical state-changing operation writes an immutable record to the `audit_logs` database table:
```python
# Audit log structure in models.py / models/user.py
class AuditLog(Base):
    id: Mapped[str]  # UUID
    farmer_id: Mapped[str | None]  # Actor UUID
    action: Mapped[str]  # e.g. "account.register", "field.create", "soil.predict"
    entity_type: Mapped[str]  # "farmer", "field", "soil_assessment", "report"
    entity_id: Mapped[str | None]  # Target entity UUID
    details: Mapped[dict]  # JSON context (area, model_version, coordinates)
    created_at: Mapped[datetime]  # UTC timestamp
```

### 2.2 Tracked Events
- `account.register`: Farmer account created.
- `field.create`: New farm parcel registered with computed area.
- `soil.predict`: ML inference executed; records model name, version, and input centroid.
- `report.generate`: PDF Soil Health Card compiled; logs SHA-256 binary hash.

---

## 3. Health Checks & Probes

| Probe Endpoint | Purpose | Healthy Response | Unhealthy Action |
|:---|:---|:---|:---|
| `GET /health` | Liveness & Readiness probe for Docker / Kubernetes | `{"status": "ok", "app": "AI Bhoomi", "version": "1.0.0"}` | Restart container if non-responsive for 3 consecutive checks (30s interval). |
| `GET /api/v1/geo/providers/status` | External geocoding and map tile provider connectivity | `{"geocoding_status": "operational", "tile_layers": {...}}` | Alert operations if external provider latency exceeds 3000ms. |

---

## 4. Production Monitoring Strategy (Target Architecture)

- **Application Metrics**: Prometheus metrics exported via `starlette-prometheus` (request latency, HTTP status code distributions).
- **Log Aggregation**: JSON-structured stdout formatted logs ingested via Grafana Loki or AWS CloudWatch.
- **Error Tracking**: Sentry integration for real-time frontend unhandled exceptions and backend 500 error alerting.
- **Model Drift Monitoring**: Periodic Kolmogorov-Smirnov statistical tests comparing real user parcel distributions against training dataset feature distributions.
