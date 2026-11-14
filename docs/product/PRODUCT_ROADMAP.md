# AI Bhoomi — Product Roadmap (2026–2027)

**Document ID**: PRD-ROADMAP-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0  
**Status**: APPROVED  

---

## 1. Roadmap Overview & Milestones

The product roadmap for AI Bhoomi transitions the platform from the current verified pre-production release (v1.0.0) to full multi-regional production scale across India.

```
2026 Q1-Q2 (Completed)      2026 Q3-Q4 (Target)          2027 Q1-Q2 (Planned)
[Milestones 1 - 3] ------> [Milestones 4 - 5] --------> [Milestones 6 - 7]
Web Prototype & GIS        Live Satellite & Retraining   Pan-India Expansion & IoT
FastAPI & ML Baselines     PostgreSQL/PostGIS Prod       Multi-lingual Voice Advisory
```

---

## 2. Milestone Breakdown & Delivery Status

### Milestone 1: Web Application & Prototype UX (Status: COMPLETE)
- [x] Responsive dashboard layout in React 18, Vite, and Tailwind CSS.
- [x] Interactive Leaflet map canvas with polygon drawing and vertex editing.
- [x] JWT authentication, user registration, and session persistence.
- [x] Prototype soil fertility visualization and demo mode banners.
- [x] Sample PDF Soil Health Card generation.

### Milestone 2: Backend Core & Persistent Storage (Status: COMPLETE)
- [x] FastAPI RESTful microservice architecture with SQLAlchemy 2.0.
- [x] Multi-tenant data model with explicit farmer ownership.
- [x] Farm parcel persistence with GeoJSON boundary geometry.
- [x] Referential integrity protection (HTTP 409 Conflict) and optional cascading cleanup.
- [x] Audited SHA-256 PDF generation using ReportLab Platypus.

### Milestone 3: Geospatial Accuracy & Quality (Status: COMPLETE)
- [x] WGS84 geodesic area calculations on the ellipsoid via `pyproj.Geod`.
- [x] Strict polygon validation with Shapely (rejection of degenerate or self-intersecting geometries).
- [x] Reverse-geocoding administrative resolution via Geoapify API.
- [x] Autocomplete forward search for Indian districts, talukas, and PIN codes.

### Milestone 4: Live Satellite Data Integration (Status: IN PROGRESS / Q3 2026)
- [ ] Connect Google Earth Engine (GEE) production service account to replace demo mode.
- [ ] Automated Sentinel-2 10m L2A surface reflectance ingestion.
- [ ] Cloud, shadow, and snow masking using the SCL scene classification band.
- [ ] Time-series vegetation index calculations (NDVI, EVI, NDRE) for crop vigor tracking.

### Milestone 5: Soil Model Retraining & Lab Calibration (Status: IN PROGRESS / Q4 2026)
- [x] Baseline Scikit-Learn regressor pipeline calibrated to Maharashtra Vertisols (R² = 0.942).
- [ ] Integration of 10,000+ laboratory ground-truth samples from ICAR Soil Health Card portal.
- [ ] Dedicated Organic Carbon sub-model incorporating elevation and multi-year precipitation features.
- [ ] Automated model retraining pipeline with automated rollback triggers in `ml_ops.py`.

### Milestone 6: Pan-India Expansion & Agronomic Deepening (Status: PLANNED / Q1 2027)
- [ ] Support for Alluvial soils (Indo-Gangetic plain) and Red Laterite soils (Southern India).
- [ ] Crop expansion: Sugarcane, Cotton, Paddy, Groundnut, and Horticultural crops (Pomegranate, Grapes).
- [ ] Regional micro-nutrient recommendations: Zinc Sulphate, Borax, Ferrous Sulphate application rates.

### Milestone 7: Enterprise Integrations & Offline Accessibility (Status: PLANNED / Q2 2027)
- [ ] Progressive Web App (PWA) with offline boundary capture for low-connectivity rural areas.
- [ ] Vernacular voice assistant support (Marathi, Hindi, Telugu, Kannada).
- [ ] Bank & Insurance API gateway for instant Kisan Credit Card (KCC) land verification.
