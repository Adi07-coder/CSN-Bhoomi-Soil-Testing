# AI Bhoomi — Developer & Contributor Guide

**Document ID**: DEV-GUIDE-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Target Audience**: Full-Stack Engineers, ML Engineers, GIS Developers  
**Version**: 1.0.0  

---

## 1. Technical Stack Summary

- **Frontend**: React 18, TypeScript 5, Vite, Tailwind CSS, Leaflet 1.9.4
- **Backend API**: Python 3.14 / 3.11, FastAPI, Uvicorn, Pydantic v2
- **ORM & Database**: SQLAlchemy 2.0 Async, aiosqlite (Dev), asyncpg + PostGIS (Prod)
- **Geospatial**: pyproj 3.8 (Geod WGS84), Shapely 2.2, Geoapify REST API
- **Machine Learning**: Scikit-Learn 1.5+, Joblib, NumPy, Pandas
- **PDF Generation**: ReportLab Platypus 4.2+

---

## 2. Codebase Conventions & Standards

### 2.1 Backend Conventions
- **Route Modularization**: Place routes inside `backend/app/api/v1/<domain>.py`. Register router in `backend/app/api/v1/router.py`.
- **Database Access**: Always use the **Repository Pattern** (`backend/app/repositories/`). Route handlers must not write raw SQL queries directly.
- **Tenant Verification**: Every database query retrieving or modifying user data **MUST** check `entity.owner_id == current_user.id`.
- **Async First**: All database access and external API calls must be `async def` with `await`.

### 2.2 Frontend Conventions
- **Routing**: Define routed pages under `frontend/src/pages/`. Always wrap new pages in `React.lazy()` within `App.tsx` for optimal bundle splitting.
- **API Calls**: Add all backend interactions to `frontend/src/services/api.ts` using the centralized `api` Axios instance.
- **TypeScript**: No `any` types in production components. Add shared interfaces to `frontend/src/types/index.ts`.

---

## 3. Developing & Retraining ML Models

1. **Preprocessing Pipeline**: Add feature transformers to `ml/preprocessing/pipeline.py`.
2. **Model Training**:
   ```powershell
   python ml/training/train_soil_model.py
   ```
3. **Artifact Export**:
   - Serializes trained pipeline to `ml/artifacts/soil_model_pipeline.joblib`.
   - Generates updated metadata in `ml/artifacts/model_metadata.json`.
4. **Validating Model Tests**:
   ```powershell
   python -m pytest tests/test_soil_model.py -v
   ```
   Ensures that output bounds (pH in [4,10], OC in [0.05, 5]) and confidence intervals pass verification.

---

## 4. Running Tests & Quality Gates
Before submitting any pull request or committing code:
```powershell
# 1. Run complete automated test suite
python -m pytest tests -v

# 2. Build frontend production bundle
npm run build
```
100% of tests must pass (29/29) without warnings or errors.
