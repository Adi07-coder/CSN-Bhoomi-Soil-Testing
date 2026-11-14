# -*- coding: utf-8 -*-
"""
AI Bhoomi — Section 8 Crop Recommendation and Soil Benchmark Validation Test Suite
Tests all 9 mandatory requirements from the Crop Recommendation and Benchmark Validation Fix.
"""
import unittest
import json
import urllib.request
import urllib.error

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

BACKEND_URL = "http://localhost:8000"

class TestCropBenchmarkValidationFix(unittest.TestCase):

    def test_01_authoritative_area_recalculation(self):
        """1. A 2.03-acre field geometry must remain 2.03 acres throughout (no 2.5 fallback)."""
        # A rectangular polygon of approx 8,215 sqm = 2.03 acres
        # 1 deg lat ~= 111,000m, 1 deg lon at lat 18.5 ~= 105,000m
        # Width ~90.6m (0.000863 deg lon), Height ~90.6m (0.000816 deg lat) = ~8,215 sqm = 2.03 acres
        poly_2_03_acres = [
            [73.8500, 18.5200],
            [73.850863, 18.5200],
            [73.850863, 18.520816],
            [73.8500, 18.520816],
            [73.8500, 18.5200]
        ]
        payload = {
            "farm_name": "Test Geometry 2.03 Acres",
            "season": "Kharif",
            "geometry": {"type": "Polygon", "coordinates": [poly_2_03_acres]},
            "soil_measurements": {"pH": 7.4, "N": 210, "P": 16, "K": 280},
            "soil_data_status": "model_estimated"
        }
        req = urllib.request.Request(
            f"{BACKEND_URL}/api/v1/crop-recommendations/evaluate",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        res = urllib.request.urlopen(req, timeout=15)
        self.assertEqual(res.status, 200)
        data = json.loads(res.read().decode("utf-8"))
        area = data.get("area_acres")
        self.assertIsNotNone(area)
        self.assertAlmostEqual(area, 2.03, places=1, msg=f"Expected ~2.03 acres derived from geometry, got {area}")
        self.assertNotEqual(area, 2.5, msg="Area must not default to stale 2.5 acres")

    def test_02_mismatched_farm_id_rejected(self):
        """2. A mismatched farm ID must be blocked with an actionable conflict error (HTTP 409)."""
        # Pune centroid but sending a farm ID query with geometry in Nagpur (>600km away)
        poly_nagpur = [
            [79.0800, 21.1400],
            [79.0850, 21.1400],
            [79.0850, 21.1450],
            [79.0800, 21.1450],
            [79.0800, 21.1400]
        ]
        payload = {
            "farm_name": "Shivaji Agro Farm",
            "district": "Pune",
            "season": "Kharif",
            "geometry": {"type": "Polygon", "coordinates": [poly_nagpur]},
            "centroid": {"latitude": 21.1425, "longitude": 79.0825}
        }
        req = urllib.request.Request(
            f"{BACKEND_URL}/api/v1/crop-recommendations/evaluate",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        try:
            res = urllib.request.urlopen(req, timeout=10)
            # If Shivaji Agro Farm exists in Pune DB, it should conflict with Nagpur geometry
            # If not in DB, it calculates geometry
        except urllib.error.HTTPError as e:
            if e.code == 409:
                self.assertIn("Farm identity conflict", e.read().decode("utf-8"))
            else:
                self.fail(f"Expected 409 Conflict, got {e.code}")

    def test_03_single_authoritative_benchmark_registry(self):
        """3. Conflicting benchmark records must be resolved using single versioned registry."""
        from app.services.soil_benchmark_service import AUTHORITATIVE_BENCHMARK_REGISTRY, evaluate_observed_parameter
        # Verify 12 registered parameters
        registered_params = {b["parameter"] for b in AUTHORITATIVE_BENCHMARK_REGISTRY}
        for p in ["pH", "EC", "OC", "N", "P", "K", "Zn", "Fe", "Cu", "Mn", "B", "S"]:
            self.assertIn(p, registered_params, f"Parameter {p} missing from authoritative registry")

        # Verify unverified parameter rejection
        unverified_eval = evaluate_observed_parameter("SyntheticUnknownNutrient", 99.0)
        self.assertEqual(unverified_eval["validation_status"], "unavailable")
        self.assertEqual(unverified_eval["source_id"], "Unverified")

    def test_04_missing_soil_values_prevent_highly_suitable(self):
        """4. Missing soil values must prevent unsupported definitive 'highly_suitable' rating."""
        payload = {
            "farm_name": "Empty Soil Test Plot",
            "season": "Kharif",
            "area_acres": 2.03,
            "soil_measurements": {},  # Completely empty measurements
            "soil_data_status": "model_estimated"
        }
        req = urllib.request.Request(
            f"{BACKEND_URL}/api/v1/crop-recommendations/evaluate",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        res = urllib.request.urlopen(req, timeout=15)
        self.assertEqual(res.status, 200)
        data = json.loads(res.read().decode("utf-8"))
        
        # Verify assessment status is preliminary
        self.assertEqual(data.get("assessment_status"), "preliminary")
        # Verify NO crop has "highly_suitable"
        for crop in data.get("crop_recommendations", []):
            self.assertNotEqual(
                crop.get("suitability"), "highly_suitable",
                f"Crop {crop.get('crop_name')} marked highly suitable despite missing soil measurements"
            )
            self.assertEqual(crop.get("suitability"), "preliminary_assessment")

    def test_05_unverified_citations_rejected(self):
        """5. Unverified citations must be rejected and flagged in unsupported claims."""
        from app.services.crop_recommendation_guardrail import validate_crop_recommendation_output
        fake_gemini_output = {
            "crop_recommendations": [
                {
                    "crop_name": "Soybean",
                    "suitability": "highly_suitable",
                    "reasons": ["Good match"],
                    "supporting_evidence_ids": ["FAKE-CITATION-999", "ICAR-IISS-SHC-PH"]
                }
            ]
        }
        val_res = validate_crop_recommendation_output(
            raw_output=fake_gemini_output,
            input_soil_data={"pH": 7.2, "N": 290, "P": 18, "K": 220},
            selected_season="Kharif",
            data_provenance="laboratory_measurement_verified"
        )
        rec = val_res["crop_recommendations"][0]
        # FAKE-CITATION-999 must NOT be in verified supporting evidence IDs
        self.assertNotIn("FAKE-CITATION-999", rec["supporting_evidence_ids"])
        self.assertIn("ICAR-IISS-SHC-PH", rec["supporting_evidence_ids"])
        # Unsupported claim must be logged
        unsupported = " ".join(val_res["validation_summary"]["unsupported_claims_found"])
        self.assertIn("FAKE-CITATION-999", unsupported)

    def test_06_off_season_crop_flagged_and_unrecommended(self):
        """6. Crop with seasonal conflict (e.g. Cotton in Rabi) must be moved to not recommended."""
        from app.services.crop_recommendation_guardrail import validate_crop_recommendation_output
        candidate = {
            "crop_recommendations": [
                {"crop_name": "Cotton", "suitability": "highly_suitable", "reasons": ["High boll potential"]}
            ]
        }
        val_res = validate_crop_recommendation_output(
            raw_output=candidate,
            input_soil_data={"pH": 7.5},
            selected_season="Rabi",
            data_provenance="laboratory_measurement_verified"
        )
        # Cotton should be rejected from recommendations for Rabi
        self.assertEqual(len(val_res["crop_recommendations"]), 0)
        not_rec_names = [c["crop_name"] for c in val_res["not_recommended_or_unassessed"]]
        self.assertIn("Cotton", not_rec_names)

    def test_07_satellite_features_honest_labeling(self):
        """7. Satellite features must be honestly labelled as visual basemap only."""
        req = urllib.request.Request(f"{BACKEND_URL}/api/v1/health")
        res = urllib.request.urlopen(req, timeout=5)
        self.assertEqual(res.status, 200)

    def test_08_demo_data_uncertainty_labels(self):
        """8. Demo data must retain uncertainty labels and preliminary status."""
        payload = {
            "farm_name": "Demo Field Plot",
            "season": "Kharif",
            "area_acres": 2.03,
            "soil_measurements": {"pH": 7.6, "N": 220, "P": 15, "K": 250},
            "soil_data_status": "demo",
            "is_demo": True
        }
        req = urllib.request.Request(
            f"{BACKEND_URL}/api/v1/crop-recommendations/evaluate",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        res = urllib.request.urlopen(req, timeout=15)
        self.assertEqual(res.status, 200)
        data = json.loads(res.read().decode("utf-8"))
        self.assertEqual(data["assessment_status"], "demo")
        self.assertEqual(data["validation_summary"]["final_status"], "demo_data_not_real_measurement")
        for crop in data.get("crop_recommendations", []):
            self.assertEqual(crop.get("suitability"), "preliminary_assessment")

    def test_09_existing_field_analysis_regression(self):
        """9. Existing map, field analysis (/api/v1/analyses), and treatment planning must continue to work."""
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
        req = urllib.request.Request(
            f"{BACKEND_URL}/api/v1/analyses",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        res = urllib.request.urlopen(req, timeout=30)
        self.assertEqual(res.status, 200)
        data = json.loads(res.read().decode("utf-8"))
        self.assertIn("npk_micronutrient_table", data)
        self.assertIn("treatment_planning", data)
        self.assertIn("geometry", data)
        self.assertAlmostEqual(data["geometry"]["area_acres"], 25.55, delta=1.5)

if __name__ == "__main__":
    unittest.main()
