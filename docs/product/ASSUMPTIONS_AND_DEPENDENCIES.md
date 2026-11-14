# AI Bhoomi — Assumptions and Dependencies

**Document ID**: PRD-ASSUMP-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0  
**Status**: APPROVED  

---

## 1. Assumptions

### 1.1 Technical Assumptions
1. **Coordinate System**: All boundary coordinates provided by client devices or external GeoJSON files are assumed to be referenced to the WGS84 ellipsoid (EPSG:4326) with `[longitude, latitude]` order.
2. **Network Connectivity**: Users are assumed to have intermittent or stable internet connectivity (3G/4G/Wi-Fi) during parcel drawing and report generation.
3. **Map Tiles**: The browser can connect to public tile CDNs (CartoDB, OpenStreetMap) without firewall blocks.
4. **Client Capabilities**: Client devices support modern JavaScript (ES2022) and Canvas rendering for Leaflet map display.

### 1.2 Domain & Agronomic Assumptions
1. **Regional Soil Generalization**: Initial ML models assume properties typical of Maharashtra Vertisols (black cotton soils) and Inceptisols. Performance on other soil orders (e.g., coastal alluvium, sandy desert soils) will differ until dedicated regional retraining.
2. **Standard Planting Cycles**: Recommendations assume standard Indian Rabi (October–March) and Kharif (June–October) crop calendars.
3. **Fertilizer Grade Purity**: Recommendations assume commercial fertilizer grades: Urea (46% N), DAP (18% N, 46% P₂O₅), and MOP (60% K₂O).

---

## 2. Dependencies

### 2.1 Software & Framework Dependencies
- **Python**: Version 3.14.x or 3.11+
- **FastAPI**: >= 0.115.0
- **SQLAlchemy**: >= 2.0.36
- **Shapely**: >= 2.0.6
- **PyProj**: >= 3.7.0
- **ReportLab**: >= 4.2.0
- **Node.js**: Version 18.x or 20.x LTS
- **React**: Version 18.2.0
- **Leaflet**: Version 1.9.4
- **Vite**: Version 5.x

### 2.2 External Services & Cloud APIs
- **Geoapify API**: Geocoding and reverse administrative hierarchy lookups.
- **Google Earth Engine (GEE)**: Required for live satellite optical acquisition; currently bypassed via demo mode (`GEE_DEMO_MODE=True`).
- **CartoDB Tile Service**: Free tier raster basemaps for satellite and street view rendering.
