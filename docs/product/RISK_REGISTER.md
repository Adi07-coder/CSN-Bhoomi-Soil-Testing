# AI Bhoomi — Risk Register

**Document ID**: PRD-RISK-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0  
**Status**: ACTIVE  

---

## 1. Risk Matrix Overview

| Impact \ Likelihood | Low | Medium | High |
|:---|:---|:---|:---|
| **High** | Medium Risk | High Risk | **Critical Risk** |
| **Medium** | Low Risk | Medium Risk | High Risk |
| **Low** | Negligible | Low Risk | Medium Risk |

---

## 2. Identified Risks & Mitigations

| Risk ID | Category | Description | Likelihood | Impact | Severity | Mitigation Strategy | Owner | Status |
|:---|:---|:---|:---:|:---:|:---:|:---|:---|:---:|
| **RSK-001** | Agronomic | Farmers over-applying fertilizers based solely on estimated model values without lab checks. | Medium | High | **High** | Prominent in-app and PDF disclaimers stating ML outputs are advisory estimates and recommending physical lab verification before major investments. | Lead Agronomist | Mitigated |
| **RSK-002** | ML Model | Organic Carbon ML model shows lower accuracy (R² < 0) due to localized micro-variations. | High | Medium | **High** | Organic Carbon is flagged with an explicit "Lab Verification Required" warning in UI and reports; planned integration of elevation and SoilGrids covariates. | ML Engineer | Active Monitoring |
| **RSK-003** | Satellite | Sentinel-2 satellite data unavailable due to cloud cover during monsoon season (June–Sept). | High | Medium | **High** | Use Synthetic Aperture Radar (SAR) Sentinel-1 data for moisture backscatter and fallback to historical 3-year baseline composites. | GIS Engineer | Planned |
| **RSK-004** | API Quota | Geoapify external geocoding API rate limits exceeded during peak planting seasons. | Medium | Medium | **Medium** | In-memory and Redis caching of resolved district/taluka polygons; local administrative boundary polygon lookup fallback. | Backend Lead | Mitigated |
| **RSK-005** | Security | Cross-tenant farm parcel access or tampering via unauthorized API requests. | Low | High | **High** | Enforced relational tenant isolation with JWT Bearer tokens; verified via 29 automated E2E tests (HTTP 403 Forbidden). | Security Lead | Closed / Verified |
| **RSK-006** | Data Integrity | Unintended deletion of farm parcels causing orphaned or broken audit PDF records. | Low | Medium | **Medium** | Handled with HTTP 409 Conflict when child reports exist; supports explicit `?cascade=true` for intentional total cleanup. | Backend Lead | Closed / Resolved |
| **RSK-007** | Infrastructure| Single-point-of-failure with SQLite in production deployments. | Low | High | **High** | Docker Compose configured with PostgreSQL 15 + PostGIS; documented in production deployment runbooks. | DevOps Lead | Documented |
