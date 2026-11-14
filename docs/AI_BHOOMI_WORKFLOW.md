# AI Bhoomi — Complete Platform Workflow Architecture

## Executive Overview
AI Bhoomi is an AI-powered agricultural intelligence platform integrating:
1. Interactive Geodesic Field Demarcation (Polygon up to 20 vertices and Square bounding box)
2. Geocoding & Administrative Resolution (Reverse-geocoding to Village, Taluka, District, State)
3. Regional ICAR Soil Fertility Baselines (Maharashtra agro-climatic zones)
4. Trained HistGradientBoosting Soil Prediction & Real-time Inference Engine
5. Google Gemini AI Agronomic Intelligence (Gemini 2.5 Flash / Flash-Latest) with Resilient ICAR Fallback
6. 4-Pillar Soil Intelligence:
   - Complete 12-Nutrient Diagnostic Table (NPK, Secondary Nutrients, Micronutrients, pH/EC/OC)
   - Treatment Planning (Organic Plan, Chemical Plan with 50kg bag calculations, and Side-by-Side Comparison)
   - Seasonal Crop Recommendations (Kharif, Rabi, Summer/Zaid with suitability scores & water requirements)
   - Data Genuineness Provenance & Anti-Hallucination Safe Guardrails
7. Multi-page Downloadable PDF Soil Intelligence Report (via jsPDF)

## Architectural Data Flow
```
User Demarcation (Map) 
       ↓ (GeoJSON Coordinates)
Backend API: POST /api/v1/analyses
       ↓
Centroid & Shoelace Geodesic Calculation (WGS-84)
       ↓
District & Agro-Climatic Profile Mapping
       ↓
HistGradientBoosting ML Inference / ICAR STCR Calibration
       ↓
Google Gemini Reasoning (AQ.Ab8RN6... API Key)
       ↓ (Strict 2.0s timeout + ICAR Fallback)
Synthesized 4-Branch Payload Returned
       ↓
Interactive Frontend Tabbed Interface & Exportable PDF Report
```
