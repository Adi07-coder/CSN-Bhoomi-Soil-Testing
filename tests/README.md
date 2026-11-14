# AI Bhoomi — Central Test Suite Directory

This directory contains all automated test suites for verifying the AI Bhoomi platform.

## Test Suites

| File Name | Test Scope | Execution Command |
| :--- | :--- | :--- |
| **`run_all_tests.py`** | Runs all test suites sequentially with summary | `python tests/run_all_tests.py` |
| **`test_master_workflow_e2e.py`** | Validates all 8 Master Prompt pillars (NPK table, Organic & Chemical treatments with 50kg bags, Kharif/Rabi/Summer crops, Gemini reasoning, Genuineness, and Guardrails) | `python tests/test_master_workflow_e2e.py` |
| **`test_map_polygon_acceptance.py`** | 15 Section 8 acceptance tests for polygon demarcation (1–20 points, no auto-scrolling at 3 points, undo, clear) | `python tests/test_map_polygon_acceptance.py` |
| **`test_system_integrity.py`** | Backend health, database connectivity, and symbol cleanliness | `python tests/test_system_integrity.py` |
| **`test_ml_model_inference.py`** | Validates Scikit-learn HistGradientBoosting model inference | `python tests/test_ml_model_inference.py` |

## Backend Pytest Suite
To run the backend unit tests using pytest:
```bash
cd backend
pytest
```
