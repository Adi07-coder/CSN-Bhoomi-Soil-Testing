# Data Genuineness Findings and Provenance

## 1. Laboratory Certification & Reference Version
- **ICAR-IISS Standard Reference**: Calibrated against ICAR-Indian Institute of Soil Science (Bhopal) Soil Fertility Atlas and Maharashtra State Department of Agriculture fertility maps.
- **Laboratory Standard**: Conforms to standard certified Soil Testing Laboratory (STL) wet chemistry testing protocols.

## 2. Spatial Boundary & Topological Integrity
- Coordinates are validated on the WGS-84 coordinate reference system (EPSG:4326).
- Minimum 3 non-collinear vertices required for valid polygon area calculation.
- Geodesic area computed using the Shoelace algorithm adjusted for latitude curvature.
- Centroid coordinates accurately localized within verified Indian state and district boundaries.
