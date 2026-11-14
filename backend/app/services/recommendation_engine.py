"""
Deterministic crop suitability and fertilizer recommendation engine.

Data sources:
  - ICAR (Indian Council of Agricultural Research) fertilizer recommendations.
  - Maharashtra State Dept. of Agriculture crop calendars.
  - Reference: "Fertilizer Recommendations for Crops", ICAR-IISS, 2020.

These are general reference values for educational purposes.
They must not replace site-specific agronomist advice or soil-test results.
"""
from __future__ import annotations

from typing import Any


# ---------------------------------------------------------------------------
# Crop database — region/season suitability for Maharashtra districts
# ---------------------------------------------------------------------------

MAHARASHTRA_CROPS = {
    "kharif": [
        {
            "crop": "Soybean",
            "botanical_name": "Glycine max",
            "suitability_score": 9,
            "soil_ph_range": (6.0, 7.5),
            "rainfall_mm": (600, 1200),
            "irrigation": "rainfed",
            "districts": ["all"],
            "notes": "Principal kharif oilseed in Vidarbha and Marathwada.",
        },
        {
            "crop": "Cotton",
            "botanical_name": "Gossypium hirsutum",
            "suitability_score": 8,
            "soil_ph_range": (6.0, 8.0),
            "rainfall_mm": (500, 900),
            "irrigation": "both",
            "districts": ["all"],
            "notes": "Suited to black cotton (Vertisol) soils of Maharashtra.",
        },
        {
            "crop": "Tur (Pigeonpea)",
            "botanical_name": "Cajanus cajan",
            "suitability_score": 8,
            "soil_ph_range": (6.0, 7.5),
            "rainfall_mm": (600, 1000),
            "irrigation": "rainfed",
            "districts": ["all"],
            "notes": "Drought-tolerant, commonly intercropped with soybean.",
        },
        {
            "crop": "Jowar (Kharif Sorghum)",
            "botanical_name": "Sorghum bicolor",
            "suitability_score": 7,
            "soil_ph_range": (6.0, 8.0),
            "rainfall_mm": (500, 1000),
            "irrigation": "rainfed",
            "districts": ["all"],
            "notes": "Traditional food-fodder crop.",
        },
        {
            "crop": "Rice (Paddy)",
            "botanical_name": "Oryza sativa",
            "suitability_score": 6,
            "soil_ph_range": (5.0, 7.0),
            "rainfall_mm": (1000, 2000),
            "irrigation": "irrigated",
            "districts": ["Raigad", "Ratnagiri", "Sindhudurg", "Thane", "Nashik"],
            "notes": "High water requirement; suited to Konkan region.",
        },
        {
            "crop": "Groundnut",
            "botanical_name": "Arachis hypogaea",
            "suitability_score": 6,
            "soil_ph_range": (6.0, 7.0),
            "rainfall_mm": (500, 800),
            "irrigation": "rainfed",
            "districts": ["all"],
            "notes": "Sandy loam soils preferred.",
        },
    ],
    "summer": [
        {
            "crop": "Summer Groundnut",
            "botanical_name": "Arachis hypogaea",
            "suitability_score": 9,
            "soil_ph_range": (6.0, 7.5),
            "rainfall_mm": (0, 100),
            "irrigation": "irrigated",
            "districts": ["all"],
            "notes": "High yield potential under assured summer irrigation in Maharashtra.",
        },
        {
            "crop": "Summer Moong (Green Gram)",
            "botanical_name": "Vigna radiata",
            "suitability_score": 8,
            "soil_ph_range": (6.5, 7.5),
            "rainfall_mm": (0, 100),
            "irrigation": "irrigated",
            "districts": ["all"],
            "notes": "Short-duration (60-65 days) summer pulse crop; fixes atmospheric nitrogen.",
        },
        {
            "crop": "Summer Urad (Black Gram)",
            "botanical_name": "Vigna mungo",
            "suitability_score": 8,
            "soil_ph_range": (6.5, 7.8),
            "rainfall_mm": (0, 100),
            "irrigation": "irrigated",
            "districts": ["all"],
            "notes": "Excellent catch crop between Rabi harvest and Kharif sowing.",
        },
        {
            "crop": "Summer Maize (Fodder & Grain)",
            "botanical_name": "Zea mays",
            "suitability_score": 7,
            "soil_ph_range": (6.0, 7.5),
            "rainfall_mm": (0, 150),
            "irrigation": "irrigated",
            "districts": ["all"],
            "notes": "Responds strongly to balanced nitrogen and zinc under drip irrigation.",
        },
        {
            "crop": "Sesame (Til)",
            "botanical_name": "Sesamum indicum",
            "suitability_score": 7,
            "soil_ph_range": (6.0, 7.8),
            "rainfall_mm": (0, 80),
            "irrigation": "irrigated",
            "districts": ["all"],
            "notes": "High oil content crop well-suited to summer heat in Vidarbha and Marathwada.",
        },
    ],
    "rabi": [
        {
            "crop": "Wheat",
            "botanical_name": "Triticum aestivum",
            "suitability_score": 8,
            "soil_ph_range": (6.0, 7.5),
            "rainfall_mm": (0, 400),
            "irrigation": "irrigated",
            "districts": ["all"],
            "notes": "Winter crop requiring cool temperatures; irrigated cultivation.",
        },
        {
            "crop": "Chickpea (Bengal Gram)",
            "botanical_name": "Cicer arietinum",
            "suitability_score": 9,
            "soil_ph_range": (6.0, 7.5),
            "rainfall_mm": (0, 300),
            "irrigation": "rainfed",
            "districts": ["all"],
            "notes": "Drought-tolerant; most widely grown rabi legume in Maharashtra.",
        },
        {
            "crop": "Safflower",
            "botanical_name": "Carthamus tinctorius",
            "suitability_score": 7,
            "soil_ph_range": (6.5, 8.0),
            "rainfall_mm": (0, 300),
            "irrigation": "rainfed",
            "districts": ["all"],
            "notes": "Tolerates saline and alkaline soils.",
        },
        {
            "crop": "Rabi Jowar",
            "botanical_name": "Sorghum bicolor",
            "suitability_score": 8,
            "soil_ph_range": (6.0, 8.0),
            "rainfall_mm": (0, 400),
            "irrigation": "rainfed",
            "districts": ["all"],
            "notes": "Major winter crop in Marathwada and Solapur.",
        },
        {
            "crop": "Onion",
            "botanical_name": "Allium cepa",
            "suitability_score": 7,
            "soil_ph_range": (6.0, 7.5),
            "rainfall_mm": (0, 200),
            "irrigation": "irrigated",
            "districts": ["Nashik", "Pune", "Ahmednagar", "Solapur"],
            "notes": "Nashik district is India's largest onion producer.",
        },
    ],
}

# ---------------------------------------------------------------------------
# Fertilizer recommendations — ICAR reference values (kg/ha)
# Source: ICAR-IISS, Fertilizer Recommendations for Crops, 2020 edition.
# N:P2O5:K2O doses unless otherwise noted.
# ---------------------------------------------------------------------------

FERTILIZER_RULES: dict[str, dict] = {
    "wheat": {
        "season": "rabi",
        "n_kg_ha": 120, "p_kg_ha": 60, "k_kg_ha": 40,
        "source": "ICAR Fertilizer Recommendations, Wheat, Table 4.2",
        "note": "Irrigated, high-yielding variety. Split N: 60 basal + 60 at first irrigation.",
        "stages": [
            {"stage": "Basal (sowing)", "n_pct": 50, "p_pct": 100, "k_pct": 100},
            {"stage": "First irrigation (CRI)", "n_pct": 50, "p_pct": 0, "k_pct": 0},
        ],
    },
    "soybean": {
        "season": "kharif",
        "n_kg_ha": 30, "p_kg_ha": 60, "k_kg_ha": 30,
        "source": "ICAR Fertilizer Recommendations, Soybean, Table 8.1",
        "note": "Starter N only; remaining N fixed by Rhizobium. Treat seed with Bradyrhizobium.",
        "stages": [
            {"stage": "Basal (sowing)", "n_pct": 100, "p_pct": 100, "k_pct": 100},
        ],
    },
    "cotton": {
        "season": "kharif",
        "n_kg_ha": 150, "p_kg_ha": 75, "k_kg_ha": 75,
        "source": "ICAR Fertilizer Recommendations, Cotton (Bt hybrid), Table 9.4",
        "note": "Bt hybrid irrigated cotton. Foliar K recommended at boll development.",
        "stages": [
            {"stage": "Basal (sowing)", "n_pct": 33, "p_pct": 100, "k_pct": 50},
            {"stage": "45 DAS", "n_pct": 33, "p_pct": 0, "k_pct": 25},
            {"stage": "75 DAS", "n_pct": 34, "p_pct": 0, "k_pct": 25},
        ],
    },
    "chickpea": {
        "season": "rabi",
        "n_kg_ha": 20, "p_kg_ha": 40, "k_kg_ha": 20,
        "source": "ICAR Fertilizer Recommendations, Chickpea, Table 7.3",
        "note": "Starter N only; fix atmospheric N with Mesorhizobium inoculant.",
        "stages": [
            {"stage": "Basal (sowing)", "n_pct": 100, "p_pct": 100, "k_pct": 100},
        ],
    },
    "tur": {
        "season": "kharif",
        "n_kg_ha": 20, "p_kg_ha": 50, "k_kg_ha": 0,
        "source": "ICAR Fertilizer Recommendations, Pigeonpea, Table 7.6",
        "note": "Basal only. Rhizobium inoculation recommended.",
        "stages": [
            {"stage": "Basal (sowing)", "n_pct": 100, "p_pct": 100, "k_pct": 100},
        ],
    },
    "rice": {
        "season": "kharif",
        "n_kg_ha": 100, "p_kg_ha": 50, "k_kg_ha": 50,
        "source": "ICAR Fertilizer Recommendations, Paddy (transplanted), Table 2.1",
        "note": "Transplanted irrigated paddy. Adjust N based on SPAD meter readings.",
        "stages": [
            {"stage": "Basal (transplanting)", "n_pct": 33, "p_pct": 100, "k_pct": 50},
            {"stage": "Active tillering (21 DAT)", "n_pct": 33, "p_pct": 0, "k_pct": 50},
            {"stage": "Panicle initiation (45 DAT)", "n_pct": 34, "p_pct": 0, "k_pct": 0},
        ],
    },
}

SOIL_TEST_ADJUSTMENT = {
    # If soil test N/P/K is known, adjust recommended dose.
    # Classification thresholds (kg/ha) for Maharashtra soils.
    "nitrogen": {
        "low": (0, 200, 1.0),       # < 200 kg/ha → apply full dose
        "medium": (200, 400, 0.75),  # 200–400 → apply 75%
        "high": (400, 9999, 0.5),   # > 400 → apply 50%
    },
    "phosphorus": {
        "low": (0, 10, 1.0),
        "medium": (10, 25, 0.75),
        "high": (25, 9999, 0.5),
    },
    "potassium": {
        "low": (0, 108, 1.0),
        "medium": (108, 280, 0.75),
        "high": (280, 9999, 0.5),
    },
}


def _soil_factor(nutrient: str, value_kg_ha: float | None) -> float:
    if value_kg_ha is None:
        return 1.0  # unknown → apply full dose
    bands = SOIL_TEST_ADJUSTMENT.get(nutrient, {})
    for _level, (lo, hi, factor) in bands.items():
        if lo <= value_kg_ha < hi:
            return factor
    return 1.0


def get_crop_recommendations(
    district: str | None,
    season: str,
    soil_ph: float | None = None,
    irrigation: bool = False,
) -> dict:
    season_key = season.lower()
    if season_key not in MAHARASHTRA_CROPS:
        return {
            "error": f"Season '{season}' not recognised. Use 'kharif' or 'rabi'.",
            "recommendations": [],
        }

    crops = MAHARASHTRA_CROPS[season_key]
    ranked = []
    for crop in crops:
        score = crop["suitability_score"]
        reasons = []
        warnings = []

        # District filter
        if district and crop["districts"] != ["all"]:
            if district not in crop["districts"]:
                score -= 2
                warnings.append(f"Less commonly grown in {district}.")

        # pH filter
        if soil_ph is not None:
            lo, hi = crop["soil_ph_range"]
            if not (lo <= soil_ph <= hi):
                score -= 3
                warnings.append(
                    f"Soil pH {soil_ph} is outside optimal range {lo}–{hi} for {crop['crop']}."
                )
            else:
                reasons.append(f"Soil pH {soil_ph} is within suitable range {lo}–{hi}.")

        # Irrigation filter
        if crop["irrigation"] == "irrigated" and not irrigation:
            score -= 2
            warnings.append(f"{crop['crop']} requires irrigation. Rainfed performance may be poor.")

        ranked.append({
            "crop": crop["crop"],
            "botanical_name": crop["botanical_name"],
            "suitability_score": max(score, 0),
            "season": season_key,
            "notes": crop["notes"],
            "reasons": reasons,
            "warnings": warnings,
            "irrigation_requirement": crop["irrigation"],
        })

    ranked.sort(key=lambda x: x["suitability_score"], reverse=True)
    return {
        "season": season_key,
        "district": district,
        "soil_ph_used": soil_ph,
        "irrigation_available": irrigation,
        "recommendations": ranked,
        "disclaimer": (
            "These rankings are based on general regional suitability rules from Maharashtra "
            "State agricultural guidelines. They do not account for local micro-climate, "
            "market conditions, or farm-specific constraints. Consult a local agronomist "
            "before making crop selection decisions."
        ),
        "data_source": "Maharashtra State Dept. of Agriculture crop calendars; ICAR regional guidelines.",
    }


def get_fertilizer_recommendation(
    crop: str,
    season: str,
    area_ha: float,
    soil_n: float | None = None,
    soil_p: float | None = None,
    soil_k: float | None = None,
) -> dict:
    crop_key = crop.lower().strip()
    rule = FERTILIZER_RULES.get(crop_key)

    if rule is None:
        return {
            "status": "unavailable",
            "message": (
                f"No validated fertilizer rule found for crop '{crop}'. "
                "Please consult a local agronomist or refer to ICAR recommendations "
                "for your specific crop and region."
            ),
            "crop": crop,
        }

    # Soil-test adjusted doses
    n_factor = _soil_factor("nitrogen", soil_n)
    p_factor = _soil_factor("phosphorus", soil_p)
    k_factor = _soil_factor("potassium", soil_k)

    n_per_ha = round(rule["n_kg_ha"] * n_factor, 1)
    p_per_ha = round(rule["p_kg_ha"] * p_factor, 1)
    k_per_ha = round(rule["k_kg_ha"] * k_factor, 1)

    stages = []
    for s in rule.get("stages", []):
        stages.append({
            "stage": s["stage"],
            "N_kg": round(n_per_ha * s["n_pct"] / 100, 1),
            "P2O5_kg": round(p_per_ha * s["p_pct"] / 100, 1),
            "K2O_kg": round(k_per_ha * s["k_pct"] / 100, 1),
            "N_total_farm": round(n_per_ha * s["n_pct"] / 100 * area_ha, 1),
            "P2O5_total_farm": round(p_per_ha * s["p_pct"] / 100 * area_ha, 1),
            "K2O_total_farm": round(k_per_ha * s["k_pct"] / 100 * area_ha, 1),
        })

    return {
        "status": "available",
        "crop": crop,
        "season": rule["season"],
        "area_ha": area_ha,
        "recommended_per_ha": {
            "N_kg": n_per_ha, "P2O5_kg": p_per_ha, "K2O_kg": k_per_ha,
            "units": "kg/ha (elemental basis)",
        },
        "recommended_total_farm": {
            "N_kg": round(n_per_ha * area_ha, 1),
            "P2O5_kg": round(p_per_ha * area_ha, 1),
            "K2O_kg": round(k_per_ha * area_ha, 1),
        },
        "soil_test_adjustment": {
            "applied": soil_n is not None or soil_p is not None or soil_k is not None,
            "N_factor": n_factor, "P_factor": p_factor, "K_factor": k_factor,
        },
        "application_stages": stages,
        "source": rule["source"],
        "agronomic_note": rule["note"],
        "disclaimer": (
            "Fertilizer quantities are calculated from ICAR reference values and adjusted "
            "for soil test results where provided. These are general recommendations. "
            "Actual application must be verified by a registered agronomist and may need "
            "adjustment for local soil, water, and variety conditions."
        ),
    }


def get_complete_treatment_plan(
    crop: str,
    area_acres: float,
    soil_params: dict,
    district: str = "Pune",
) -> dict:
    """
    Builds comprehensive Organic and Chemical Treatment Plans according to ICAR standards,
    scaled to the verified field area in acres.
    """
    ph = soil_params.get("pH", {}).get("value", 7.6)
    oc = soil_params.get("OC", {}).get("value", 0.55)
    n_val = soil_params.get("N", {}).get("value", 220.0)
    p_val = soil_params.get("P", {}).get("value", 18.0)
    k_val = soil_params.get("K", {}).get("value", 340.0)
    zn_val = soil_params.get("Zn", {}).get("value", 0.65)
    fe_val = soil_params.get("Fe", {}).get("value", 5.5)

    # Base rates per acre
    fym_tons_acre = 3.0 if oc < 0.5 else 2.0
    vermicompost_kg_acre = 800 if oc < 0.5 else 500
    urea_kg_acre = 70 if n_val < 200 else (55 if n_val < 300 else 40)
    dap_kg_acre = 45 if p_val < 15 else (35 if p_val < 25 else 25)
    mop_kg_acre = 30 if k_val < 200 else (20 if k_val < 350 else 10)
    znso4_kg_acre = 10 if zn_val < 0.6 else 5

    # Organic Treatment Plan
    organic_plan = {
        "title": "Comprehensive Organic Soil Enrichment Plan",
        "description": "Biological soil conditioning and carbon replenishment following ICAR bio-dynamics.",
        "interventions": [
            {
                "material": "Well-Decomposed Farmyard Manure (FYM)",
                "rate_per_acre": f"{fym_tons_acre} tonnes/acre",
                "total_quantity": f"{round(fym_tons_acre * area_acres, 1)} tonnes",
                "timing": "Basal: incorporate 3-4 weeks prior to sowing during field preparation",
                "purpose": "Improves soil water-holding capacity, microbial diversity, and organic carbon",
                "nutrient_contribution": "Provides balanced micro-amounts of N, P, K and humic acids",
            },
            {
                "material": "Enriched Vermicompost",
                "rate_per_acre": f"{vermicompost_kg_acre} kg/acre",
                "total_quantity": f"{round(vermicompost_kg_acre * area_acres, 1)} kg",
                "timing": "Apply in seed furrows at the time of sowing",
                "purpose": "Boosts earthworm casting microflora and increases available phosphorus uptake",
                "nutrient_contribution": "1.5-2.0% N, 1.0% P2O5, 1.5% K2O with high enzymatic activity",
            },
            {
                "material": "Biofertilizer Consortium (Azotobacter / Rhizobium + PSB)",
                "rate_per_acre": "2 kg / acre (or seed treatment @ 250g / 10kg seed)",
                "total_quantity": f"{round(2 * area_acres, 1)} kg",
                "timing": "Seed inoculation prior to sowing and soil drenching at 20-25 days",
                "purpose": "Biological nitrogen fixation and solubilization of locked native soil phosphorus",
                "nutrient_contribution": "Saves up to 20-25% chemical Nitrogen and Phosphorus requirement",
            },
            {
                "material": "Neem Cake Powder",
                "rate_per_acre": "100 kg / acre",
                "total_quantity": f"{round(100 * area_acres, 1)} kg",
                "timing": "Basal broadcast during primary tillage",
                "purpose": "Natural nitrification inhibitor; protects against root-knot nematodes and soil grubs",
                "nutrient_contribution": "Slow-release Nitrogen and soil insect repellent",
            },
        ],
    }

    # Chemical / Non-Organic Treatment Plan
    chemical_plan = {
        "title": "Scientific Chemical Fertilizer Plan (Balanced STCR Formulation)",
        "description": "Calculated Soil Test Crop Response (STCR) mineral doses scaled to verified acreage.",
        "interventions": [
            {
                "fertilizer": "Urea (46% Nitrogen)",
                "rate_per_acre": f"{urea_kg_acre} kg/acre",
                "total_quantity": f"{round(urea_kg_acre * area_acres, 1)} kg ({round((urea_kg_acre * area_acres)/50, 1)} bags of 50kg)",
                "timing": "Split: 50% Basal at sowing, 50% Top-dress at first irrigation / tillering",
                "cautions": "Do not apply on waterlogged fields. Incorporate into moist soil to avoid volatilization.",
            },
            {
                "fertilizer": "DAP (Diammonium Phosphate 18:46:0)",
                "rate_per_acre": f"{dap_kg_acre} kg/acre",
                "total_quantity": f"{round(dap_kg_acre * area_acres, 1)} kg ({round((dap_kg_acre * area_acres)/50, 1)} bags of 50kg)",
                "timing": "100% Basal: place 5cm below and beside the seed line at sowing",
                "cautions": "Ensure deep placement for root interception; do not mix directly with seed.",
            },
            {
                "fertilizer": "MOP (Muriate of Potash 60% K2O)",
                "rate_per_acre": f"{mop_kg_acre} kg/acre",
                "total_quantity": f"{round(mop_kg_acre * area_acres, 1)} kg ({round((mop_kg_acre * area_acres)/50, 1)} bags of 50kg)",
                "timing": "100% Basal application at final land preparation",
                "cautions": "Crucial for drought tolerance, disease resistance, and grain filling in Maharashtra soils.",
            },
            {
                "fertilizer": "Zinc Sulphate Heptahydrate (ZnSO4 21%)",
                "rate_per_acre": f"{znso4_kg_acre} kg/acre",
                "total_quantity": f"{round(znso4_kg_acre * area_acres, 1)} kg",
                "timing": "Basal broadcast every 2-3 cropping seasons",
                "cautions": "Do NOT mix Zinc Sulphate directly with DAP or water-soluble phosphate fertilizers (causes insoluble zinc phosphate precipitation).",
            },
        ],
    }

    # Side-by-Side Comparison
    comparison = [
        {
            "aspect": "Target Objective",
            "organic": "Long-term soil health, microbial regeneration, carbon build-up",
            "chemical": "Immediate crop nutrition, meeting peak stage vegetative & reproductive demand",
        },
        {
            "aspect": "Nutrient Availability Speed",
            "organic": "Slow and steady mineralization over 60-120 days",
            "chemical": "Rapid ionic release within 2-7 days of moisture contact",
        },
        {
            "aspect": "Soil Structural Impact",
            "organic": "Lowers bulk density, increases aeration and water retention",
            "chemical": "No structural improvement; continuous excess may cause secondary salinity",
        },
        {
            "aspect": "Recommendation Verdict",
            "organic": "Essential baseline for sustainable soil biology",
            "chemical": "Essential calibrated supplement to achieve targeted commercial yield",
        },
    ]

    return {
        "organic_plan": organic_plan,
        "chemical_plan": chemical_plan,
        "comparison": comparison,
    }
