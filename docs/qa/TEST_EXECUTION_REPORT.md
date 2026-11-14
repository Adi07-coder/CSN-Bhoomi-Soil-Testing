# AI Bhoomi — Test Execution Report

**Document ID**: QA-EXEC-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Execution Date**: 2026-10-13  
**Execution Environment**: Python 3.14.7 on Windows (win32) | PyTest 9.1.1 | AnyIO 4.15.1  
**Target Backend**: `http://localhost:8000` (FastAPI / Uvicorn Live Server)  
**Status**: 100% PASSED (29 / 29 Tests)  

---

## 1. Executive Summary

```
============================= test session starts =============================
platform win32 -- Python 3.14.7, pytest-9.1.1, pluggy-1.6.0 -- C:\Python314\python.exe
cachedir: .pytest_cache
rootdir: C:\Users\Aditya\Downloads\Project\ai-bhoomi
plugins: anyio-4.15.1
collected 29 items

tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_01_system_health PASSED [  3%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_02_geo_providers_status PASSED [  6%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_03_geodesic_area_calculation PASSED [ 10%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_04_reject_invalid_polygon PASSED [ 13%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_05_resolve_polygon_and_administrative PASSED [ 17%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_06_geocoding_search_and_reverse PASSED [ 20%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_07_farm_registration_and_retrieval PASSED [ 24%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_08_farm_update PASSED [ 27%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_09_tenant_isolation_farm_access PASSED [ 31%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_10_unauthenticated_requests_blocked PASSED [ 34%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_11_soil_agent_demo_mode_provenance PASSED [ 37%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_12_soil_agent_trained_mode_inference_and_parameters PASSED [ 41%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_13_fertilizer_recommendation PASSED [ 44%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_14_crop_recommendation PASSED [ 48%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_15_generate_and_download_pdf_report PASSED [ 51%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_16_tenant_isolation_report_download PASSED [ 55%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_17_mlops_model_registry PASSED [ 58%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_18_mlops_dataset_registry PASSED [ 62%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_19_standalone_farm_deletion PASSED [ 65%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_20_referential_integrity_audit_preservation PASSED [ 68%]
tests/test_comprehensive_api_e2e.py::TestAIBhoomiComprehensive::test_21_cascade_farm_deletion PASSED [ 72%]
tests/test_geometry.py::test_area_is_positive_and_units_convert PASSED   [ 75%]
tests/test_geometry.py::test_rejects_non_polygon PASSED                  [ 79%]
tests/test_geometry.py::test_rejects_self_intersection PASSED            [ 82%]
tests/test_soil_model.py::TestSoilModelPipeline::test_01_model_artifact_exists_and_registered PASSED [ 86%]
tests/test_soil_model.py::TestSoilModelPipeline::test_02_targets_and_metrics_present PASSED [ 89%]
tests/test_soil_model.py::TestSoilModelPipeline::test_03_prediction_output_structure_and_bounds PASSED [ 93%]
tests/test_soil_model.py::TestSoilModelPipeline::test_04_uncertainty_intervals PASSED [ 96%]
tests/test_soil_model.py::TestSoilModelPipeline::test_05_classification_rules PASSED [100%]

======================== 29 passed in 74.20s (0:01:14) ========================
```

---

## 2. Test Execution Analysis

| Metric | Measured Value | Target | Status |
|:---|:---:|:---:|:---:|
| **Total Test Cases** | **29** | >= 25 | MET |
| **Passed Cases** | **29** | 100% | MET |
| **Failed Cases** | **0** | 0 | MET |
| **Skipped / Blocked Cases**| **0** | 0 | MET |
| **Total Execution Runtime**| **74.20 s** | < 120 s | MET |
| **Pass Rate** | **100.0%** | 100% | **PASSED** |

---

## 3. Key Findings & Defect Verification
1. **Referential Integrity Handled**: Attempting to delete a farm with associated PDF reports correctly returns **HTTP 409 Conflict** (`test_20`), eliminating unexpected 500 server crashes.
2. **Cascading Deletion Verified**: Specifying `?cascade=true` cleanly cascades deletion of child reports and purges the farm with **HTTP 204 No Content** (`test_21`).
3. **Geometry Validation Flag**: `POST /api/v1/geo/calculate-area` successfully returns `"is_valid": true` (`test_03`).
4. **Tenant Isolation**: Confirmed 100% tenant isolation with **HTTP 403 Forbidden** across farm inspection, updates, deletions, and PDF downloads (`test_09` and `test_16`).
