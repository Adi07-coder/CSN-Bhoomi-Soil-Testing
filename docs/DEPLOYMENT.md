# AI Bhoomi — Deployment & Setup Guide

## 1. Prerequisites
- **Node.js** 18+ and **npm** 9+
- **Python** 3.11+
- **Docker** and **Docker Compose** (for PostgreSQL + PostGIS containerization)

---

## 2. Local Environment Setup

### 2.1 Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Linux / macOS:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment configuration:
   ```bash
   cp ../.env.example .env
   ```
5. Start the backend API service:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### 2.2 Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the web application at `http://localhost:5173`.

---

## 3. Docker Compose Deployment
To run both backend and PostgreSQL containerized:
```bash
docker compose up -d --build
```
- PostgreSQL / PostGIS will be available on port `5432`.
- FastAPI backend on port `8000`.

---

## 4. Running Automated Tests
Run unit and integration tests from the root or `backend` folder:
```bash
pytest backend/tests/ -v
```

---

## 5. Seed Demonstration Data
To populate sample Maharashtra farms, soil samples, and satellite acquisitions:
```bash
python scripts/seed_demo_data.py
```
Default demo login credentials:
- **Email**: `farmer@aibhoomi.in`
- **Password**: `Farmer@123`
