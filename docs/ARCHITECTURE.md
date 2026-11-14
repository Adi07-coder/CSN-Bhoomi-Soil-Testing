# AI Bhoomi architecture and readiness

## Current included services

- React/Vite frontend inherited from v0.1.0 (existing prototype screens).
- FastAPI REST API: registration/login, JWT auth, field CRUD, GeoJSON polygon validation, ellipsoidal geodesic area, soil assessment provenance, demonstration-only crop rate calculations, immutable report snapshot/PDF/sha256, per-farmer report listing and ownership checks.
- PostGIS-enabled PostgreSQL container. Geometry is currently stored as GeoJSON JSON plus geodesically calculated area; a production migration should add a native `geometry(Polygon,4326)` column and GiST index.
- ML data schema and validation script. No trained model is bundled; prediction route is deliberately disabled.

## Important status distinctions

- `laboratory_verified`: requires a lab report reference in the API; an operator must still verify the reference and identity of the sample before treating it as authoritative.
- `model_estimate`: requires model name/version, but production must additionally enforce that the version is approved, calibrated for the target geography, and available in the model registry.
- `demo_sample` is reserved for fixture/demo workflows and must never be labelled verified.
- Crop rates are copied from the reference PDF for demonstration and are not endorsed prescriptions.
- Satellite acquisition is not implemented. No satellite imagery is fetched and no NDVI is calculated by this version.

## Production hardening still required

1. Alembic migrations, native PostGIS geometry, spatial index, backups/restore drills and retention policy.
2. Frontend auth/API integration and map drawing UI connected to `POST /api/v1/fields`; this backend endpoint accepts GeoJSON Polygon.
3. Token refresh/revocation, rate limiting, account recovery, email verification, MFA/admin policies, security review and secret rotation.
4. Object storage for reports with private access, retention and malware scanning where uploads are enabled.
5. Background job queue, retry/idempotency, observability, alerting, metrics and operational runbooks.
6. Satellite provider implementation with attribution, terms review, cloud filtering, data lineage and reproducible feature extraction.
7. Locally representative lab data and independently reviewed spatial validation before enabling ML predictions.
8. Agriculture expert review of recommendation rules and current Maharashtra guidance, with versions/effective dates and units.
9. Automated integration tests, CI, dependency scanning, load testing, privacy review and disaster recovery.

Therefore this is a substantial development baseline, not a claim of certified or fully production-ready agricultural advice.
