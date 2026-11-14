# AI Bhoomi — REST API Reference

## Base URL
- Production: `http://localhost:8000/api/v1`
- Interactive OpenAPI / Swagger Docs: `http://localhost:8000/docs`
- Redoc Documentation: `http://localhost:8000/redoc`

---

## 1. Field Soil Analysis & Multi-Point Demarcation
### `POST /api/v1/analyses`
Submits a demarcated GeoJSON farm polygon or bounding box for geospatial soil analysis, NPK diagnostic benchmarking, treatment planning, and seasonal crop recommendations.

#### Request Body (JSON)
```json
{
  "farm_name": "Godavari Valley Plot 4",
  "crop": "Wheat",
  "season": "Rabi",
  "irrigation_type": "Drip Irrigation",
  "soil_type": "Vertisol (Black Cotton Soil)",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [73.8567, 18.5204],
        [73.8590, 18.5220],
        [73.8610, 18.5200],
        [73.8580, 18.5180],
        [73.8567, 18.5204]
      ]
    ]
  },
  "analysis_mode": "trained"
}
```

#### Response Body (JSON - 200 OK)
Returns all 4 master prompt branches:
- `soil_parameters`: Complete diagnostic values (N, P, K, S, Ca, Mg, Zn, Fe, B, Mn, Cu, pH, EC, OC, fertility index).
- `npk_micronutrient_table`: Structured 12-parameter diagnostic with ICAR status & actions.
- `treatment_planning`:
  - `organic_plan`: Interventions (FYM, Vermicompost, Biofertilizers, Neem Cake, Green Manure) scaled to verified acreage.
  - `chemical_plan`: Interventions (Urea, DAP, MOP, ZnSO4) with rate/acre, total field kg, and **50kg bag counts**.
  - `comparison`: Side-by-side trade-off matrix across 4 criteria.
- `seasonal_crop_recommendations`:
  - `kharif`: Suitability scores, water requirements, and management advice for monsoon crops.
  - `rabi`: Suitability scores, water requirements, and management advice for winter crops.
  - `summer`: Suitability scores, water requirements, and management advice for summer/zaid crops.
- `gemini_ai_advisory`: Google Gemini natural-language agronomic reasoning with resilient ICAR fallback.
- `gemini_treatment_ai`: Google Gemini treatment planning guidance.
- `genuineness_findings`: Data provenance, ICAR-IISS standard version, and boundary integrity.
- `hallucination_safeguards`: STCR upper-limit safety constraints and anti-hallucination checks.

---

## 2. Retrieve Stored Analysis
### `GET /api/v1/analyses/{analysis_id}`
Retrieves complete analysis report by ID.

### `GET /api/v1/analyses/{analysis_id}/results`
Retrieves raw soil parameters and nutrient ratings.

---

## 3. Farm Parcels Management
### `GET /api/v1/farms`
Lists all registered farms associated with the user profile.

### `POST /api/v1/farms`
Registers a new farm boundary parcel with calculated acreage, centroid coordinates, and administrative attributes.

---

## 4. System Health Check
### `GET /health`
Returns system status, active database connection, and API version.
