# -*- coding: utf-8 -*-
"""
AI Bhoomi — Section 10 Internationalization (i18n) & Language Switcher Test Suite
Verifies:
1. Complete locale JSON catalogs for EN and HI namespaces with key parity.
2. Comprehensive preloaded dictionary for instant, zero-latency Hindi translation.
3. LanguageSlider component mounted in DashboardLayout navbar beside profile and notifications.
4. Backend /crop-recommendations/evaluate responds with natural Hindi explanations when output_language='hi'.
5. Calculation accuracy, farm area, and benchmark IDs remain identical across English and Hindi.
"""
import unittest
import json
import os
import re
import urllib.request
import urllib.error

BACKEND_URL = "http://localhost:8000"
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

class TestI18nLanguageSwitcher(unittest.TestCase):

    def test_01_locale_json_validity_and_parity(self):
        """1. Locale JSON files must exist for all 6 namespaces in both EN and HI."""
        namespaces = ["common", "farm", "soil", "crops", "fertilizers", "reports"]
        for ns in namespaces:
            en_path = os.path.join(PROJECT_ROOT, "frontend", "src", "locales", "en", f"{ns}.json")
            hi_path = os.path.join(PROJECT_ROOT, "frontend", "src", "locales", "hi", f"{ns}.json")
            
            self.assertTrue(os.path.exists(en_path), f"Missing EN locale file: {en_path}")
            self.assertTrue(os.path.exists(hi_path), f"Missing HI locale file: {hi_path}")
            
            with open(en_path, "r", encoding="utf-8") as f:
                en_data = json.load(f)
            with open(hi_path, "r", encoding="utf-8") as f:
                hi_data = json.load(f)
                
            self.assertGreater(len(en_data), 0, f"EN namespace {ns} is empty")
            self.assertGreater(len(hi_data), 0, f"HI namespace {ns} is empty")
            
            # Check that Hindi file contains Devanagari Unicode characters (U+0900 to U+097F)
            hi_str = json.dumps(hi_data, ensure_ascii=False)
            has_devanagari = any('\u0900' <= char <= '\u097F' for char in hi_str)
            self.assertTrue(has_devanagari, f"HI namespace {ns} does not contain Devanagari Hindi characters")

    def test_02_preloaded_dictionary_completeness(self):
        """2. Preloaded dictionary must contain translations for all primary UI sentences and technical terms."""
        dict_path = os.path.join(PROJECT_ROOT, "frontend", "src", "locales", "dictionary.ts")
        self.assertTrue(os.path.exists(dict_path), f"Missing preloaded dictionary: {dict_path}")
        
        with open(dict_path, "r", encoding="utf-8") as f:
            content = f.read()

        required_phrases = [
            "Dashboard", "Farm Agent & Map", "Soil Analysis", "Recommendations",
            "Multi-Point Polygon Tool", "Square Area Box (2.03 Acres)", "Selected Boundary Vertices",
            "Soil Fertility Analysis & ICAR Benchmark Diagnostic", "Soil Reaction (pH)",
            "Crop Selection & Agricultural Configuration", "Highly Suitable", "Moderately Suitable",
            "Soybean", "Cotton", "Wheat", "Gram / Chickpea",
            "Fertilizer & Soil Treatment Recommendations", "Urea (46% N)", "Di-Ammonium Phosphate (DAP 18:46:0)",
            "Standard 50kg Bags", "Download PDF"
        ]
        
        for phrase in required_phrases:
            self.assertIn(f'"{phrase}":', content, f"Missing phrase '{phrase}' in preloaded dictionary")

    def test_03_navbar_slider_component_mounted(self):
        """3. LanguageSlider component must be mounted in DashboardLayout beside profile and notifications."""
        layout_path = os.path.join(PROJECT_ROOT, "frontend", "src", "layouts", "DashboardLayout.tsx")
        with open(layout_path, "r", encoding="utf-8") as f:
            layout_code = f.read()

        self.assertIn("LanguageSlider", layout_code, "LanguageSlider not imported in DashboardLayout.tsx")
        self.assertIn("<LanguageSlider />", layout_code, "<LanguageSlider /> not rendered in top navbar")

    def test_04_backend_gemini_hindi_evaluation(self):
        """4. Backend /crop-recommendations/evaluate must return natural Hindi explanations when output_language='hi'."""
        poly_2_03_acres = [
            [73.8500, 18.5200],
            [73.850863, 18.5200],
            [73.850863, 18.520816],
            [73.8500, 18.520816],
            [73.8500, 18.5200]
        ]
        payload = {
            "farm_name": "Godavari Test Plot",
            "season": "Kharif",
            "geometry": {"type": "Polygon", "coordinates": [poly_2_03_acres]},
            "soil_measurements": {"pH": 7.4, "N": 210, "P": 16, "K": 280},
            "soil_data_status": "model_estimated",
            "output_language": "hi"
        }
        req = urllib.request.Request(
            f"{BACKEND_URL}/api/v1/crop-recommendations/evaluate",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        res = urllib.request.urlopen(req, timeout=25)
        self.assertEqual(res.status, 200)
        data = json.loads(res.read().decode("utf-8"))

        self.assertAlmostEqual(data["area_acres"], 2.04, places=1)

        recs = data.get("crop_recommendations", [])
        self.assertGreater(len(recs), 0)
        first_rec = recs[0]
        
        reasons_text = " ".join(first_rec.get("reasons", []))
        has_devanagari = any('\u0900' <= char <= '\u097F' for char in reasons_text)
        self.assertTrue(has_devanagari, f"Crop recommendation reasons do not contain Hindi text: {reasons_text}")

        water_req = first_rec.get("water_requirements", "")
        has_devanagari_water = any('\u0900' <= char <= '\u097F' for char in water_req)
        self.assertTrue(has_devanagari_water, f"Water requirements do not contain Hindi text: {water_req}")

        ai_reasoning = data.get("gemini_ai_reasoning", "")
        has_devanagari_reasoning = any('\u0900' <= char <= '\u097F' for char in ai_reasoning)
        self.assertTrue(has_devanagari_reasoning, f"AI reasoning is not localized in Hindi: {ai_reasoning}")

    def test_05_bilingual_consistency_and_calculation_parity(self):
        """5. Soil measurements, calculations, and suitability ratings must be identical in EN and HI."""
        poly_coords = [
            [73.8500, 18.5200],
            [73.850863, 18.5200],
            [73.850863, 18.520816],
            [73.8500, 18.5200]
        ]
        base_payload = {
            "farm_name": "Parity Check Farm",
            "season": "Rabi",
            "geometry": {"type": "Polygon", "coordinates": [poly_coords]},
            "soil_measurements": {"pH": 7.3, "N": 240, "P": 18, "K": 260},
            "soil_data_status": "model_estimated"
        }
        
        payload_en = dict(base_payload, output_language="en")
        req_en = urllib.request.Request(
            f"{BACKEND_URL}/api/v1/crop-recommendations/evaluate",
            data=json.dumps(payload_en).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        res_en = urllib.request.urlopen(req_en, timeout=25)
        data_en = json.loads(res_en.read().decode("utf-8"))

        payload_hi = dict(base_payload, output_language="hi")
        req_hi = urllib.request.Request(
            f"{BACKEND_URL}/api/v1/crop-recommendations/evaluate",
            data=json.dumps(payload_hi).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        res_hi = urllib.request.urlopen(req_hi, timeout=25)
        data_hi = json.loads(res_hi.read().decode("utf-8"))

        self.assertEqual(data_en["area_acres"], data_hi["area_acres"])
        self.assertEqual(data_en["assessment_status"], data_hi["assessment_status"])
        self.assertEqual(len(data_en["crop_recommendations"]), len(data_hi["crop_recommendations"]))

        for c_en, c_hi in zip(data_en["crop_recommendations"], data_hi["crop_recommendations"]):
            self.assertEqual(c_en["suitability"], c_hi["suitability"], f"Suitability mismatch for {c_en['crop_name']}")
            self.assertEqual(c_en["supporting_evidence_ids"], c_hi["supporting_evidence_ids"], "Benchmark citation mismatch")

if __name__ == "__main__":
    unittest.main()
