# AI Bhoomi — Changelog & Redesign History

## [2.1.0] — 2026-10-27

### Farmer-First Website Redesign & AI Agent Architecture

#### Added
- **Dedicated AI Agriculture Agent 1: Soil Analysis (`SoilAnalysisAgentPage.tsx`)**:
  - Route: `/agents/soil-analysis` (with `/soil-analysis` alias)
  - Connects directly with backend `POST /api/v1/analyses` (`soil_model_pipeline.py`)
  - Evaluates field parcel boundary, calculates geodesic area, displays Soil Fertility Score (0–100), pH, EC, Organic Carbon, NPK, and 6 micronutrients with clear ICAR ratings (Low, Good, High).
  - Explicit data transparency badge identifying model estimates vs. laboratory tests.
  - Seamless handover button: "Get Planting Advice for this Field →" linking directly to Agent 2 with persisted soil results.
- **Dedicated AI Agriculture Agent 2: Planting Advisor (`PlantingAdvisorAgentPage.tsx`)**:
  - Route: `/agents/planting-advisor` (with `/planting-advisor` alias)
  - Connects directly with `POST /api/v1/crop-recommendations/evaluate` (`gemini_crop_recommendation_service.py`) and ICAR agronomic rules.
  - Evaluates season (Kharif, Rabi, Summer), water availability, and crop rotation.
  - Ranks suitable crops with agronomic reasons, water demands, and target yields.
  - Displays practical fertilizer plans in standard **50kg bags** (Urea, DAP, Potash, Compost tons).
  - Explicit AI source badge disclosing Google Gemini advisory with deterministic fallback.
  - Action buttons to return to Soil Information or jump to Report Generation.
- **Shared Farm Context (`FarmContext.tsx`)**:
  - Synchronizes active farm ID across all pages, navigation, and agents.
  - Persists active farm to `localStorage` and supports URL deep-linking (`?farmId=...`).
  - Caches latest field soil analysis to pass live data between Agent 1 and Agent 2.
- **Farmer Help & Support Modal**:
  - Interactive walkthrough explaining the 4-step farmer journey (Map Farm -> Soil Analysis -> Planting Advice -> Reports).

#### Redesigned
- **Dashboard Layout (`DashboardLayout.tsx`)**:
  - Created structured 3-tier sidebar:
    1. **MAIN MENU**: Dashboard, My Farms, Soil Health, Planting Recommendations, My Reports
    2. **AI AGRICULTURE AGENTS**: Soil Analysis (Agent 1), Planting Advisor (Agent 2)
    3. **ACCOUNT**: My Profile, Help & Support, System Diagnostics (subtle admin link)
  - Replaced developer MLOps jargon with farmer-friendly navigation.
  - Added clean top header with breadcrumbs, language switcher, and help button.
- **Public Landing Page (`LandingPage.tsx`)**:
  - Heading: *"Understand Your Soil. Grow with Confidence."*
  - Warm agricultural design system (`#166534`, `#22C55E`, `#FAFAF5` cream, clean typography).
  - Implemented all 9 sections: Hero, How It Works, Farmland Registration, Soil Insights, AI Agents, Reports, Scientific Limitations & Honesty, Final CTA, and Footer.
  - Zero fabricated yield or farmer statistics.
- **Farmer Dashboard (`DashboardPage.tsx`)**:
  - Personalized time-based welcome greeting.
  - Genuine farm metrics: Registered Farms, Monitored Land Area (Acres & Hectares), Fields Mapped, Reports Available.
  - Dynamic "Next Recommended Action" card guiding the farmer on what to do next.
  - Two AI Agriculture Agents launcher cards.
  - Registered farm cards with quick "Soil" and "Advice" action buttons.
  - Removed misleading synthetic 5-minute sentinel banner from farmer dashboard.
- **Farms Workspace (`FarmsPage.tsx`)**:
  - Summary stats banner.
  - Guided 5-step map workflow (Farm Details -> Location Search -> Boundary Drawing -> Area Review -> Confirm Farm).
  - Farm cards equipped with direct "Analyze Soil" and "Planting Advice" buttons.
  - Post-registration success modal with immediate next action shortcuts.
- **Crop Selection Configuration Card (`CropSelectionConfigurationCard.tsx`)**:
  - Replaced technical labels with plain-language farmer text.
  - Updated primary action to *"Find Suitable Crops for My Field"*.

#### Verification
- Frontend production build: `npm run build` executed and passing with 0 errors (`✓ built in 5.56s`).
- Backend routes preserved and fully compatible.
