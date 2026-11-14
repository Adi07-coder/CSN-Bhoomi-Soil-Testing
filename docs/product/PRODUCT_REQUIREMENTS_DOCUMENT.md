# AI Bhoomi — Product Requirements Document (PRD)

**Document ID**: PRD-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0  
**Status**: APPROVED  
**Owner**: Product Management & Agronomy Solutions Lead  

---

## 1. Executive Summary & Product Vision

### 1.1 Problem Statement
Smallholder farmers across India face declining crop productivity, escalating fertilizer input costs, and soil degradation due to imbalanced chemical fertilizer application. Traditional government and private soil testing laboratories face severe logistical bottlenecks:
- Turnaround times often exceed 3 to 6 weeks.
- Physical testing density is less than 1 test per 10 hectares.
- Soil health cards lack dynamic, actionable, stage-wise agronomic guidance.

### 1.2 Vision
AI Bhoomi transforms precision agriculture by combining satellite observation, localized machine learning inference, and interactive GIS to deliver instant, field-specific soil health intelligence, ICAR-aligned fertilizer advisories, and auditable PDF Soil Health Cards directly to farmers' mobile and desktop devices.

---

## 2. Target Users & Personas

| Persona | Role | Primary Goal | Key Frustration |
|:---|:---|:---|:---|
| **Ramesh Patil** | Smallholder Farmer (Nashik, 3.2 acres) | Know exact fertilizer dosages for Wheat crop to reduce costs and avoid soil salinity. | Lab soil test results arrive long after planting season. |
| **Dr. Sunita Kulkarni** | Regional Agronomist & Extension Officer | Audit farm soil fertility trends across Talukas and review recommendation accuracy. | Inconsistent data collection formats and unverified synthetic claims. |
| **Pooja Shinde** | Agricultural Credit / Insurance Officer | Verify farm boundary delineation and soil viability for seasonal crop loans. | Risk of fraudulent or duplicate land registration without audit trails. |

---

## 3. Product Goals & Business Value

1. **Instant Turnaround**: Reduce soil assessment delivery time from weeks to under 5 seconds.
2. **Input Cost Optimization**: Reduce unneeded DAP and Urea overuse by 15–25% via targeted split dosing.
3. **Auditability**: Provide tamper-evident SHA-256 soil certificates for credit and government compliance.
4. **Data Transparency**: Explicitly distinguish demo samples, model estimates, and verified lab tests to maintain scientific credibility.

---

## 4. Requirements Specification

### 4.1 Functional Requirements (FR)

| Req ID | Title | Description | Priority | Status | Acceptance Criteria |
|:---|:---|:---|:---|:---|:---|
| **FR-001** | Account Registration & JWT Auth | Farmers register with name, email, password, and receive secure JWT tokens. | P0 | **IMPLEMENTED** | Password hashed with bcrypt; access blocked without valid Bearer token. |
| **FR-002** | Interactive Parcel Drawing | Farmers draw farm boundaries on a Leaflet map with vertex snapping and closing. | P0 | **IMPLEMENTED** | Map supports polygon creation; displays vertex markers P1..Pn; validates non-self-intersection. |
| **FR-003** | Geodesic Area Calculation | System computes authoritative area in square meters, acres, and hectares. | P0 | **IMPLEMENTED** | Area calculated via WGS84 pyproj ellipsoid; accuracy within +/-2% of geodesic truth; returns `is_valid: true`. |
| **FR-004** | Administrative Autofill | Reverse geocodes polygon centroid to State, District, Taluka, and Village. | P1 | **IMPLEMENTED** | Auto-populates administrative inputs using Geoapify API with local fallbacks. |
| **FR-005** | Multi-Tenant Farm Isolation | Farmers can only view, edit, or delete parcels owned by their authenticated account. | P0 | **IMPLEMENTED** | Requesting another user's parcel returns HTTP 403 Forbidden. |
| **FR-006** | AI Soil Fertility Estimation | Generates estimates for pH, EC, OC, N, P, K, Zn, Fe calibrated to regional Vertisols. | P0 | **IMPLEMENTED** | Predicts 8 parameters with 80% confidence intervals and explicit `model_estimate` provenance label. |
| **FR-007** | ICAR Benchmark Comparison | Classifies soil parameters against ICAR thresholds (Low, Medium, High). | P0 | **IMPLEMENTED** | Matches ICAR Table 4.2 ranges (e.g., OC < 0.5% = Low; Available N < 280 kg/ha = Low). |
| **FR-008** | Stage-Wise Fertilizer Advisory | Calculates DAP, Urea, and MOP dosages per acre split across crop growth stages. | P0 | **IMPLEMENTED** | Generates Basal, Tillering, and Heading splits for Wheat, Mustard, and Chickpea. |
| **FR-009** | Auditable PDF Soil Card | Compiles parcel boundary, soil metrics, and advisory into a downloadable PDF. | P0 | **IMPLEMENTED** | Valid `%PDF-` binary with SHA-256 hash digest and agronomist disclaimer. |
| **FR-010** | Cascade Deletion Management | Deleting a farm with reports is blocked by default or cascaded when requested. | P1 | **IMPLEMENTED** | Returns HTTP 409 Conflict if reports exist; cascades cleanly with `?cascade=true`. |
| **FR-011** | Live Sentinel-2 Integration | Ingests real-time optical multispectral bands (B4, B8) from Google Earth Engine. | P2 | **PARTIAL (DEMO)** | Operating in `GEE_DEMO_MODE=True` with simulated NDVI/EVI pending service account key. |

### 4.2 Non-Functional Requirements (NFR)

| Req ID | Category | Target Metric | Verified Status |
|:---|:---|:---|:---|
| **NFR-001** | Performance | Web Dashboard Initial Load (LCP) < 5.0 seconds | **VERIFIED** (~3.8s in production build) |
| **NFR-002** | Security | Zero cross-tenant data leakage on all endpoints | **VERIFIED** (29/29 tests passed, 403 enforced) |
| **NFR-003** | Accuracy | Geodesic area calculation error < 3% | **VERIFIED** (pyproj WGS84 ellipsoid) |
| **NFR-004** | Reliability | PDF Generation Failure Rate < 0.1% | **VERIFIED** (100% success across automated test runs) |
| **NFR-005** | Scalability | REST API handles > 100 concurrent requests without timeout | **VERIFIED** (FastAPI async architecture) |

---

## 5. Scope & Limitations

### 5.1 In-Scope (v1.0.0 Release)
- Web application for desktop and mobile browsers.
- Maharashtra state regional soil model (Vertisols & Inceptisols).
- ICAR fertilizer rules for Rabi and Kharif staple crops.
- Geocoding and administrative hierarchy resolution.
- PDF Soil Health Card export.

### 5.2 Out-of-Scope (Deferred to v1.1+)
- Native iOS / Android mobile applications (PWA currently supported).
- Offline-first SMS-based advisory delivery.
- Direct IoT soil sensor hardware integrations.
- Multi-language audio advisory (Marathi, Hindi voice bots).
