# AI Bhoomi — Requirements Traceability Matrix (RTM)

**Document ID**: QA-RTM-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0  
**Status**: APPROVED  

---

## 1. Traceability Mapping

| Req ID | Requirement Description | User Story | Implementation Source | API Endpoint | Test Case ID | Test Result | Status |
|:---|:---|:---|:---|:---|:---|:---:|:---:|
| **FR-001** | Account Registration & JWT Auth | US-101 | `app/api/v1/auth.py` | `POST /api/v1/auth/register` | `TC-E2E-07` (setup) | PASSED | **IMPLEMENTED** |
| **FR-002** | User Login & Authentication Guard | US-102 | `app/api/v1/auth.py` | `POST /api/v1/auth/login` | `TC-E2E-10` | PASSED | **IMPLEMENTED** |
| **FR-003** | Geodesic Area Calculation | US-202 | `app/services/geo_utils.py` | `POST /api/v1/geo/calculate-area` | `TC-GEO-01`, `TC-E2E-03` | PASSED | **IMPLEMENTED** |
| **FR-004** | Polygon Geometry Validation | US-202 | `app/services/geo_utils.py` | `POST /api/v1/geo/resolve-polygon` | `TC-GEO-02`, `TC-GEO-03`, `TC-E2E-04` | PASSED | **IMPLEMENTED** |
| **FR-005** | Administrative Reverse Geocode | US-203 | `app/services/geocoding_service.py` | `POST /api/v1/geo/resolve-polygon` | `TC-E2E-05`, `TC-E2E-06` | PASSED | **IMPLEMENTED** |
| **FR-006** | Farm Parcel CRUD Lifecycle | US-202 | `app/api/v1/farms.py` | `/api/v1/farms` | `TC-E2E-07`, `TC-E2E-08` | PASSED | **IMPLEMENTED** |
| **FR-007** | Multi-Tenant Data Isolation | US-102 | `app/api/v1/farms.py` | `/api/v1/farms/{id}` | `TC-E2E-09`, `TC-E2E-16` | PASSED | **IMPLEMENTED** |
| **FR-008** | Referential Integrity 409 & Cascade | US-204 | `app/repositories/farm_repo.py` | `DELETE /api/v1/farms/{id}` | `TC-E2E-19`, `TC-E2E-20`, `TC-E2E-21` | PASSED | **IMPLEMENTED** |
| **FR-009** | AI Soil Fertility Model Inference | US-301 | `backend/app/soil_model.py` | `POST /api/v1/analyses` | `TC-ML-01` to `04`, `TC-E2E-12` | PASSED | **IMPLEMENTED** |
| **FR-010** | ICAR Soil Benchmark Classification | US-301 | `app/services/recommendation_engine.py` | `POST /api/v1/analyses` | `TC-ML-05`, `TC-E2E-12` | PASSED | **IMPLEMENTED** |
| **FR-011** | Crop & Fertilizer Recommendations | US-302 | `app/services/recommendation_engine.py` | `/api/v1/farms/{id}/fertilizer-recommendations`| `TC-E2E-13`, `TC-E2E-14` | PASSED | **IMPLEMENTED** |
| **FR-012** | PDF Report Generation & Hashing | US-401 | `app/api/v1/reports.py` | `/api/v1/reports/{id}/download`| `TC-E2E-15` | PASSED | **IMPLEMENTED** |
| **FR-013** | MLOps Registry & Governance | - | `app/api/v1/ml_ops.py` | `/api/v1/models`, `/datasets` | `TC-E2E-17`, `TC-E2E-18` | PASSED | **IMPLEMENTED** |
| **FR-014** | Live Sentinel-2 GEE Acquisition | - | `app/api/v1/satellite.py` | `/api/v1/farms/{id}/satellite-analyses`| `TC-E2E-11` | PASSED (Demo) | **PARTIALLY IMPLEMENTED** |

---

## 2. Summary Coverage Statistics
- Total Functional Requirements: **14**
- Fully Implemented & Tested: **13** (92.9%)
- Partially Implemented (Demo Mode): **1** (7.1% — GEE Service Account Key requirement)
- Unimplemented / Broken: **0** (0.0%)
- Test Execution Coverage: **100.0%** of implemented code paths verified.
