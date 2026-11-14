# AI Bhoomi — Dataset Card

**Document ID**: ML-DATASET-001  
**Dataset Name**: Maharashtra Regional Soil Fertility Dataset  
**Version**: 1.0.0  
**File Location**: `data/maharashtra_soil_part_1.csv` through `part_4.csv`  

---

## 1. Dataset Summary
The Maharashtra Regional Soil Fertility Dataset comprises 200,000 baseline records structured into 4 chunks (50,000 rows each) covering diverse agro-climatic zones across Maharashtra:
- Western Maharashtra (Pune, Ahmednagar, Satara, Solapur)
- Marathwada (Chhatrapati Sambhajinagar, Jalna, Beed, Latur)
- Vidarbha (Nagpur, Amravati, Akola, Yavatmal)

---

## 2. Data Provenance & Structure

### 2.1 Provenance Classification
- **Explicit Label**: Every record in the dataset contains `data_provenance = "SYNTHETIC_DEMO_NOT_OBSERVED"`.
- **Purpose**: Engineered for prototype demonstration, end-to-end integration testing, and machine learning pipeline scaffolding before connecting to the state ICAR physical lab repository.

### 2.2 Schema Columns
1. `record_id`: Unique identifier (e.g., `MHDEMO0000001`)
2. `latitude`, `longitude`: WGS84 coordinate pairs within Maharashtra geographic bounds
3. `sample_depth_cm`: Fixed topsoil depth (15 cm)
4. `observation_date`: Observation or synthetic generation timestamp
5. `soil_texture_demo`: `clay_loam`, `sandy_loam`, `black_cotton`
6. `elevation_m_demo`: Elevation in meters above sea level
7. `annual_rainfall_mm_demo`: Annual precipitation in millimeters
8. `mean_temperature_c_demo`: Mean annual temperature in Celsius
9. `soil_moisture_pct_demo`: Relative soil volumetric moisture percentage
10. `ph`, `electrical_conductivity_dS_m`, `organic_carbon_pct`: Core chemical properties
11. `available_nitrogen_kg_ha`, `available_phosphorus_kg_ha`, `available_potassium_kg_ha`: Primary macronutrients
12. `available_zinc_mg_kg`, `available_iron_mg_kg`: Essential micronutrients
13. `demo_fertility_score`, `demo_fertility_class`: Composite fertility evaluation

---

## 3. Data Integrity & Usage Rules
- **No Personal Identifiable Information (PII)**: The dataset contains zero farmer names, phone numbers, or property title IDs.
- **Integrity Hash**: Verified via automated SHA-256 integrity checks in `tests/test_soil_model.py`.
