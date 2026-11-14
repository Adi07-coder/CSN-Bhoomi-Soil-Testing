# Soil Report Pipeline & Geolocation Calibration

## 1. Field Boundary Capture
- **Polygon Mode**: Allows farmers and field surveyors to plot up to 20 precise vertices on OpenStreetMap / ESRI Satellite imagery.
- **Square Mode**: Two-click diagonal rubber-band box placement for standard square/rectangular land parcels.
- **Geodesic Computation**: Area in square meters is computed using the Shoelace formula projected to WGS-84 ellipsoidal geometry, and converted into standard Indian agricultural units (Acres and Hectares).

## 2. Soil Analysis Processing
- **Endpoint**: `POST /api/v1/analyses`
- **Payload**: GeoJSON polygon geometry, selected target crop, growing season, and irrigation type.
- **Nutrient Extraction**: Produces test values for 12 primary, secondary, and micronutrient indicators with ICAR-IISS standard status classifications (Deficient, Low, Medium, Optimal, High, Critical).

## 3. PDF Soil Intelligence Report
- Exported via `jsPDF` directly on client-side.
- Contains 4 formal sections:
  1. Header & Geolocation Details (Centroid, Acreage, Hectares, Perimeter, Vertex count).
  2. NPK & Micronutrient Diagnostic Table.
  3. Treatment Planning Formulations (Organic & Chemical).
  4. Seasonal Crop Recommendations & Authenticity Guardrail Stamp.
