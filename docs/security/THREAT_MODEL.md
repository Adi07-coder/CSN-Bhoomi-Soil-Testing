# AI Bhoomi — STRIDE Threat Model

**Document ID**: SEC-THREAT-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Methodology**: STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege)  
**Version**: 1.0.0  
**Status**: APPROVED  

---

## 1. Asset Inventory & Trust Boundaries

### 1.1 Critical Assets
1. **Farmer PII**: Names, phone numbers, email addresses.
2. **Geospatial Land Parcels**: Exact boundary coordinates, acreage, land record references.
3. **Soil Fertility Assessments**: Lab and model estimates of nitrogen, phosphorus, organic carbon.
4. **PDF Soil Health Cards**: Legal certificates used for bank agricultural loans.
5. **ML Model Artifacts**: Trained model pipeline binaries (`soil_model_pipeline.joblib`).

### 1.2 Trust Boundaries
- **TB-1: Client / Web Browser to API Gateway**: Public untrusted network crossing TLS boundary.
- **TB-2: API Gateway to Application Services**: Internal trusted runtime with JWT authorization.
- **TB-3: Backend Application to Database**: Protected database connection string boundary.
- **TB-4: Backend Application to External Providers**: Outbound HTTPS to Geoapify and Google Earth Engine.

---

## 2. STRIDE Threat Analysis & Mitigations

| Threat ID | STRIDE Category | Threat Scenario | Impact | Mitigation Strategy | Verification Evidence |
|:---|:---|:---|:---:|:---|:---|
| **THR-01** | **Spoofing** | Attacker crafts forged JWT tokens to impersonate another farmer. | High | Tokens signed with strong HMAC-SHA256 secret (`SECRET_KEY`). Invalid or manipulated signatures rejected with 401. | `test_10_unauthenticated_requests_blocked` |
| **THR-02** | **Tampering** | User submits corrupted or self-intersecting polygon to trigger server math crashes. | Medium | Geometry parsed via Shapely; self-intersections and <3 points rejected with HTTP 422 before calculation. | `test_04_reject_invalid_polygon` |
| **THR-03** | **Repudiation** | User denies having generated or downloaded an advisory report used for credit. | Medium | Generated reports log immutable UTC timestamp, owner ID, and cryptographic SHA-256 digest in `audit_logs` and `reports`. | Verified in DB audit trail |
| **THR-04** | **Information Disclosure** | User 2 queries User 1's farm ID or report ID to view private land coordinates. | High | Relational owner ID verification on every single entity query; returns HTTP 403 Forbidden on mismatch. | `test_09_tenant_isolation_farm_access` & `test_16` |
| **THR-05** | **Denial of Service** | Malicious bot spams geodesic area calculation with massive coordinate loops (>100k points). | Medium | Geodesic endpoint checks vertex length; area bounded between 100 m² and 100 km²; slowapi rate-limiting configured. | `test_03_geodesic_area_calculation` |
| **THR-06** | **Elevation of Privilege** | Standard farmer attempts to invoke model rollback or candidate approval APIs. | High | Admin role gating enforced on `/api/v1/models/{id}/approve` and `/rollback`; non-admin tokens rejected. | RBAC middleware checks |
