# AI Bhoomi — User Stories and Acceptance Criteria

**Document ID**: PRD-US-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0  
**Status**: APPROVED  

---

## 1. Overview
This document specifies user stories, preconditions, core user journeys, edge case handling, and testable acceptance criteria across all primary user personas.

---

## 2. User Stories by Epic

### Epic 1: Authentication & Account Management

#### US-101: Account Registration
- **As a** farmer or agronomist,  
- **I want to** register an account using my email and a secure password,  
- **So that** my farm boundaries and soil assessment history are securely saved.
- **Preconditions**: User has an email address not yet registered in the system.
- **Acceptance Criteria**:
  1. System accepts full name, email, password, and optional phone number.
  2. Submitting an existing email returns HTTP 409 Conflict with "An account with this email already exists".
  3. Passwords must be at least 8 characters.
  4. Successful registration immediately returns a JWT Bearer token and logs an audit entry.
- **Automated Test**: `tests/test_comprehensive_api_e2e.py::test_07_farm_registration_and_retrieval` (via setup)

#### US-102: User Login & Session Persistence
- **As a** registered user,  
- **I want to** sign in with my credentials and receive an access token,  
- **So that** I can access my private farm data across multiple browser sessions.
- **Acceptance Criteria**:
  1. Valid credentials return HTTP 200 with `access_token` and farmer profile.
  2. Invalid credentials return HTTP 401 Unauthorized without disclosing whether email or password was wrong.
  3. Token is stored securely and sent as `Authorization: Bearer <token>` on subsequent requests.

---

### Epic 2: Geospatial Mapping & Parcel Registration

#### US-201: Current Device Geolocation
- **As a** farmer standing in my field,  
- **I want to** click "Locate Me" on the map,  
- **So that** the map automatically pans and zooms to my current field coordinates.
- **Acceptance Criteria**:
  1. Browser prompts for GPS location permissions.
  2. If granted, Leaflet viewport pans to coordinates with an accuracy circle.
  3. If denied, a friendly banner suggests searching by Village or Taluka.

#### US-202: Drawing & Geodesic Calculation
- **As a** farmer,  
- **I want to** draw my farm polygon vertices on the satellite map,  
- **So that** the exact area is calculated in acres and hectares.
- **Acceptance Criteria**:
  1. Clicking vertices places markers labeled P1, P2, P3... Pn.
  2. System calculates area using the WGS84 geodesic ellipsoid via `pyproj`.
  3. Polygons with fewer than 3 vertices are rejected with HTTP 422.
  4. Self-intersecting "bow-tie" polygons are rejected with an explicit error explaining the self-intersection.

#### US-203: Administrative Autofill
- **As a** farmer,  
- **I want the system to** automatically detect my State, District, and Taluka from my polygon,  
- **So that** I do not have to manually look up administrative divisions.
- **Acceptance Criteria**:
  1. Centroid coordinates are reverse-geocoded via Geoapify.
  2. Form fields for State, District, and Taluka are automatically populated.
  3. Farmer can manually edit fields if administrative boundaries have changed.

#### US-204: Parcel Deletion & Audit Integrity
- **As a** farmer,  
- **I want to** delete an obsolete farm parcel,  
- **So that** my dashboard stays clean.
- **Acceptance Criteria**:
  1. Deleting a standalone farm returns HTTP 204 No Content.
  2. Deleting a farm with active soil reports is blocked with HTTP 409 Conflict to preserve the audit trail.
  3. Passing `?cascade=true` deletes the farm and cleanly cascades deletion of child reports.

---

### Epic 3: AI Soil Intelligence & Recommendations

#### US-301: Soil Fertility Prediction
- **As a** farmer,  
- **I want to** run an AI soil analysis on my registered field,  
- **So that** I get an immediate estimate of fertility parameters before lab testing.
- **Acceptance Criteria**:
  1. System generates values for 8 key parameters: pH, EC, OC, N, P, K, Zn, Fe.
  2. Each parameter includes 80% confidence intervals (`uncertainties`).
  3. Inferences are clearly labeled `source_type: "model_estimate"` with model version.
  4. If demo data is active, results are labeled `is_demo: true` with a clear disclaimer.

#### US-302: ICAR Fertilizer Recommendations
- **As a** farmer,  
- **I want to** select my intended crop (e.g., Wheat) and get fertilizer dosages,  
- **So that** I know exactly how many bags of DAP, Urea, and MOP to apply.
- **Acceptance Criteria**:
  1. Dosages are calculated per acre based on ICAR recommendations.
  2. Dosages are divided into growth stages: Basal (at sowing), Tillering (21-25 days), and Heading (40-45 days).
  3. Safety warnings and application precautions are included.

---

### Epic 4: Reporting & Verification

#### US-401: PDF Soil Health Card Download
- **As a** farmer,  
- **I want to** download an official PDF report of my farm's soil analysis,  
- **So that** I can share it with banks, extension officers, or agronomists.
- **Acceptance Criteria**:
  1. Generates a valid `%PDF-` document.
  2. Includes farm name, location, acreage, boundary map preview, soil parameters, and ICAR advisory.
  3. Includes a cryptographic SHA-256 verification hash and legal disclaimer.
  4. Farmers can only download reports for their own farms (HTTP 403 for unauthorized users).
