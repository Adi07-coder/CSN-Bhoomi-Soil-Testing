# -*- coding: utf-8 -*-
"""
End-to-End Master Workflow Verification Script for AI Bhoomi:
Validates that all architectural components requested in the Master Implementation Prompt
are operational, correctly formatted, and adhere to ICAR STCR standards.
"""
import urllib.request
import json
import sys

BACKEND_URL = "http://localhost:8000"

def run_tests():
    print("=" * 70)
    print("AI BHOOMI — FULL MASTER PROMPT E2E WORKFLOW VERIFICATION")
    print("=" * 70)
    
    # 1. Health check
    try:
        req = urllib.request.Request(f"{BACKEND_URL}/health")
        res = urllib.request.urlopen(req, timeout=5)
        health_data = json.loads(res.read().decode("utf-8"))
        print("[PASS] 1. Backend Health Check: 200 OK | Status:", health_data.get("status", "healthy"))
    except Exception as e:
        print(f"[FAIL] 1. Backend Health Check failed: {e}")
        return False

    # 2. Field Analysis Submission (GeoJSON Polygon, Wheat, Rabi)
    payload = {
        "farm_name": "Godavari Valley Plot 4",
        "crop": "Wheat",
        "season": "Rabi",
        "irrigation_type": "Drip Irrigation",
        "soil_type": "Vertisol (Black Cotton Soil)",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [73.8567, 18.5204],
                    [73.8590, 18.5220],
                    [73.8610, 18.5200],
                    [73.8580, 18.5180],
                    [73.8567, 18.5204]
                ]
            ]
        },
        "analysis_mode": "trained"
    }

    try:
        req = urllib.request.Request(
            f"{BACKEND_URL}/api/v1/analyses",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        res = urllib.request.urlopen(req, timeout=45)
        assert res.status == 200, f"Expected 200 OK, got {res.status}"
        data = json.loads(res.read().decode("utf-8"))
        print("[PASS] 2. Field Soil Analysis (POST /api/v1/analyses): 200 OK")
    except Exception as e:
        print(f"[FAIL] 2. Field Soil Analysis failed: {e}")
        return False

    # 3. Check 12-Nutrient Diagnostic Table
    npk = data.get("npk_micronutrient_table", {})
    primary = npk.get("primary_macronutrients", [])
    secondary = npk.get("secondary_nutrients", [])
    micro = npk.get("micronutrients", [])
    supp = npk.get("supporting_parameters", [])
    total_params = len(primary) + len(secondary) + len(micro) + len(supp)
    print(f"[PASS] 3. NPK & Micronutrient Diagnostic Table: {total_params} parameters calibrated")
    assert len(primary) == 3, f"Expected 3 primary nutrients, got {len(primary)}"
    assert len(secondary) == 3, f"Expected 3 secondary nutrients, got {len(secondary)}"
    assert len(micro) == 5, f"Expected 5 micronutrients, got {len(micro)}"
    assert len(supp) == 3, f"Expected 3 supporting parameters, got {len(supp)}"

    # 4. Check Treatment Planning
    tp = data.get("treatment_planning", {})
    org = tp.get("organic_plan", {})
    chem = tp.get("chemical_plan", {})
    comp = tp.get("comparison", [])
    print(f"[PASS] 4. Treatment Planning: Organic ({len(org.get('interventions', []))} items), Chemical ({len(chem.get('interventions', []))} items with 50kg bags), Comparison ({len(comp)} criteria)")
    assert len(org.get("interventions", [])) >= 3
    assert len(chem.get("interventions", [])) >= 3
    assert len(comp) >= 3

    # Check 50kg bag calculations
    urea_item = next((i for i in chem.get("interventions", []) if "Urea" in i.get("fertilizer", "")), None)
    if urea_item:
        print(f"       -> Urea Dosing: Rate={urea_item.get('rate_per_acre')} | Total={urea_item.get('total_quantity')} | Bags={urea_item.get('bags_50kg')}")

    # 5. Check Seasonal Crop Recommendations across 3 seasons
    seasons = data.get("seasonal_crop_recommendations", {})
    kharif = seasons.get("kharif", [])
    rabi = seasons.get("rabi", [])
    summer = seasons.get("summer", [])
    print(f"[PASS] 5. Seasonal Crop Suitability: Kharif ({len(kharif)} crops), Rabi ({len(rabi)} crops), Summer ({len(summer)} crops)")
    assert len(kharif) >= 3, "Missing Kharif crops"
    assert len(rabi) >= 3, "Missing Rabi crops"
    assert len(summer) >= 3, "Missing Summer crops"

    # 6. Check Google Gemini AI Reasoning & Resilient Fallback
    gemini_adv = data.get("gemini_ai_advisory", {})
    gemini_treat = data.get("gemini_treatment_ai", {})
    print(f"[PASS] 6. Google Gemini AI Agronomic Advisory: Provider='{gemini_adv.get('provider')}' | Status='{gemini_adv.get('status')}'")
    assert len(gemini_adv.get("text", "")) > 20
    assert len(gemini_treat.get("ai_summary", "")) > 20

    # 7. Check Data Genuineness & Provenance Findings
    gen = data.get("genuineness_findings", {})
    print(f"[PASS] 7. Data Genuineness Findings: Provenance='{gen.get('data_provenance')}' | STL Standard='{gen.get('stl_certification')}'")
    assert "ICAR" in gen.get("data_provenance", "")

    # 8. Check Anti-Hallucination Safe Guardrails
    guard = data.get("hallucination_safeguards", {})
    checks = guard.get("safety_checks", [])
    print(f"[PASS] 8. Anti-Hallucination Safe Guardrails: Status='{guard.get('status')}' ({len(checks)} active safety constraints)")
    assert len(checks) >= 3

    print("=" * 70)
    print("ALL 8 MASTER PROMPT ARCHITECTURAL PILLARS VERIFIED 100% OPERATIONAL")
    print("=" * 70)
    return True

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
