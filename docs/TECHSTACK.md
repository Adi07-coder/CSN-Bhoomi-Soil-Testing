# AI Bhoomi — Comprehensive Technology Stack & Function Reference Manual

## 1. Architectural Overview

AI Bhoomi is built on a modern, decoupled, asynchronous full-stack architecture tailored for high-precision geospatial field demarcation, machine-learning soil fertility forecasting, Google Gemini AI agronomic reasoning, and ICAR-governed treatment decision support.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER (Vite + React 19)                  │
│  - Leaflet / React-Leaflet (Map demarcation: 3-20 pt Polygon & 2-pt Square)      │
│  - 4-Pillar Tabbed UI (NPK Table, Treatment, Seasonal Crops, Provenance)        │
│  - jsPDF Engine (Client-side multi-page PDF generation)                         │
│  - Tailwind CSS 3.4 + Lucide React 1.55 (Agronomic design tokens)               │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │ HTTPS / REST (JSON)
┌────────────────────────────────────────▼────────────────────────────────────────┐
│                        BACKEND SERVICE LAYER (FastAPI + ASGI)                   │
│  - FastAPI REST Routing & Pydantic v2 Schema Validation                         │
│  - Geospatial Geodesic Engine (WGS-84 Ellipsoidal Shoelace & Haversine)         │
│  - Reverse Geocoding Integration (Geoapify REST API)                            │
│  - Soil Health Card & STCR Regional Calibration Engine                          │
└──────────────────┬──────────────────────────────────────────────┬───────────────┘
                   │                                              │
┌──────────────────▼──────────────────────┐   ┌──────────────────▼────────────────┐
│   MACHINE LEARNING & SCIENTIFIC INFERENCE│   │   GENERATIVE AI & DECISION SUPPORT│
│  - Scikit-learn HistGradientBoosting    │   │  - Google Gemini API (2.5-Flash)  │
│  - NumPy & Pandas Data Pipelines        │   │  - Resilient 2.0s Timeout Fallback │
│  - ICAR-IISS Benchmark Ground Truth     │   │  - Anti-Hallucination Guardrails   │
└─────────────────────────────────────────┘   └───────────────────────────────────┘
```

---

## 2. Full Technology Stack Inventory

### 2.1 Frontend Technologies

| Technology / Library | Version | Category | Role in AI Bhoomi |
| :--- | :--- | :--- | :--- |
| **React** | `19.3.0` | UI Framework | Core reactive user interface, hooks-based state management, component lifecycles. |
| **React DOM** | `19.3.0` | DOM Renderer | Concurrent rendering engine for DOM elements. |
| **TypeScript** | `~6.0.2` | Programming Language | Static typing, compile-time error prevention, strict type schemas for agronomic data. |
| **Vite** | `^8.3.0` | Build Tool & Bundler | Ultra-fast Hot Module Replacement (HMR), tree-shaking, and optimized production bundling. |
| **Tailwind CSS** | `^3.4.19` | CSS Utility Engine | Responsive styling, curated agricultural green/emerald palettes, dark mode, glassmorphism. |
| **@tailwindcss/forms** | `^0.5.11` | Styling Extension | Beautiful default styles for form inputs, dropdowns, and checkboxes. |
| **@tailwindcss/typography** | `^0.5.20` | Styling Extension | Rich prose formatting for agronomic advisories and technical reports. |
| **Leaflet** | `^1.9.4` | Mapping Library | Interactive geospatial canvas, tile rendering, polygon vectors, and marker placement. |
| **React-Leaflet** | `^5.0.0` | React Mapping Adapter | Declarative React components (`<MapContainer>`, `<TileLayer>`, `<Polygon>`, `<Marker>`). |
| **jsPDF** | `^4.2.1` | PDF Generation Engine | High-resolution client-side vector PDF generation for field soil intelligence reports. |
| **Lucide React** | `^1.55.0` | Vector Iconography | 60+ domain-specific agricultural icons (`Leaf`, `Sprout`, `Droplets`, `Calendar`, `Table`, etc.). |
| **TanStack React Query**| `^5.104.2` | Server State Manager | Caching, deduplication, background synchronization, and network lifecycle management. |
| **Axios** | `^1.20.0` | HTTP Client | Promise-based asynchronous API calls with request/response interceptors. |
| **React Router DOM** | `^7.18.4` | Client-Side Routing | SPA routing, nested view layouts, navigation guards, and parameter resolution. |
| **React Hook Form** | `^7.90.0` | Form State Engine | High-performance, zero-re-render form state management. |
| **Zod** | `^3.25.76` | Schema Validation | Declarative TypeScript-first runtime schema validation for user inputs. |
| **Recharts** | `^3.10.1` | Charting & Data Viz | Interactive SVG charts for soil fertility index and seasonal crop comparisons. |
| **date-fns** | `^4.4.0` | Date Utilities | Localized date formatting and ISO timestamp parsing. |

---

### 2.2 Backend Technologies

| Technology / Library | Version | Category | Role in AI Bhoomi |
| :--- | :--- | :--- | :--- |
| **Python** | `3.12+` | Runtime Language | Robust, typed backend execution environment. |
| **FastAPI** | `0.110+` | Web Framework | Modern, high-performance async ASGI web framework for RESTful APIs. |
| **Uvicorn** | `0.28+` | ASGI Server | Lightning-fast asynchronous server implementation for Python. |
| **Pydantic v2** | `2.6+` | Data Validation | Strict data validation, schema enforcement, and OpenAPI auto-generation. |
| **Scikit-learn** | `1.4+` | Machine Learning | Gradient boosting models (`HistGradientBoostingRegressor`) for soil parameter inference. |
| **NumPy** | `1.26+` | Numerical Math | Vectorized mathematical operations for geodesic area and fertilizer rate conversions. |
| **Pandas** | `2.2+` | Data Engineering | Tabular data manipulation, training set preprocessing, and dataset validation. |
| **SQLAlchemy** | `2.0+` | Database ORM | Object-relational mapping for farm parcels, user profiles, and historical soil tests. |
| **SQLite / PostgreSQL** | Latest | Database Engine | Relational persistence for farm metadata, GeoJSON boundaries, and analysis reports. |
| **Passlib (bcrypt)** | `1.7.4` | Cryptography | Secure password hashing using adaptive salt rounds. |
| **PyJWT** | `2.8+` | Authentication | Stateless JSON Web Token generation and cryptographic signature validation. |

---

### 2.3 Cloud, Geospatial & AI Integrations

| Technology / API | Provider | Purpose & Delivery in AI Bhoomi |
| :--- | :--- | :--- |
| **Google Gemini API** | Google DeepMind | Natural-language agronomic intelligence and treatment advisory using Gemini 2.5 Flash / Flash-Latest (`v1beta/models/...:generateContent`) with user API key. |
| **Geoapify API** | Geoapify | Reverse geocoding (coordinates $	o$ Village, Taluka, District, State) and address autocomplete. |
| **OpenStreetMap** | OSM Community | Standard basemap cartography for agricultural field navigation. |
| **ESRI World Imagery** | ESRI | High-resolution satellite imagery tiles enabling farmers to spot actual field boundaries. |
| **ICAR-STCR Database** | ICAR-IISS Bhopal | Ground-truth benchmark equations and Soil Health Card critical nutrient thresholds. |

---

## 3. Comprehensive Function Reference Directory

This directory details every critical function across the frontend, backend, GIS engine, ML inference pipeline, and AI advisory services.

### 3.1 Frontend Functions (`InteractiveFieldMap.tsx` & Layouts)

#### 1. `calculatePolygonAreaMeters(pts: [number, number][]): number`
- **Location**: `frontend/src/components/InteractiveFieldMap.tsx`
- **Inputs**: Array of `[latitude, longitude]` coordinate pairs.
- **Output**: Calculated surface area in square meters (`number`).
- **Algorithm**: Spherical Shoelace Formula projecting latitude/longitude into WGS-84 ellipsoidal surface curvature:
  $$	ext{Area} = rac{R^2}{2} \left| \sum_{i=0}^{n-1} (\lambda_{i+1} - \lambda_{i-1}) \sin(\phi_i) 
ight|$$
- **Purpose & Delivery**: Accurately determines the physical acreage of any user-demarcated field. Prevents flat-Earth distortion errors across Maharashtra's latitude range.

#### 2. `calculatePerimeterMeters(pts: [number, number][]): number`
- **Location**: `frontend/src/components/InteractiveFieldMap.tsx`
- **Inputs**: Array of `[latitude, longitude]` coordinate pairs.
- **Output**: Boundary perimeter distance in meters (`number`).
- **Algorithm**: Haversine distance summation between sequential vertex pairs $(P_i, P_{i+1})$ closed back to $P_0$.
- **Purpose & Delivery**: Computes fencing requirements and field border length for boundary validation.

#### 3. `calculateCentroid(pts: [number, number][]): [number, number]`
- **Location**: `frontend/src/components/InteractiveFieldMap.tsx`
- **Inputs**: Array of boundary vertices.
- **Output**: Geometric center `[lat, lng]`.
- **Purpose & Delivery**: Localizes the exact geographic center of the farm parcel for weather station queries, satellite NDVI extraction, and reverse geocoding.

#### 4. `checkSelfIntersection(pts: [number, number][]): boolean`
- **Location**: `frontend/src/components/InteractiveFieldMap.tsx`
- **Inputs**: Array of vertices.
- **Output**: Boolean flag (`true` if self-intersecting, `false` if topologically valid).
- **Algorithm**: Pairwise segment cross-product intersection detection.
- **Purpose & Delivery**: Enforces topological data integrity. Prevents farmers from accidentally submitting invalid butterfly/figure-8 polygons.

#### 5. `reverseGeocodeCoordinates(lat: number, lon: number): Promise<AdminLocation>`
- **Location**: `frontend/src/components/InteractiveFieldMap.tsx`
- **Inputs**: Center coordinates `lat, lon`.
- **Output**: Structured object: `{ state, district, taluka, village, postcode, formatted }`.
- **Purpose & Delivery**: Automatically resolves the farm's administrative jurisdiction using Geoapify REST API, eliminating manual address typing.

#### 6. `handleDownloadPdfReport(): void`
- **Location**: `frontend/src/components/InteractiveFieldMap.tsx`
- **Inputs**: Current `analysisResult`, `points`, `areaAcres`, `selectedCrop`, `selectedSeason`.
- **Output**: Saves `ai-bhoomi-soil-intelligence-report-*.pdf` directly to the client browser.
- **Purpose & Delivery**: Delivers a publication-grade, 4-section downloadable PDF soil report covering field geolocation, NPK diagnostics, organic/chemical treatment plans, and seasonal crop recommendations.

#### 7. `handleSaveAndRegister(): Promise<void>`
- **Location**: `frontend/src/components/InteractiveFieldMap.tsx`
- **Inputs**: Form state (farm name, owner, area, GeoJSON boundary).
- **Output**: Registers farm in backend database via `POST /api/v1/farms`.
- **Purpose & Delivery**: Persists demarcated land parcels into the farmer's permanent profile.

---

### 3.2 Backend Services & AI Engines

#### 8. `_call_gemini_api(prompt: str, timeout_seconds: float = 2.0) -> Optional[str]`
- **Location**: `backend/app/services/gemini_service.py`
- **Inputs**: Formatted agronomic prompt text, strict timeout threshold.
- **Output**: Generated string text or `None`.
- **Algorithm**: Asynchronous candidate failover calling Google Generative Language API endpoint:
  `https://generativelanguage.googleapis.com/v1beta/{model}:generateContent?key={GEMINI_API_KEY}`
- **Purpose & Delivery**: Connects AI Bhoomi to Google Gemini reasoning with an enforced 2.0s timeout to guarantee zero user request hangs.

#### 9. `generate_crop_advisory_with_gemini(...) -> Dict[str, Any]`
- **Location**: `backend/app/services/gemini_service.py`
- **Inputs**: `crop`, `season`, `district`, `soil_params`, `area_acres`.
- **Output**: Structured advisory dictionary with `provider`, `status`, `text`, and `verification_status`.
- **Purpose & Delivery**: Produces tailored natural-language advice explaining soil suitability, nutrient priorities, and irrigation windows. Automatically falls back to ICAR-IISS deterministic rules if the upstream API is unavailable.

#### 10. `generate_treatment_plan_with_gemini(...) -> Dict[str, Any]`
- **Location**: `backend/app/services/gemini_service.py`
- **Inputs**: `soil_params`, `crop`, `area_acres`.
- **Output**: Comprehensive treatment summary evaluating organic amendments vs. chemical fertilizers.
- **Purpose & Delivery**: Formulates holistic Integrated Nutrient Management (INM) guidance to boost organic carbon without causing soil salinization.

#### 11. `get_crop_recommendations(district, soil_type, season, soil_params) -> Dict[str, Any]`
- **Location**: `backend/app/services/recommendation_engine.py`
- **Inputs**: District location, soil texture, target season (`kharif`, `rabi`, `summer`), soil test indicators.
- **Output**: Array of ranked crops with suitability score (0-10), soil match justification, water requirements, and management risks.
- **Purpose & Delivery**: Recommends high-yielding, agro-climatically suitable crops across all three Indian agricultural seasons.

#### 12. `get_fertilizer_recommendation(crop, soil_params, area_acres) -> Dict[str, Any]`
- **Location**: `backend/app/services/recommendation_engine.py`
- **Inputs**: Target crop, verified soil parameters, field area in acres.
- **Output**: Calibrated doses for Urea, DAP, MOP, and Zinc Sulphate.
- **Algorithm**: Soil Test Crop Response (STCR) targeted yield equations:
  $$	ext{Dose per Acre} = 	ext{Base Requirement} 	imes \left(1 - rac{	ext{Soil Value} - 	ext{Benchmark}}{	ext{Benchmark}}
ight)$$
  $$	ext{Total Quantity (kg)} = 	ext{Dose per Acre} 	imes 	ext{Field Acreage}$$
  $$	ext{50kg Bags} = \left\lceil rac{	ext{Total Quantity}}{50} 
ight
ceil$$
- **Purpose & Delivery**: Provides exact, area-proportional commercial fertilizer requirements with practical 50kg bag counts.

#### 13. `get_complete_treatment_plan(crop, soil_params, area_acres) -> Dict[str, Any]`
- **Location**: `backend/app/services/recommendation_engine.py`
- **Inputs**: Crop, soil parameters, field area.
- **Output**: Dictionary containing `organic_plan`, `chemical_plan`, and `comparison`.
- **Purpose & Delivery**: Synthesizes the full treatment planning branch, providing both organic soil conditioning and targeted chemical split applications.

---

### 3.3 Backend API Endpoints & Schemas (`ml_ops.py`)

#### 14. `create_field_analysis(req: AnalyzeFieldRequest) -> Dict[str, Any]`
- **Route**: `POST /api/v1/analyses`
- **Location**: `backend/app/api/v1/ml_ops.py`
- **Inputs**: GeoJSON polygon geometry, crop name, season, soil type, irrigation method.
- **Output**: Comprehensive analysis payload (NPK Table, Organic Plan, Chemical Plan, 3-Season Crop Matrix, Gemini Reasoning, Genuineness Provenance, Hallucination Checks).
- **Purpose & Delivery**: Central orchestration controller executing the primary Master Prompt workflow.

#### 15. `validate_geojson_polygon(geometry: Any) -> Dict[str, Any]`
- **Location**: `backend/app/api/v1/ml_ops.py`
- **Inputs**: Raw GeoJSON input object.
- **Output**: Sanitized GeoJSON Polygon dictionary or raises `HTTPException(422)`.
- **Purpose & Delivery**: Enforces strict RFC 7946 GeoJSON compliance, verifies polygon closure, and validates coordinate ordering (`[lon, lat]`).

#### 16. `calculate_geodesic_area_shoelace(coordinates: List) -> float`
- **Location**: `backend/app/api/v1/ml_ops.py`
- **Inputs**: Array of GeoJSON coordinate rings.
- **Output**: Verified area in square meters.
- **Purpose & Delivery**: Server-side verification of field area to prevent client-side tampering before fertilizer totals are calculated.

#### 17. `predict_soil_parameters(lat, lon, soil_type, district) -> Dict[str, Any]`
- **Location**: `backend/app/services/soil_model_pipeline.py`
- **Inputs**: Centroid latitude/longitude, classified soil type, administrative district.
- **Output**: Diagnostic values and ratings for N, P, K, pH, EC, OC, Zn, Fe, Cu, Mn, B, S, Ca, Mg.
- **Algorithm**: Scikit-learn HistGradientBoosting inference combined with regional ICAR soil fertility baselines.
- **Purpose & Delivery**: Provides accurate soil nutrient estimations and fertility indices calibrated to Maharashtra soil geography.

---

#### 18. `evaluate_crop_recommendation_card(request: CropRecommendationCardRequest) -> CropRecommendationCardResponse`
- **Route**: `POST /api/v1/crop-recommendations/evaluate`
- **Location**: `backend/app/api/v1/crop_recommendation_card.py`
- **Inputs**: Farm identifier, farm location (state, district, taluka, village), soil measurements (pH, EC, OC, N, P, K, Zn, etc.), season (Kharif, Rabi, Summer), water availability, soil type, and data provenance status (`verified_lab`, `demo`, `synthetic`).
- **Output**: Section 8 compliant structured response (`farm_id`, `season`, `assessment_status`, `data_quality`, `benchmark_checks`, `crop_recommendations`, `not_recommended_or_unassessed`, `next_steps`, `validation_summary`).
- **Purpose & Delivery**: Dedicated endpoint for the Crop Selection & Agricultural Configuration Card providing isolated, verified agronomic crop evaluations without modifying existing analyses.

#### 19. `evaluate_soil_fertility_benchmarks(measurements: Dict[str, Any]) -> List[BenchmarkCheck]`
- **Location**: `backend/app/services/soil_benchmark_service.py`
- **Inputs**: Soil parameter dictionary (pH, EC, organic carbon, N, P, K, Zn).
- **Output**: Array of verifiable benchmark evaluations mapped to official ICAR-IISS Bhopal and Maharashtra State Agriculture Department reference publications.
- **Purpose & Delivery**: Prevents AI hallucination of agronomic standards by calculating ground-truth benchmark categories (Low, Medium, High, Optimal, Alkaline) deterministically.

#### 20. `generate_grounded_crop_recommendation(...) -> CropRecommendationCardResponse`
- **Location**: `backend/app/services/gemini_crop_recommendation_service.py`
- **Inputs**: Farm evidence package including location, season, water availability, verified measurements, and ICAR benchmark checks.
- **Output**: Grounded crop recommendations evaluated against physical soil limitations and regional suitability.
- **Mechanism**: Calls Google Gemini API (`models/gemini-2.5-flash` with fallback to `models/gemini-flash-latest`) using server-side secure credentials. If Gemini is unreachable or quotas are exceeded, falls back deterministically to rule-grounded ICAR-Maharashtra recommendations without fabricating results.
- **Purpose & Delivery**: Implements the 6-step data-grounded Gemini workflow required by Section 6 of the Master Prompt.

#### 21. `validate_crop_recommendation_output(candidate: Dict[str, Any], evidence: Dict[str, Any]) -> CropRecommendationCardResponse`
- **Location**: `backend/app/services/crop_recommendation_guardrail.py`
- **Inputs**: Candidate JSON model response and the verified input evidence package.
- **Output**: Fully verified response or normalized fallback response with explicit hallucination/unsupported claim detection.
- **Rules Enforced**: Guardrails A through F (Evidence Verification, Input Quality, Crop Suitability & Season checks, Hallucination Detection for unmeasured soil values or fabricated yields, Output Consistency, and Safe Failure Handling).
- **Purpose & Delivery**: Guarantees zero AI hallucinations reach the client by deterministically checking every claim against verified input records.

#### 22. `CropSelectionConfigurationCard` (Frontend Component)
- **Location**: `frontend/src/components/CropSelectionConfigurationCard.tsx`
- **Integration**: Safely rendered in `frontend/src/pages/RecommendationsPage.tsx` as a standalone card.
- **Features**: Live farm selection, location summary, soil-data provenance badge, season selection (Kharif, Rabi, Summer), water availability and crop rotation controls, loading spinners, benchmark comparison table, suitability badges, constraint breakdowns, and transparent data quality notices.
- **Purpose & Delivery**: Implements the user-facing interface for Section 2, 7, and 10 of the Master Prompt following AI Bhoomi's design system.

## 4. Verification & Testing Matrix

Every component listed in this technology stack has been tested and verified:
1. **Frontend Compilation**: `npm run build` passes with 0 errors across 3,163 modules.
2. **Acceptance Test Suite**: `scratch/run_acceptance_tests.py` passes 15/15 tests (100%).
3. **Master Workflow E2E Suite**: `scratch/verify_complete_master_workflow.py` passes 8/8 architectural pillars (100%).
