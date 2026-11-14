# AI Bhoomi — Master Context & Product Architecture

## 1. Product Identity & Purpose
- **Project Name:** AI Bhoomi — Satellite Soil Report
- **Target Audience:** Indian farmers (focus on Maharashtra agro-climatic zones), agricultural officers, and farm managers.
- **Mission:** Provide accessible, practical, science-backed agricultural intelligence without overwhelming farmers with developer jargon or machine learning terminology.

## 2. Farmer-First Architecture & Plain Language Guidelines
| Technical Term | Farmer-Friendly Interface Term | Meaning for Farmer |
|---|---|---|
| ML Model | Soil Analysis | Evaluates field soil properties & fertility |
| Gemini Module | Planting Advisor | Recommends crops & fertilizer dosing schedules |
| Model Inference | Analyze My Soil / Analyze My Field | Runs estimation for the selected field parcel |
| Spatial ML Model | Field-Based Soil Analysis | Uses field boundaries and regional soil maps |
| API Status | Service Status | Platform operational health |
| Model Registry | Analysis Methods | Available estimation algorithms |
| Fertility Index | Soil Fertility Score | 0–100 score on ICAR-IISS scale |
| Feature Engineering | Analysis Inputs | Field area, crop, season, and irrigation |
| Confidence Interval | Estimated Range | Expected variation in nutrient levels |
| GeoJSON | Field Boundary | Polygon demarcation of farm boundaries |
| Reverse Geocoding | Identify My Location | Village, Taluka, District, and PIN code |
| Dataset Provenance | Where This Information Comes From | Transparency disclosure (Model vs Lab) |
| MLOps | Advanced Analysis Management | Internal diagnostics (developer area) |

## 3. Dedicated AI Agriculture Agents
### Agent 1: Soil Analysis
- **Route:** `/agents/soil-analysis` (Alias: `/soil-analysis`)
- **Primary Inputs:** Selected Farm, Target Crop, Growing Season (Kharif, Rabi, Summer), Irrigation Availability, Soil Type.
- **Outputs:**
  - Soil Fertility Score (0–100) & Qualitative Rating (e.g. Good / Productive)
  - Primary Parameters: pH, EC, Organic Carbon (OC), Nitrogen (N), Phosphorus (P), Potassium (K)
  - Micronutrients: Zinc (Zn), Iron (Fe), Copper (Cu), Manganese (Mn), Boron (B), Sulphur (S)
  - ICAR Benchmark Comparisons (Low, Good, High)
  - Transparent Data Source Badge: *"Field-based spatial model estimate (v1.0.0)"*
  - Direct next step button to Agent 2 (Planting Advisor).

### Agent 2: Planting Advisor
- **Route:** `/agents/planting-advisor` (Alias: `/planting-advisor`)
- **Primary Inputs:** Selected Farm, Available Soil Profile (from Agent 1), Intended Season, Water Availability, Previous Crop Rotation, Farming Objective.
- **Outputs:**
  - Ranked Suitable Crops with agricultural reasons, water requirements, and target yields
  - Practical Fertilizer Dosing in **standard 50kg bags**:
    * Urea bags
    * DAP bags
    * MOP Potash bags
    * Compost / Farm Yard Manure in Tons
  - Application timing guidance (Basal vs. Split Top Dressing)
  - Direct next step buttons: Return to Soil Analysis or Generate PDF Report.

## 4. Navigation & Layout Hierarchy
```
DashboardLayout (/dashboard, /farms, etc.)
├── Sidebar
│   ├── MAIN MENU
│   │   ├── Dashboard (/dashboard)
│   │   ├── My Farms (/farms)
│   │   ├── Soil Health (/soil)
│   │   ├── Planting Recommendations (/recommendations)
│   │   └── My Reports (/reports)
│   ├── AI AGRICULTURE AGENTS
│   │   ├── Soil Analysis (/agents/soil-analysis) [Agent 1]
│   │   └── Planting Advisor (/agents/planting-advisor) [Agent 2]
│   └── ACCOUNT
│       ├── My Profile (/profile)
│       ├── Help & Support (Interactive Walkthrough Modal)
│       └── System Diagnostics (/ml-ops) [Admin/Developer]
└── Top Header
    ├── Sidenav Toggle (Expand / Slide In)
    ├── Breadcrumbs
    ├── Language Slider (English ↔ Hindi + Subtitle mode)
    └── User Account Avatar & Help shortcut
```

## 5. Data Flow & Farm Context Persistence
- **State Management:** `FarmContext.tsx`
- **Key Features:**
  - Persistent active farm in `localStorage` (`aibhoomi_active_farm_id`).
  - Automatic URL query synchronization (`?farmId=...`).
  - Cross-agent data flow: Results generated in Soil Analysis are stored in `lastSoilAnalysis` and automatically populate the soil snapshot in Planting Advisor.
  - Zero redundant boundary re-drawing required.
