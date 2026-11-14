# AI Bhoomi — Geospatial & Satellite Processing Pipeline

## 1. Cadastral Boundaries & Coordinate System
- Input coordinates are accepted in **WGS84 (EPSG:4326)** longitude/latitude.
- To compute accurate boundary areas (in hectares and acres) without Mercator distortion, polygons are projected on-the-fly using a **Lambert Azimuthal Equal Area (LAEA)** projection centered on the polygon centroid:
  $$\text{proj} = \text{+proj=laea +lat\_0}=\text{centroid.y} + \text{lon\_0}=\text{centroid.x} + \dots$$
- Geometry repair is performed via `shapely.geometry.Polygon.buffer(0)` if non-simple geometries are uploaded.

## 2. Sentinel-2 Multispectral Instrument (MSI) Processing
- **Sensors**: Sentinel-2A and Sentinel-2B satellites (5-day revisit cycle).
- **Spatial Resolution**: 10m for RGB & NIR bands; 20m for RedEdge & SWIR bands.
- **Cloud Masking**: Scene Classification Layer (SCL) filters pixels flagged as cloud shadows (2), high cloud probability (9), or cirrus (10).
- **Indices Computed**:
  - **NDVI** (Normalized Difference Vegetation Index):
    $$\text{NDVI} = \frac{\text{B8 (NIR)} - \text{B4 (Red)}}{\text{B8 (NIR)} + \text{B4 (Red)}}$$
  - **NDWI** (Gao's Normalized Difference Water Index):
    $$\text{NDWI} = \frac{\text{B8 (NIR)} - \text{B11 (SWIR1)}}{\text{B8 (NIR)} + \text{B11 (SWIR1)}}$$
  - **SAVI** (Soil-Adjusted Vegetation Index):
    $$\text{SAVI} = \frac{\text{B8} - \text{B4}}{\text{B8} + \text{B4} + 0.5} \times 1.5$$

## 3. Vegetation Health Categorization
| NDVI Range | Biological Classification | Agronomic Interpretation |
|------------|---------------------------|--------------------------|
| **< 0.20** | Bare Soil / Fallow        | Pre-sowing or post-harvest state |
| **0.20 - 0.40** | Sparse / Emerging    | Early vegetative or moisture stress |
| **0.40 - 0.60** | Moderate Canopy      | Average vegetative biomass |
| **> 0.60** | Dense Canopy              | Peak vegetative growth; high chlorophyll |

## 4. Ground-Truth Data Synthesis & Disclaimer Standards
- Optical satellite sensors cannot directly measure sub-surface chemical nutrient concentrations (N, P, K).
- AI Bhoomi **never** claims satellite imagery replaces chemical soil testing.
- Remote sensing data is strictly combined with official Soil Health Card lab tests.
- When Google Earth Engine API credentials are unset, the system runs in high-fidelity simulation mode with explicit UI tags marking the data as **"Demo / Simulated"**.
