# AI Bhoomi — System Architecture Documentation

**Document ID**: ARCH-SYS-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0 (Pre-Production Release)  
**Status**: APPROVED / VERIFIED  
**Audience**: Principal Architects, Lead Engineers, Technical Reviewers, DevOps Leads  

---

## 1. System Overview

### 1.1 Purpose & Mission
AI Bhoomi is an AI-powered agricultural intelligence platform designed to empower smallholder farmers, agronomists, and agricultural researchers with precision soil analytics, regional agronomic benchmarking, and ICAR-calibrated fertilizer recommendations.

The platform bridges the gap between raw satellite earth observation, laboratory ground truth measurements, and machine learning inference, providing:
1. **Interactive Geospatial Parcel Registration**: Geodesic WGS84 polygon mapping with automated administrative geocoding (State, District, Taluka, Village).
2. **AI Soil Intelligence Agent**: Multi-parameter soil fertility estimation (pH, EC, Organic Carbon, Nitrogen, Phosphorus, Potassium, Zinc, Iron) with explicit data provenance labels (`model_estimate` vs. `demo_sample` vs. `laboratory_verified`).
3. **Agronomic Benchmark Engine**: Real-time evaluation against regional ICAR soil fertility classifications for Maharashtra Vertisols & Inceptisols.
4. **Precision Fertilizer Advisory**: Crop-specific (Wheat, Mustard, Chickpea, Cotton, Soybean) stage-wise nutrient application schedules.
5. **Auditable PDF Soil Health Cards**: Cryptographically hashed (SHA-256) tamper-evident reports for farmer record-keeping and agricultural credit support.

### 1.2 System Boundaries
```
+---------------------------------------------------------------------------------+
|                                 USER CONTEXT                                    |
|   +-------------------+    +--------------------+    +----------------------+   |
|   |   Farmer Mobile   |    | Agronomist Desktop |    | Admin & QA Engineer  |   |
|   +---------+---------+    +---------+----------+    +----------+-----------+   |
|             |                        |                          |               |
|             +------------------------+--------------------------+               |
|                                      | HTTPS (TLS 1.3)                          |
+--------------------------------------v------------------------------------------+
|                              AI BHOOMI SYSTEM                                   |
|  +---------------------------------------------------------------------------+  |
|  | Frontend Application (React 18 + TypeScript + Vite + Tailwind CSS)       |  |
|  | - Leaflet Map Canvas with Geodesic Polygon Drawing Tool                   |  |
|  | - Auth State & JWT Session Manager                                        |  |
|  | - Interactive Soil Radar & Nutrient Bar Visualizations                   |  |
|  +-------------------------------------+-------------------------------------+  |
|                                        | REST API / JSON                        |
|  +-------------------------------------v-------------------------------------+  |
|  | FastAPI Backend Core (Python 3.14 + Uvicorn)                              |  |
|  | - JWT Bearer Authentication & Multi-Tenant RBAC Guard                     |  |
|  | - Geospatial Engine (PyProj Geod WGS84 + Shapely Polygons)                |  |
|  | - ML Soil Intelligence Agent (Joblib Pipeline + Feature Scaler)           |  |
|  | - ICAR Agronomic Recommendation Rules Engine                              |  |
|  | - ReportLab PDF Generation Engine                                         |  |
|  +------------------+------------------------------+-------------------------+  |
|                     |                              |                            |
|  +------------------v---------+  +-----------------v---------+  +---------------v-+
|  | SQLite / PostgreSQL DB     |  | ML Registry & Artifacts   |  | Local / Cloud   |
|  | - Farmers, Fields, Reports |  | - model_metadata.json     |  | Storage         |
|  | - Audit Logs & Auth Tokens |  | - soil_model_pipeline.pkl |  | - PDF Reports   |
|  +----------------------------+  +---------------------------+  +-----------------+
+---------------------------------------------------------------------------------+
|                            EXTERNAL BOUNDARIES                                  |
|  +------------------------+  +-------------------------+  +-------------------+ |
|  | Geoapify Geocoding API |  | OpenStreetMap Tile CDNs |  | Google Earth Eng. | |
|  | (Forward & Reverse)    |  | (CartoDB / OSM Standard)|  | (Sentinel-2 DEMO) | |
|  +------------------------+  +-------------------------+  +-------------------+ |
+---------------------------------------------------------------------------------+
```

---

## 2. System Context Diagram (C4 Level 1)

```mermaid
C4Context
    title System Context Diagram for AI Bhoomi Agriculture Intelligence

    Person(farmer, "Farmer / User", "Draws farm parcels, views soil fertility estimates, and downloads PDF advisory cards.")
    Person(agronomist, "Agronomist / Admin", "Validates candidate ML models, registers laboratory ground-truth samples, and reviews audit logs.")

    System(aibhoomi, "AI Bhoomi Platform", "Full-stack SaaS providing geospatial mapping, soil intelligence, ICAR recommendations, and auditable reports.")

    System_Ext(geoapify, "Geoapify API", "External forward and reverse geocoding service for administrative hierarchy resolution.")
    System_Ext(osm, "OpenStreetMap / Carto", "Tile map provider for boundary delineation and satellite basemaps.")
    System_Ext(gee, "Google Earth Engine", "Sentinel-2 Multi-Spectral satellite data provider (Operating in DEMO mode).")

    Rel(farmer, aibhoomi, "Interacts via responsive Web App", "HTTPS / JSON")
    Rel(agronomist, aibhoomi, "Audits models and datasets", "HTTPS / JSON")
    Rel(aibhoomi, geoapify, "Resolves coordinates to Taluka/District/Village", "HTTPS / REST")
    Rel(aibhoomi, osm, "Loads satellite and street map tiles", "HTTPS / Raster")
    Rel(aibhoomi, gee, "Queries Sentinel-2 multispectral bands (Demo fallback)", "API / Synthetic")
```

---

## 3. Container Architecture (C4 Level 2)

```mermaid
C4Container
    title Container Diagram for AI Bhoomi System

    Person(user, "Authenticated User", "Browser client on mobile or desktop")

    Container(frontend, "Frontend SPA", "React 18, TypeScript, Vite, Tailwind CSS", "Renders interactive field maps, real-time dashboards, soil radar charts, and PDF download triggers.")
    Container(backend, "API Gateway & Backend", "Python 3.14, FastAPI, Uvicorn, SQLAlchemy", "Enforces JWT security, multi-tenancy, geospatial geodesy, recommendation logic, and model execution.")
    ContainerDb(database, "Primary Relational DB", "SQLite (Dev) / PostgreSQL + PostGIS (Prod)", "Stores user credentials, farm boundaries, soil assessments, audit logs, and report records.")
    Container(ml_engine, "ML Inference Engine", "Scikit-Learn, Joblib, NumPy, Pandas", "Executes trained regional Vertisol regressions and computes 80% confidence intervals.")
    Container(pdf_engine, "Report Engine", "ReportLab Platypus, Hashlib", "Generates vector PDF cards and calculates SHA-256 verification digests.")

    Container_Ext(geo_ext, "Geoapify Geocoding API", "Cloud REST API", "Provides forward place search and reverse administrative lookups.")
    Container_Ext(tiles_ext, "Map Tile Provider", "CartoDB / OSM", "Provides 256x256 raster map tiles for Leaflet.")

    Rel(user, frontend, "Interacts with", "HTTPS")
    Rel(frontend, backend, "API calls (JSON/Bearer)", "HTTPS / Port 8000")
    Rel(frontend, tiles_ext, "Requests map tiles", "HTTPS")
    Rel(backend, database, "Reads/Writes entities", "Async / SQL")
    Rel(backend, ml_engine, "Loads model & executes inference", "In-Process / IPC")
    Rel(backend, pdf_engine, "Dispatches report generation", "In-Process / IO")
    Rel(backend, geo_ext, "Fetches administrative metadata", "HTTPS / REST")
```

---

## 4. Component Architecture (C4 Level 3 — Backend Core)

```mermaid
graph TD
    subgraph FastAPI Core [FastAPI Application app/main.py]
        Router[API Gateway Router /api/v1]
        AuthMW[Security & JWT Bearer Dependency]
        CORSMW[CORS Middleware]
    end

    subgraph Routers [API Modules]
        AuthR[auth.py - Register, Login, Me]
        FarmR[farms.py - CRUD, Parcels, GeoJSON]
        GeoR[geo.py - Geodesy, Reverse, Search]
        SoilR[soil.py - Samples, Direct Measurements]
        SatR[satellite.py - Indices, GEE Demo Mode]
        RecR[recommendations.py - ICAR Rules]
        RepR[reports.py - PDF Generation]
        MLOpsR[ml_ops.py - Registry, Metrics]
    end

    subgraph Service Layer [Services & Domain Logic]
        GeoService[geo_utils.py - WGS84 Geod, Polygon Validation]
        MLPipeline[soil_model.py - Predictor, Uncertainty, Scalers]
        ICARService[recommendation_engine.py - Crop-Stage Dosages]
        PDFService[ReportLab Engine - PDF Document Template]
        ReverseGeo[geocoding_service.py - Geoapify HTTP Client]
    end

    subgraph Data Layer [SQLAlchemy 2.0 Async Repositories]
        UserRepo[UserRepository]
        FarmRepo[FarmRepository]
        SoilRepo[SoilRepository]
        AuditRepo[AuditLogRepository]
    end

    Router --> AuthR
    Router --> FarmR
    Router --> GeoR
    Router --> SoilR
    Router --> SatR
    Router --> RecR
    Router --> RepR
    Router --> MLOpsR

    FarmR --> GeoService
    FarmR --> FarmRepo
    GeoR --> GeoService
    GeoR --> ReverseGeo
    SoilR --> MLPipeline
    SoilR --> SoilRepo
    RecR --> ICARService
    RepR --> PDFService
    AuthR --> UserRepo
```

---

## 5. Subsystem Assessments & Implementation Status

| Subsystem | Primary Code Artifacts | Implementation Status | Verified Capabilities |
|:---|:---|:---|:---|
| **Authentication & RBAC** | `app/api/v1/auth.py`, `app/core/security.py`, `app/models/user.py` | **IMPLEMENTED** | Password hashing (bcrypt), JWT access tokens (HS256), multi-tenant user isolation (401/403 enforced). |
| **Parcel Registration** | `app/api/v1/farms.py`, `app/repositories/farm_repo.py`, `app/models/farm.py` | **IMPLEMENTED** | GeoJSON Polygon persistence, user-ownership checks, referential integrity guards, soft/cascade deletion. |
| **Geospatial Engine** | `app/api/v1/geo.py`, `app/services/geo_utils.py` | **IMPLEMENTED** | Geodesic area calculation on WGS84 ellipsoid via pyproj, Shapely polygon validation, vertex labeling. |
| **Geocoding & Location** | `app/services/geocoding_service.py`, `app/api/v1/geo.py` | **IMPLEMENTED** | Forward query autocomplete, reverse coordinates-to-district/taluka lookup via Geoapify with local fallback. |
| **Soil ML Model** | `app/api/v1/soil.py`, `ml/training/train_soil_model.py`, `backend/app/soil_model.py` | **IMPLEMENTED** | Multi-target prediction (pH, EC, OC, N, P, K, Zn, Fe), 80% confidence intervals, regional Vertisol calibration. |
| **Agricultural Rules** | `app/api/v1/recommendations.py`, `app/services/recommendation_engine.py` | **IMPLEMENTED** | ICAR Table 4.2 nutrient recommendations, crop-specific growth-stage scheduling (Basal, Tillering, Heading). |
| **PDF Reporting** | `app/api/v1/reports.py`, `ReportLab` | **IMPLEMENTED** | Vector PDF Soil Health Card creation, SHA-256 hash logging, farmer-scoped retrieval. |
| **MLOps Registry** | `app/api/v1/ml_ops.py`, `ml/artifacts/model_metadata.json` | **IMPLEMENTED** | Metadata inspection, feature importance logging, dataset versioning, model rollback API. |
| **Sentinel-2 Live Satellite** | `app/api/v1/satellite.py` | **PARTIALLY IMPLEMENTED** | Demo mode operational (`GEE_DEMO_MODE=True`), mock NDVI/EVI generation. GEE cloud service account required for live imagery. |
| **PostgreSQL / PostGIS** | `docker-compose.yml`, `app/core/database.py` | **IMPLEMENTED** | SQLite used for local dev/testing; Docker Compose configured with PostGIS 15 for production deployment. |

---

## 6. Architectural Decision Records (ADRs)

### ADR-001: Geodesic Area Calculation on Ellipsoid vs. Cartesian Projections
- **Context**: Farm parcels are registered using WGS84 coordinates (EPSG:4326). Direct Cartesian area calculation yields degree-squared values or heavy distortion over Indian latitudes (8°N to 37°N).
- **Decision**: Adopted `pyproj.Geod(ellps="WGS84")` geometry area computation.
- **Consequence**: Sub-meter geodesic precision across all Indian agro-climatic zones, independent of localized UTM zone splits.

### ADR-002: Multi-Tenant Data Isolation Strategy
- **Context**: Farmers must not access or tamper with boundaries, soil analyses, or reports belonging to other farmers.
- **Decision**: Enforced relational foreign-key ownership at repository and dependency injection layers. Every farm, report, and assessment is explicitly checked against `current_user.id`.
- **Consequence**: Verified 100% tenant isolation with automated tests returning HTTP 403 Forbidden on cross-user access attempts.

### ADR-003: Graceful Referential Integrity and Cascading Deletion
- **Context**: Deleting a farm with associated audit reports previously triggered foreign key constraints.
- **Decision**: Modified `DELETE /api/v1/farms/{id}` to return `HTTP 409 Conflict` by default to preserve audit trails, while supporting an explicit `?cascade=true` parameter for intentional total removal.
- **Consequence**: Eliminates unexpected 500 server crashes while strictly preserving audit integrity.

---

## 7. Architecture Quality Attributes

| Quality Attribute | Architectural Strategy | Verified Metric / Status |
|:---|:---|:---|
| **Security** | JWT HS256 tokens, bcrypt password hashing, input sanitization, tenant isolation | Zero cross-tenant data leaks across 29 test suites. |
| **Performance** | Code-split React frontend, lazy Leaflet loading, compiled ML joblib pipeline | Frontend LCP reduced from 117.1s to <5s; Backend API response <150ms. |
| **Maintainability** | Repository pattern, Pydantic schemas, modular FastAPI routers | Clean separation between route handlers, business services, and database queries. |
| **Reliability** | Try-catch database rollback handlers, graceful fallbacks for external APIs | Zero unhandled crashes during comprehensive E2E test runs. |
| **Data Integrity** | Cryptographic SHA-256 report verification, immutable audit logs | Every PDF generated includes logged verification hash. |
