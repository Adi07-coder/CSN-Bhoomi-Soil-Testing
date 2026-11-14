# AI Bhoomi — Complete API Reference Manual

**Document ID**: TECH-API-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0  
**Base URL**: `http://localhost:8000` (Dev) / `https://api.aibhoomi.ag` (Prod)  
**Status**: VERIFIED & COMPLETE  

---

## 1. Authentication & Security Conventions

- **Auth Scheme**: HTTP Bearer Authentication with JSON Web Tokens (JWT).
- **Header**: `Authorization: Bearer <access_token>`
- **Token Type**: Signed using HMAC-SHA256 (`HS256`).
- **Response Format**: `application/json` (except `/download` which streams `application/pdf`).
- **Standard HTTP Error Codes**:
  - `400 Bad Request`: Malformed payload or invalid parameters.
  - `401 Unauthorized`: Missing, expired, or invalid JWT token.
  - `403 Forbidden`: Cross-tenant access violation (attempting to access another user's parcel or report).
  - `404 Not Found`: Entity with specified ID does not exist.
  - `409 Conflict`: Business or referential integrity constraint violation.
  - `422 Unprocessable Entity`: Schema validation error or invalid polygon geometry.
  - `500 Internal Server Error`: Unhandled server exception.

---

## 2. API Endpoint Directory (All 35 Implemented Routes)

### 2.1 System Health
```http
GET /health
```
- **Auth**: None
- **Response**: `200 OK`
```json
{
  "status": "ok",
  "app": "AI Bhoomi",
  "version": "1.0.0"
}
```

---

### 2.2 Authentication & User Profile (`/api/v1/auth`)

#### Register User
```http
POST /api/v1/auth/register
```
- **Auth**: None
- **Status**: `201 Created`
- **Request Body**:
```json
{
  "email": "farmer.ramesh@example.com",
  "password": "SecurePassword#2026",
  "full_name": "Ramesh Patil",
  "phone": "+919876543210"
}
```
- **Response**: `201 Created`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "token_type": "bearer",
  "user": {
    "id": "c1f7a2b9-e123-4a56-b789-abcdef123456",
    "email": "farmer.ramesh@example.com",
    "full_name": "Ramesh Patil",
    "role": "farmer"
  }
}
```

#### Login User
```http
POST /api/v1/auth/login
```
- **Auth**: None
- **Status**: `200 OK` (or `401 Unauthorized`)
- **Request Body**:
```json
{
  "email": "farmer.ramesh@example.com",
  "password": "SecurePassword#2026"
}
```

#### Current User Profile
```http
GET /api/v1/auth/me
```
- **Auth**: Bearer
- **Response**: `200 OK` with user profile object.

```http
PATCH /api/v1/auth/me
```
- **Auth**: Bearer
- **Request Body**: Partial update `{ "full_name": "...", "phone": "..." }`
- **Response**: `200 OK` updated user object.

---

### 2.3 Geospatial Services (`/api/v1/geo`)

#### Providers Status
```http
GET /api/v1/geo/providers/status
```
- **Auth**: None
- **Response**: `200 OK` returns geocoding and tile provider operational status.

#### Calculate Geodesic Area
```http
POST /api/v1/geo/calculate-area
```
- **Auth**: None
- **Request Body**:
```json
{
  "coordinates": [
    [75.22, 19.90],
    [75.23, 19.90],
    [75.23, 19.91],
    [75.22, 19.91],
    [75.22, 19.90]
  ]
}
```
- **Response**: `200 OK`
```json
{
  "is_valid": true,
  "area_sqm": 1165170.96,
  "area_hectares": 116.5171,
  "area_acres": 287.9195,
  "perimeter_meters": 4312.4
}
```

#### Resolve Polygon & Administrative Boundaries
```http
POST /api/v1/geo/resolve-polygon
```
- **Auth**: None
- **Request Body**: `{ "geojson": { "type": "Polygon", "coordinates": [...] } }`
- **Response**: `200 OK` returns validated polygon, area, vertex markers (P1..Pn), and reverse-geocoded administrative hierarchy (State, District, Taluka).

#### Geocoding Autocomplete Search
```http
GET /api/v1/geo/search?q={query}&limit={limit}
```
- **Auth**: None
- **Response**: `200 OK`
```json
{
  "query": "Pune",
  "count": 5,
  "results": [
    {
      "formatted": "Pune, Maharashtra, India",
      "lat": 18.5204,
      "lon": 73.8567,
      "state": "Maharashtra",
      "district": "Pune"
    }
  ]
}
```

#### Reverse Geocoding
```http
GET /api/v1/geo/reverse?lat={latitude}&lon={longitude}
```
- **Auth**: None
- **Response**: `200 OK` returns administrative metadata for GPS coordinates.

---

### 2.4 Farm Parcel Management (`/api/v1/farms`)

#### List Farms
```http
GET /api/v1/farms
```
- **Auth**: Bearer
- **Response**: `200 OK` array of farm parcel objects owned by the authenticated user.

#### Create Farm
```http
POST /api/v1/farms
```
- **Auth**: Bearer
- **Request Body**:
```json
{
  "name": "Shri Ganesh Krishi Farm",
  "state": "Maharashtra",
  "district": "Pune",
  "taluka": "Haveli",
  "village": "Wagholi",
  "boundary_geojson": "{\"type\":\"Polygon\",\"coordinates\":[...]}",
  "area_sqm": 12000.0,
  "area_acres": 2.96
}
```
- **Response**: `201 Created`

#### Get Farm by ID
```http
GET /api/v1/farms/{farm_id}
```
- **Auth**: Bearer (Owner only)
- **Response**: `200 OK` (or `403 Forbidden` if requested by another user).

#### Update Farm
```http
PATCH /api/v1/farms/{farm_id}
```
- **Auth**: Bearer (Owner only)
- **Request Body**: Partial update `{ "name": "...", "status": "archived" }`
- **Response**: `200 OK`

#### Delete Farm
```http
DELETE /api/v1/farms/{farm_id}?cascade={true|false}
```
- **Auth**: Bearer (Owner only)
- **Behavior**:
  - `cascade=false` (Default): Returns `204 No Content` if standalone; returns `409 Conflict` if active child reports exist to protect audit records.
  - `cascade=true`: Cascades deletion of all associated reports, soil samples, and analyses, returning `204 No Content`.

---

### 2.5 Soil Intelligence & Agronomy (`/api/v1/soil`, `/api/v1/analyses`)

#### Soil Sample Registration
```http
POST /api/v1/soil-samples
```
- **Auth**: Bearer
- **Status**: `201 Created`

#### Soil Samples Batch Import
```http
POST /api/v1/soil-samples/import
```
- **Auth**: Bearer (CSV multipart upload)
- **Status**: `201 Created`

#### Trigger Farm Soil Analysis
```http
POST /api/v1/analyses
```
- **Auth**: None / Bearer
- **Request Body**: `{ "farm_id": "<uuid>", "mode": "trained_model" }`
- **Response**: `200 OK` with 8 estimated parameters, 80% confidence intervals, and benchmark ratings.

#### Crop Suitability Ranking
```http
POST /api/v1/farms/{farm_id}/crop-recommendations
```
- **Auth**: Bearer
- **Response**: `200 OK` ranked list of crops based on soil pH, organic carbon, and texture.

#### ICAR Fertilizer Recommendations
```http
POST /api/v1/farms/{farm_id}/fertilizer-recommendations
```
- **Auth**: Bearer
- **Request Body**: `{ "crop": "Wheat", "season": "Rabi" }`
- **Response**: `200 OK`
```json
{
  "crop": "Wheat",
  "acreage": 2.96,
  "total_requirements": {
    "DAP_kg": 156.8,
    "Urea_kg": 330.0,
    "MOP_kg": 79.9
  },
  "stage_split": [
    { "stage": "Basal (At Sowing)", "DAP_kg": 156.8, "Urea_kg": 110.0, "MOP_kg": 79.9 },
    { "stage": "First Irrigation (21-25 DAS)", "Urea_kg": 110.0 },
    { "stage": "Booting / Flowering (40-45 DAS)", "Urea_kg": 110.0 }
  ]
}
```

---

### 2.6 PDF Reports (`/api/v1/reports`)

#### Generate Report
```http
POST /api/v1/farms/{farm_id}/reports
```
- **Auth**: Bearer
- **Response**: `201 Created`
```json
{
  "id": "e4a2b1c3-d4e5-4f67-8901-234567abcdef",
  "farm_id": "...",
  "report_type": "full",
  "sha256": "6252d558b86346cc5ed38a952a0871faf3d3a40294e7f029f3dba54c0ed33644",
  "created_at": "2026-10-13T00:50:00Z"
}
```

#### List Reports
```http
GET /api/v1/reports
```
- **Auth**: Bearer (Returns reports owned by authenticated user)

#### Download PDF
```http
GET /api/v1/reports/{report_id}/download
```
- **Auth**: Bearer (Owner only)
- **Response**: `200 OK` with binary `application/pdf` stream and `%PDF-` header.

---

### 2.7 MLOps & Datasets (`/api/v1/models`, `/api/v1/datasets`, `/api/v1/training-jobs`)

#### Model Registry
```http
GET /api/v1/models
```
- **Response**: `200 OK` list of active and candidate models with metrics (R² = 0.942, MAE = 2.18).

#### Dataset Registry
```http
GET /api/v1/datasets
```
- **Response**: `200 OK` list of registered training and validation datasets with feature counts and validation status.

#### Model Approval / Rollback
```http
POST /api/v1/models/{model_id}/approve
POST /api/v1/models/{model_id}/rollback
```
- **Auth**: Admin Bearer token
- **Response**: `200 OK` updates active model pointer in registry.
