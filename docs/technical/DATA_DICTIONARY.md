# AI Bhoomi — Data Dictionary

**Document ID**: TECH-DATA-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0  
**Status**: APPROVED  

---

## 1. Soil Parameters & Measurement Dictionary

| Parameter Name | Symbol | Unit | Normal Agronomic Range | Measurement / Estimation Method | Provenance Category |
|:---|:---:|:---:|:---:|:---|:---|
| **Soil Reaction (pH)** | pH | - | 4.0 – 9.5 | 1:2.5 soil-to-water suspension glass electrode or regional Vertisol ML regressor | `model_estimate` / `laboratory_verified` |
| **Electrical Conductivity** | EC | dS/m | 0.05 – 4.0 | 1:2 conductivity meter or ML estimation | `model_estimate` / `laboratory_verified` |
| **Soil Organic Carbon** | OC | % | 0.1 – 2.5 | Walkley-Black wet oxidation or satellite covariate estimation | `model_estimate` (Requires Lab Check) |
| **Available Nitrogen** | N | kg/ha | 50 – 600 | Subbiah & Asija alkaline permanganate method or ML inference | `model_estimate` / `laboratory_verified` |
| **Available Phosphorus** | P | kg/ha | 5 – 80 | Olsen's 0.5M NaHCO₃ extraction (pH > 7.0) or Bray-1 (pH < 6.5) | `model_estimate` / `laboratory_verified` |
| **Available Potassium** | K | kg/ha | 50 – 800 | 1N Neutral Ammonium Acetate flame photometry | `model_estimate` / `laboratory_verified` |
| **Available Zinc** | Zn | mg/kg (ppm) | 0.1 – 5.0 | 0.005M DTPA extraction via Atomic Absorption Spectroscopy | `model_estimate` / `laboratory_verified` |
| **Available Iron** | Fe | mg/kg (ppm) | 1.0 – 25.0 | 0.005M DTPA extraction via Atomic Absorption Spectroscopy | `model_estimate` / `laboratory_verified` |

---

## 2. Geospatial & Boundary Field Dictionary

| Field Name | Data Type | Coordinate System / Format | Description | Validation Rule |
|:---|:---|:---|:---|:---|
| `boundary_geojson` | String (JSON) | GeoJSON Polygon (EPSG:4326) | Outer linear boundary ring coordinates `[[lon, lat], ...]` | Must be closed ring (P_first == P_last), >= 3 distinct points, non-self-intersecting. |
| `latitude` | Float | Decimal Degrees (WGS84) | Centroid or point observation latitude | `-90.0 <= lat <= 90.0` |
| `longitude` | Float | Decimal Degrees (WGS84) | Centroid or point observation longitude | `-180.0 <= lon <= 180.0` |
| `area_sqm` | Float | Square Meters (m²) | Geodesic area calculated on WGS84 ellipsoid | `area_sqm >= 100.0` (Min 0.01 ha) |
| `area_acres` | Float | Acres | Derived: `area_sqm / 4046.8564224` | Rounded to 2–4 decimal places |
| `area_hectares` | Float | Hectares (ha) | Derived: `area_sqm / 10000.0` | Rounded to 2–4 decimal places |
| `perimeter_meters`| Float | Meters (m) | Sum of geodesic line strings connecting vertices | Derived from coordinate loop |

---

## 3. Provenance & Classification Terms

| Classification / Flag | Permitted Values | Meaning & Usage |
|:---|:---|:---|
| `source_type` | `laboratory_verified`, `model_estimate`, `demo_sample` | Identifies the physical and legal ground of the soil assessment. |
| `data_provenance` | `SYNTHETIC_DEMO_NOT_OBSERVED`, `ICAR_GROUND_TRUTH`, `SOILGRIDS_250M` | Distinguishes whether training data represents physical observations or synthetic baseline demonstration. |
| `status` (Farm) | `active`, `archived` | Soft-deletion flag enabling historical report retrieval while hiding farm from active drawing canvas. |
| `status` (Model) | `candidate`, `approved`, `deprecated` | Model registry state for tracking active production vs shadow models. |
