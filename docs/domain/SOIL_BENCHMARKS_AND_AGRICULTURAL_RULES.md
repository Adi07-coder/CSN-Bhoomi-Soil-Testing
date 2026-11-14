# AI Bhoomi — Soil Benchmarks and Agricultural Rules

**Document ID**: DOM-RULES-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Reference Source**: ICAR Fertilizer Recommendations & Maharashtra State Agriculture University Guidelines (MPKV Rahuri / VNMKV Parbhani)  
**Version**: 1.0.0  
**Status**: APPROVED  

---

## 1. ICAR Soil Fertility Classification Benchmarks

AI Bhoomi evaluates soil tests against official Indian Council of Agricultural Research (ICAR) benchmark ratings:

| Parameter | Unit | Low (Deficient) | Medium (Optimal) | High (Excess / Sufficient) | Agronomic Significance |
|:---|:---:|:---:|:---:|:---:|:---|
| **Soil Reaction (pH)** | - | < 6.5 (Acidic) | 6.5 – 7.8 (Neutral) | > 7.8 (Alkaline) | Controls nutrient availability and microbial mineralization. |
| **Electrical Cond. (EC)** | dS/m | < 1.0 (Non-saline) | 1.0 – 2.0 (Slightly saline) | > 2.0 (Critical salinity) | High EC causes osmotic stress and seedling mortality. |
| **Organic Carbon (OC)** | % | < 0.50 | 0.50 – 0.75 | > 0.75 | Primary indicator of biological activity and nitrogen reserve. |
| **Available Nitrogen (N)** | kg/ha | < 280 | 280 – 560 | > 560 | Drives vegetative canopy growth and chlorophyll synthesis. |
| **Available Phosphorus (P)**| kg/ha | < 10 | 10 – 25 | > 25 | Essential for root proliferation and early establishment. |
| **Available Potassium (K)** | kg/ha | < 108 | 108 – 280 | > 280 | Imparts drought resilience, disease resistance, grain filling. |
| **Available Zinc (Zn)** | mg/kg | < 0.60 | 0.60 – 1.20 | > 1.20 | Critical for enzyme activation and internode elongation. |
| **Available Iron (Fe)** | mg/kg | < 4.50 | 4.50 – 9.00 | > 9.00 | Prevents interveinal chlorosis in high-pH Vertisols. |

---

## 2. Crop-Specific Fertilizer Recommendation Rules

### 2.1 Wheat (Triticum aestivum) — Irrigated High-Yielding
- **Standard Baseline Requirement**: 120 kg N : 60 kg P₂O₅ : 40 kg K₂O per hectare (~48 kg N : 24 kg P₂O₅ : 16 kg K₂O per acre).
- **Fertilizer Material Conversion**:
  - **DAP (18-46-0)**: 53 kg/acre provides 24.4 kg P₂O₅ + 9.5 kg N
  - **Urea (46-0-0)**: 111.5 kg/acre provides remaining 38.5 kg N
  - **MOP (0-0-60)**: 27 kg/acre provides 16.2 kg K₂O
- **Stage-Wise Application Schedule**:
  1. **Basal Application (At Sowing)**: 100% of DAP (53 kg/acre) + 100% of MOP (27 kg/acre) + 33% of Urea (37 kg/acre).
  2. **Crown Root Initiation / Tillering (21–25 DAS)**: 33% of Urea (37 kg/acre) with first irrigation.
  3. **Jointing / Late Tillering (40–45 DAS)**: 33% of Urea (37 kg/acre) with second irrigation.

### 2.2 Mustard (Brassica juncea)
- **Standard Baseline Requirement**: 80 kg N : 40 kg P₂O₅ : 0 kg K₂O per hectare (~32 kg N : 16 kg P₂O₅ per acre).
- **Fertilizer Material Conversion**:
  - **DAP**: 35 kg/acre
  - **Urea**: 74 kg/acre
  - **Elemental Sulphur**: 10 kg/acre (essential for oil synthesis)
- **Schedule**: 100% DAP + 50% Urea at basal; remaining 50% Urea at 30 days after sowing.

### 2.3 Chickpea / Gram (Cicer arietinum) — Pulse / Legume
- **Standard Baseline Requirement**: 25 kg N : 50 kg P₂O₅ per hectare (~10 kg N : 20 kg P₂O₅ per acre).
- **Fertilizer Material Conversion**:
  - **DAP**: 17.5 kg/acre
  - **Urea**: 10 kg/acre
- **Schedule**: 100% applied as basal at sowing; Rhizobium biofertilizer seed treatment recommended.

---

## 3. Soil Adjustment Logic

When soil test values depart from "Medium":
1. **Low Available P (< 10 kg/ha)**: Recommended DAP dose increased by **+25%**.
2. **High Available P (> 25 kg/ha)**: Recommended DAP dose reduced by **-25%**.
3. **Low Available K (< 108 kg/ha)**: MOP dose increased by **+25%**.
4. **High Available K (> 280 kg/ha)**: MOP omitted or reduced by **-50%** (natural abundance in Deccan Vertisols).
5. **Alkaline Soil (pH > 8.2)**: Recommend application of Gypsum (500 kg/acre) and elemental Sulphur; warn against surface Urea broadcast without immediate incorporation.
