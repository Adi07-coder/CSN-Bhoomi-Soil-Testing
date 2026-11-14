# AI Bhoomi — Test Cases Specification

**Document ID**: QA-CASES-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0  
**Status**: APPROVED & VERIFIED  

---

## 1. Automated Test Cases Directory (29 Test Cases)

### Category A: Geospatial Core (Unit Tests)

| Case ID | Test Method | Preconditions | Input | Expected Output | Status |
|:---|:---|:---|:---|:---|:---:|
| **TC-GEO-01** | `test_area_is_positive_and_units_convert` | pyproj installed | Valid 4-vertex polygon | `area_m2 > 0`, `area_acres = area_m2 / 4046.856`, `area_ha = area_m2 / 10000` | **PASS** |
| **TC-GEO-02** | `test_rejects_non_polygon` | Valid FastAPI app | GeoJSON Point `{"type":"Point","coordinates":[75.2,19.9]}` | HTTP 422: "Only GeoJSON Polygon boundaries are supported" | **PASS** |
| **TC-GEO-03** | `test_rejects_self_intersection` | Valid FastAPI app | Self-crossing polygon coordinates | HTTP 422: "Invalid field polygon: Self-intersection" | **PASS** |

---

### Category B: ML Soil Pipeline (Unit Tests)

| Case ID | Test Method | Preconditions | Input | Expected Output | Status |
|:---|:---|:---|:---|:---|:---:|
| **TC-ML-01** | `test_01_model_artifact_exists_and_registered` | `ml/artifacts` files present | Pipeline loader | Pipeline non-null, version == "1.0.0" | **PASS** |
| **TC-ML-02** | `test_02_targets_and_metrics_present` | Pipeline loaded | Inspection | Contains 8 target parameters, metrics dictionary | **PASS** |
| **TC-ML-03** | `test_03_prediction_output_structure_and_bounds` | Pipeline loaded | Lat=18.52, Lon=73.85 | pH in [4.0, 10.0], OC in [0.05, 5.0], N in [50, 600] | **PASS** |
| **TC-ML-04** | `test_04_uncertainty_intervals` | Pipeline loaded | Prediction output | `CI_low <= value <= CI_high` holds for all 8 parameters | **PASS** |
| **TC-ML-05** | `test_05_classification_rules` | Domain logic loaded | Sample parameters | Correct ICAR classes assigned (Low/Medium/High) | **PASS** |

---

### Category C: End-to-End API Integration (Integration Tests)

| Case ID | Test Method | Endpoint Tested | Expected HTTP Code & Output | Status |
|:---|:---|:---|:---|:---:|
| **TC-E2E-01** | `test_01_system_health` | `GET /health` | HTTP 200: `{"status": "ok"}` | **PASS** |
| **TC-E2E-02** | `test_02_geo_providers_status` | `GET /api/v1/geo/providers/status` | HTTP 200: `{"geocoding_status": "operational"}` | **PASS** |
| **TC-E2E-03** | `test_03_geodesic_area_calculation` | `POST /api/v1/geo/calculate-area` | HTTP 200: `is_valid: true`, area within +/-5% of 1.165 km² | **PASS** |
| **TC-E2E-04** | `test_04_reject_invalid_polygon` | `POST /api/v1/geo/calculate-area` | HTTP 422: Rejection of degenerate 2-point array | **PASS** |
| **TC-E2E-05** | `test_05_resolve_polygon_and_administrative` | `POST /api/v1/geo/resolve-polygon` | HTTP 200: `is_valid: true`, 4 vertices, state="Maharashtra" | **PASS** |
| **TC-E2E-06** | `test_06_geocoding_search_and_reverse` | `GET /api/v1/geo/search` & `/reverse` | HTTP 200: Autocomplete results list & reverse metadata | **PASS** |
| **TC-E2E-07** | `test_07_farm_registration_and_retrieval` | `POST & GET /api/v1/farms` | HTTP 201 Created on save; HTTP 200 on retrieval | **PASS** |
| **TC-E2E-08** | `test_08_farm_update` | `PATCH /api/v1/farms/{id}` | HTTP 200: Field name updated | **PASS** |
| **TC-E2E-09** | `test_09_tenant_isolation_farm_access` | `GET /api/v1/farms/{u1_farm}` as U2 | HTTP 403 Forbidden (Zero cross-tenant leakage) | **PASS** |
| **TC-E2E-10** | `test_10_unauthenticated_requests_blocked` | `GET /api/v1/farms` without token | HTTP 401 Unauthorized | **PASS** |
| **TC-E2E-11** | `test_11_soil_agent_demo_mode_provenance` | `POST /api/v1/analyses` (demo) | HTTP 200: `is_demo: true`, explicit demo warning label | **PASS** |
| **TC-E2E-12** | `test_12_soil_agent_trained_mode_inference` | `POST /api/v1/analyses` (model) | HTTP 200: 8 parameters with `source_type: "model_estimate"` | **PASS** |
| **TC-E2E-13** | `test_13_fertilizer_recommendation` | `POST /api/v1/farms/{id}/fertilizer-recommendations`| HTTP 200: Stage-split DAP, Urea, and MOP dosages | **PASS** |
| **TC-E2E-14** | `test_14_crop_recommendation` | `POST /api/v1/farms/{id}/crop-recommendations` | HTTP 200: Ranked list of suitable crops | **PASS** |
| **TC-E2E-15** | `test_15_generate_and_download_pdf_report` | `POST /api/v1/farms/{id}/reports` & `/download` | HTTP 201 Created, HTTP 200 PDF stream with `%PDF-` header | **PASS** |
| **TC-E2E-16** | `test_16_tenant_isolation_report_download` | `GET /api/v1/reports/{u1_rep}/download` as U2 | HTTP 403 Forbidden | **PASS** |
| **TC-E2E-17** | `test_17_mlops_model_registry` | `GET /api/v1/models` | HTTP 200: Active approved model with R² = 0.942 | **PASS** |
| **TC-E2E-18** | `test_18_mlops_dataset_registry` | `GET /api/v1/datasets` | HTTP 200: Validated dataset records listed | **PASS** |
| **TC-E2E-19** | `test_19_standalone_farm_deletion` | `DELETE /api/v1/farms/{id}` (no reports)| HTTP 204 No Content | **PASS** |
| **TC-E2E-20** | `test_20_referential_integrity_audit_preservation` | `DELETE /api/v1/farms/{id}` (has reports)| HTTP 409 Conflict: Preserves audit integrity | **PASS** |
| **TC-E2E-21** | `test_21_cascade_farm_deletion` | `DELETE /api/v1/farms/{id}?cascade=true` | HTTP 204 No Content: Clean cascade wipe of all child data | **PASS** |
