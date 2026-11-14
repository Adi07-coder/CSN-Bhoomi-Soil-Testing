# AI Bhoomi — Technical Handover Document for ChatGPT & Next Development

## 1. Project Overview & Architecture
- **Repository:** `C:\Users\Aditya\Downloads\CLG_Project\Soil-Testing`
- **Application:** AI Bhoomi — Satellite Soil Report
- **Stack:**
  - Frontend: React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, React-Leaflet, Lucide icons.
  - Backend: FastAPI, SQLAlchemy, SQLite (`aibhoomi.db`) in local dev, PostgreSQL/PostGIS in Docker.
  - ML Pipeline: Scikit-learn multi-target Random Forest (`ml/artifacts/soil_model_pipeline.joblib`).
  - LLM Advisory: Google Gemini API (`models/gemini-2.5-flash` / `models/gemini-flash-latest`) with deterministic ICAR-IISS fallback.
  - Report Generation: jsPDF client-side / ReportLab server-side.

## 2. Key Frontend Files & Directories
| File | Role |
|---|---|
| `frontend/src/layouts/DashboardLayout.tsx` | Main application shell with collapsible sidebar (Main Menu, AI Agents, Account) and header |
| `frontend/src/context/FarmContext.tsx` | Shared farm state, URL synchronization (`?farmId=...`), and cross-agent analysis cache |
| `frontend/src/pages/LandingPage.tsx` | 9-section public landing page in warm agricultural design system |
| `frontend/src/pages/DashboardPage.tsx` | Farmer dashboard with practical farm stats, next action card, and agents launcher |
| `frontend/src/pages/FarmsPage.tsx` | Farm workspace: summary stats, farm cards, and guided 5-step mapping workflow |
| `frontend/src/pages/SoilAnalysisAgentPage.tsx` | **Agent 1**: Field soil evaluation, NPK/micronutrients, ICAR ratings, and handover button |
| `frontend/src/pages/PlantingAdvisorAgentPage.tsx` | **Agent 2**: Crop suitability matching, Gemini AI guidance, and 50kg fertilizer bag schedules |
| `frontend/src/components/CropSelectionConfigurationCard.tsx` | Authoritative agricultural configuration card with plain-language farmer labels |
| `frontend/src/locales/dictionary.ts` | Preloaded English-to-Hindi dictionary with all farmer-friendly terms |

## 3. How to Start the Application
### Backend
```powershell
cd backend
python run.py
# Server runs on http://localhost:8000
# OpenAPI Docs: http://localhost:8000/api/docs
```

### Frontend
```powershell
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### Verification
```powershell
cd frontend
npm run build
# Successfully compiles production bundle with zero TypeScript errors
```

## 4. Working Features
- Delineating cadastral farm boundaries on satellite basemaps with geodesic area calculation in Acres & Hectares.
- Reverse geocoding of Indian talukas, districts, and villages (Geoapify with pure-Python offline fallback).
- Soil Analysis Agent running multi-target ML estimations and displaying ICAR benchmark diagnostic ratings.
- Planting Advisor Agent matching Kharif, Rabi, and Summer crops, generating agronomic justifications, and calculating fertilizer in standard 50kg bags.
- Shared FarmContext providing persistent selected farm state across all pages without re-drawing boundaries.
- Full bilingual English and Hindi localization with dual-subtitle mode.
- Generation and download of official two-page PDF reports.

## 5. Security & Technical Debt Notes for Next Developer
1. **API Keys in Backend Config:**
   - [backend/app/core/config.py](file:///c:/Users/Aditya/Downloads/CLG_Project/Soil-Testing/backend/app/core/config.py) contains default fallback keys for Gemini and Geoapify. Move these strictly to `.env` before production deployment.
2. **JWT Secret:**
   - Default secret is `CHANGE_ME_IN_PRODUCTION_SECRET_KEY_1234567890`. Must be rotated in `.env`.
3. **Database Migration:**
   - Local dev uses SQLite (`aibhoomi.db`). For PostGIS production, ensure Docker PostgreSQL container runs migrations cleanly.
