# AI Bhoomi — Installation and Local Setup Guide

**Document ID**: DEP-INST-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Target OS**: Windows 11 / Linux (Ubuntu 22.04+) / macOS  
**Version**: 1.0.0  
**Status**: APPROVED  

---

## 1. Prerequisites & Required Software

| Software | Minimum Version | Verified Version | Purpose |
|:---|:---|:---|:---|
| **Python** | 3.11+ | 3.14.7 | Backend FastAPI application & ML pipelines |
| **Node.js** | 18.x LTS | 20.x | Frontend build tool & Vite dev server |
| **npm** | 9.x | 10.x | JavaScript package management |
| **Git** | 2.38+ | 2.45+ | Version control |
| **Docker & Compose** | 24.0+ | (Optional) | PostgreSQL + PostGIS containerization |

---

## 2. Windows Local Development Setup

### Step 1: Clone Repository & Setup Virtual Environment
```powershell
# Open PowerShell in your working directory
cd C:\Users\Aditya\Downloads\Project\ai-bhoomi

# Create virtual environment (if not already created)
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1
```

### Step 2: Install Backend Dependencies
```powershell
# Install production requirements
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```
Ensure key settings in `.env`:
```env
APP_ENV=development
SECRET_KEY=change_this_to_a_secure_random_key_in_production
DATABASE_URL=sqlite+aiosqlite:///./ai_bhoomi_dev.db
GEE_DEMO_MODE=True
GEOAPIFY_API_KEY=your_geoapify_key_here
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Step 4: Install Frontend Dependencies
```powershell
# In project root (where package.json lives)
npm install
```

---

## 3. Running the Application Locally

### Terminal 1: Start Backend API Server
```powershell
# In project root or backend directory
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API will be live at: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/health`

### Terminal 2: Start Frontend Development Server
```powershell
# In project root
npm run dev
```
- Vite Dev Server will launch at: `http://localhost:5173`

---

## 4. Running the Automated QA Test Suite
```powershell
# Run full suite (29 tests)
python -m pytest tests -v

# Run individual test files
python -m pytest tests/test_geometry.py -v
python -m pytest tests/test_soil_model.py -v
python -m pytest tests/test_comprehensive_api_e2e.py -v
```
All 29 tests must pass with 100% success rate.
