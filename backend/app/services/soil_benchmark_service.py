# -*- coding: utf-8 -*-
"""
Authoritative Soil Benchmark Registry for ICAR-IISS and Maharashtra Standards.
Version: 2024.1 (ICAR-IISS National Soil Health Card Scheme & MPKV Rahuri)
Provides single source of truth for soil fertility classifications and agronomic evidence.
"""
from typing import Dict, Any, List, Optional

# Single Authoritative Benchmark Registry
AUTHORITATIVE_BENCHMARK_REGISTRY: List[Dict[str, Any]] = [
    {
        "source_id": "ICAR-IISS-SHC-PH",
        "parameter": "pH",
        "parameter_name": "Soil Reaction (pH)",
        "unit": "pH",
        "optimal_range": [6.5, 7.8],
        "low_threshold": 6.5,
        "high_threshold": 8.5,
        "reference": "6.5 - 7.8 (Neutral to Slightly Alkaline)",
        "soil_test_method": "1:2.5 Soil-Water Suspension, Glass Electrode Potentiometry",
        "geographical_scope": "National ICAR-IISS & Maharashtra Vertisols",
        "source_institution": "ICAR - Indian Institute of Soil Science, Bhopal",
        "publication_title": "Soil Health Card Scheme Technical Classification Standards",
        "version": "2020.1",
        "official_reference_url": "https://soilhealth.dac.gov.in/guidelines",
        "verification_status": "Verified",
        "limitations": "Standard for Black Vertisols; coastal Lateritic soils in Konkan require a separate 5.5 - 6.5 baseline."
    },
    {
        "source_id": "ICAR-IISS-SHC-EC",
        "parameter": "EC",
        "parameter_name": "Electrical Conductivity (EC)",
        "unit": "dS/m",
        "optimal_range": [0.0, 1.0],
        "low_threshold": 0.0,
        "high_threshold": 1.0,
        "reference": "< 1.0 dS/m (Normal, Non-Saline)",
        "soil_test_method": "1:2.5 Soil-Water Suspension, Conductivity Meter",
        "geographical_scope": "National ICAR-IISS & Maharashtra Agricultural Zones",
        "source_institution": "ICAR - Indian Institute of Soil Science, Bhopal",
        "publication_title": "Soil Salinity Assessment & Crop Tolerance Classification",
        "version": "2020.1",
        "official_reference_url": "https://soilhealth.dac.gov.in/guidelines",
        "verification_status": "Verified",
        "limitations": "Applies to 1:2.5 soil-water suspension; saturated extract ECe is approximately double."
    },
    {
        "source_id": "ICAR-IISS-SHC-OC",
        "parameter": "OC",
        "parameter_name": "Organic Carbon (OC)",
        "unit": "%",
        "optimal_range": [0.50, 0.75],
        "low_threshold": 0.50,
        "high_threshold": 0.75,
        "reference": "0.50 - 0.75% (Medium Carbon)",
        "soil_test_method": "Walkley-Black Wet Oxidation Method (Chromic Acid Digestion)",
        "geographical_scope": "National ICAR-IISS Standards for Indian Soils",
        "source_institution": "ICAR - Indian Institute of Soil Science, Bhopal",
        "publication_title": "Soil Organic Carbon Management in Tropical Vertisols",
        "version": "2020.1",
        "official_reference_url": "https://soilhealth.dac.gov.in/guidelines",
        "verification_status": "Verified",
        "limitations": "High tropical temperatures accelerate organic matter decomposition."
    },
    {
        "source_id": "MPKV-STCR-2024-N",
        "parameter": "N",
        "parameter_name": "Available Nitrogen (N)",
        "unit": "kg/ha",
        "optimal_range": [280.0, 560.0],
        "low_threshold": 280.0,
        "high_threshold": 560.0,
        "reference": "280 - 560 kg/ha (Medium Available Nitrogen)",
        "soil_test_method": "Subbiah & Asija (1956) Alkaline Permanganate Distillation",
        "geographical_scope": "Maharashtra Vertisols (MPKV Rahuri & VNMKV Parbhani)",
        "source_institution": "Mahatma Phule Krishi Vidyapeeth (MPKV), Rahuri",
        "publication_title": "Soil Test Crop Response (STCR) Recommendations for Maharashtra",
        "version": "2024.1",
        "official_reference_url": "https://mpkv.ac.in/research/stcr",
        "verification_status": "Verified",
        "limitations": "Measures readily mineralizable nitrogen, not total organic nitrogen."
    },
    {
        "source_id": "MPKV-STCR-2024-P",
        "parameter": "P",
        "parameter_name": "Available Phosphorus (P2O5)",
        "unit": "kg/ha",
        "optimal_range": [10.0, 25.0],
        "low_threshold": 10.0,
        "high_threshold": 25.0,
        "reference": "10 - 25 kg/ha (Medium Available P2O5)",
        "soil_test_method": "Olsen Method (0.5M NaHCO3, pH 8.5) Spectrophotometry",
        "geographical_scope": "Maharashtra Calcareous Black Soils",
        "source_institution": "Mahatma Phule Krishi Vidyapeeth (MPKV), Rahuri",
        "publication_title": "Phosphorus Calibration and Management in Alkaline Soils",
        "version": "2024.1",
        "official_reference_url": "https://mpkv.ac.in/research/stcr",
        "verification_status": "Verified",
        "limitations": "In alkaline vertisols (pH > 8.0), fixation with calcium carbonate limits phosphorus availability."
    },
    {
        "source_id": "MPKV-STCR-2024-K",
        "parameter": "K",
        "parameter_name": "Available Potassium (K2O)",
        "unit": "kg/ha",
        "optimal_range": [140.0, 280.0],
        "low_threshold": 140.0,
        "high_threshold": 280.0,
        "reference": "140 - 280 kg/ha (Medium Available K2O)",
        "soil_test_method": "1N Neutral Ammonium Acetate Extraction, Flame Photometry",
        "geographical_scope": "Maharashtra Deccan Basalt Vertisols",
        "source_institution": "Mahatma Phule Krishi Vidyapeeth (MPKV), Rahuri",
        "publication_title": "Potassium Delineation in Deccan Vertisols",
        "version": "2024.1",
        "official_reference_url": "https://mpkv.ac.in/research/stcr",
        "verification_status": "Verified",
        "limitations": "Vertisols often test high in non-exchangeable K; responses vary under moisture stress."
    },
    {
        "source_id": "ICAR-AICRP-2021-ZN",
        "parameter": "Zn",
        "parameter_name": "DTPA Extractable Zinc (Zn)",
        "unit": "mg/kg",
        "optimal_range": [0.60, 2.0],
        "low_threshold": 0.60,
        "high_threshold": 2.0,
        "reference": ">= 0.60 mg/kg (Critical DTPA Threshold)",
        "soil_test_method": "DTPA-CaCl2 Extraction (Lindsay & Norvell, 1978), AAS",
        "geographical_scope": "National ICAR-AICRP Micronutrient Delineation",
        "source_institution": "ICAR - AICRP on Micro and Secondary Nutrients, IISS Bhopal",
        "publication_title": "Micronutrients in Indian Soils: Status and Management",
        "version": "2021.2",
        "official_reference_url": "https://iiss.icar.gov.in/aicrp-mspe",
        "verification_status": "Verified",
        "limitations": "Zinc deficiency is widespread in high-pH (>8.0) calcareous black soils."
    },
    {
        "source_id": "ICAR-AICRP-2021-FE",
        "parameter": "Fe",
        "parameter_name": "DTPA Extractable Iron (Fe)",
        "unit": "mg/kg",
        "optimal_range": [4.5, 15.0],
        "low_threshold": 4.5,
        "high_threshold": 15.0,
        "reference": ">= 4.5 mg/kg (Critical DTPA Threshold)",
        "soil_test_method": "DTPA-CaCl2 Extraction, Atomic Absorption Spectrophotometry",
        "geographical_scope": "National ICAR-AICRP Standards",
        "source_institution": "ICAR - AICRP on Micro and Secondary Nutrients",
        "publication_title": "Micronutrients in Indian Soils: Status and Management",
        "version": "2021.2",
        "official_reference_url": "https://iiss.icar.gov.in/aicrp-mspe",
        "verification_status": "Verified",
        "limitations": "Prone to lime-induced iron chlorosis in high calcium vertisols."
    },
    {
        "source_id": "ICAR-AICRP-2021-CU",
        "parameter": "Cu",
        "parameter_name": "DTPA Extractable Copper (Cu)",
        "unit": "mg/kg",
        "optimal_range": [0.20, 2.0],
        "low_threshold": 0.20,
        "high_threshold": 2.0,
        "reference": ">= 0.20 mg/kg (Critical DTPA Threshold)",
        "soil_test_method": "DTPA-CaCl2 Extraction, AAS",
        "geographical_scope": "National ICAR-AICRP Standards",
        "source_institution": "ICAR - AICRP on Micro and Secondary Nutrients",
        "publication_title": "Micronutrients in Indian Soils: Status and Management",
        "version": "2021.2",
        "official_reference_url": "https://iiss.icar.gov.in/aicrp-mspe",
        "verification_status": "Verified",
        "limitations": "Generally adequate across Maharashtra black soils."
    },
    {
        "source_id": "ICAR-AICRP-2021-MN",
        "parameter": "Mn",
        "parameter_name": "DTPA Extractable Manganese (Mn)",
        "unit": "mg/kg",
        "optimal_range": [2.0, 20.0],
        "low_threshold": 2.0,
        "high_threshold": 20.0,
        "reference": ">= 2.0 mg/kg (Critical DTPA Threshold)",
        "soil_test_method": "DTPA-CaCl2 Extraction, AAS",
        "geographical_scope": "National ICAR-AICRP Standards",
        "source_institution": "ICAR - AICRP on Micro and Secondary Nutrients",
        "publication_title": "Micronutrients in Indian Soils: Status and Management",
        "version": "2021.2",
        "official_reference_url": "https://iiss.icar.gov.in/aicrp-mspe",
        "verification_status": "Verified",
        "limitations": "Sufficient in medium to deep black soils."
    },
    {
        "source_id": "ICAR-AICRP-2021-B",
        "parameter": "B",
        "parameter_name": "Hot-Water Extractable Boron (B)",
        "unit": "mg/kg",
        "optimal_range": [0.50, 1.5],
        "low_threshold": 0.50,
        "high_threshold": 1.5,
        "reference": ">= 0.50 mg/kg (Critical Boron Threshold)",
        "soil_test_method": "Hot Water Extraction (Berger & Truog, 1944), Azomethine-H",
        "geographical_scope": "National ICAR-AICRP Standards",
        "source_institution": "ICAR - AICRP on Micro and Secondary Nutrients",
        "publication_title": "Micronutrients in Indian Soils: Status and Management",
        "version": "2021.2",
        "official_reference_url": "https://iiss.icar.gov.in/aicrp-mspe",
        "verification_status": "Verified",
        "limitations": "Essential for reproductive development and pod set in pulses and oilseeds."
    },
    {
        "source_id": "ICAR-AICRP-2021-S",
        "parameter": "S",
        "parameter_name": "Available Sulphur (S)",
        "unit": "mg/kg",
        "optimal_range": [10.0, 20.0],
        "low_threshold": 10.0,
        "high_threshold": 20.0,
        "reference": ">= 10.0 mg/kg (Critical Available Sulphur)",
        "soil_test_method": "0.15% CaCl2 Extraction, Turbidimetry (Chesnin & Yien, 1951)",
        "geographical_scope": "National ICAR-AICRP Standards",
        "source_institution": "ICAR - AICRP on Micro and Secondary Nutrients",
        "publication_title": "Secondary Nutrients in Indian Agriculture",
        "version": "2021.2",
        "official_reference_url": "https://iiss.icar.gov.in/aicrp-mspe",
        "verification_status": "Verified",
        "limitations": "Crucial for protein and oil synthesis in soybean and pulses."
    }
]

VERIFIED_BENCHMARKS = AUTHORITATIVE_BENCHMARK_REGISTRY

def get_verified_benchmarks() -> List[Dict[str, Any]]:
    return AUTHORITATIVE_BENCHMARK_REGISTRY

def evaluate_observed_parameter(param_key: str, observed_value: Optional[float]) -> Dict[str, Any]:
    """
    Evaluates an observed soil value against the official ICAR benchmark.
    Missing values remain missing; they are never replaced with assumed numbers.
    """
    normalized_key = param_key.strip().upper()
    if normalized_key in ["PH", "SOIL_PH", "REACTION"]:
        norm_param = "pH"
    elif normalized_key in ["EC", "CONDUCTIVITY", "ELECTRICAL_CONDUCTIVITY"]:
        norm_param = "EC"
    elif normalized_key in ["OC", "ORGANIC_CARBON", "CARBON"]:
        norm_param = "OC"
    elif normalized_key in ["N", "NITROGEN", "AVAILABLE_N"]:
        norm_param = "N"
    elif normalized_key in ["P", "PHOSPHORUS", "P2O5", "AVAILABLE_P"]:
        norm_param = "P"
    elif normalized_key in ["K", "POTASSIUM", "K2O", "AVAILABLE_K"]:
        norm_param = "K"
    elif normalized_key in ["ZN", "ZINC"]:
        norm_param = "Zn"
    elif normalized_key in ["FE", "IRON"]:
        norm_param = "Fe"
    elif normalized_key in ["CU", "COPPER"]:
        norm_param = "Cu"
    elif normalized_key in ["MN", "MANGANESE"]:
        norm_param = "Mn"
    elif normalized_key in ["B", "BORON"]:
        norm_param = "B"
    elif normalized_key in ["S", "SULPHUR", "SULFUR"]:
        norm_param = "S"
    else:
        norm_param = param_key

    benchmark = next((b for b in AUTHORITATIVE_BENCHMARK_REGISTRY if b["parameter"].lower() == norm_param.lower()), None)
    
    if not benchmark:
        return {
            "parameter": param_key,
            "observed_value": observed_value,
            "unit": "",
            "reference": "No authoritative standard in registry",
            "source_id": "Unverified",
            "validation_status": "unavailable",
            "status_label": "unverified",
            "soil_test_method": "Unspecified",
            "explanation": f"Parameter '{param_key}' is not registered in the verified ICAR-IISS / MPKV standard catalogue."
        }
    
    if observed_value is None:
        return {
            "parameter": benchmark["parameter"],
            "observed_value": None,
            "unit": benchmark["unit"],
            "reference": benchmark["reference"],
            "source_id": benchmark["source_id"],
            "validation_status": "unavailable",
            "status_label": "missing",
            "soil_test_method": benchmark["soil_test_method"],
            "explanation": f"Observed field value for '{benchmark['parameter_name']}' was not provided."
        }
        
    val = float(observed_value)
    low = benchmark["low_threshold"]
    high = benchmark["high_threshold"]
    
    if benchmark["parameter"] == "pH":
        if val < 6.5:
            status_label = "acidic"
            explanation = f"Soil pH of {val:.2f} is acidic (< 6.5). Requires lime / dolomite application."
        elif val <= 7.8:
            status_label = "optimal"
            explanation = f"Soil pH of {val:.2f} is in the optimal neutral-to-slightly alkaline range (6.5 - 7.8)."
        elif val <= 8.5:
            status_label = "moderately_alkaline"
            explanation = f"Soil pH of {val:.2f} is moderately alkaline (7.8 - 8.5). Monitor phosphorus and zinc fixation."
        else:
            status_label = "strongly_alkaline"
            explanation = f"Soil pH of {val:.2f} is strongly alkaline (> 8.5). High sodicity/salinity risk; gypsum required."
    elif benchmark["parameter"] == "EC":
        if val < 1.0:
            status_label = "optimal"
            explanation = f"Electrical conductivity of {val:.2f} dS/m is normal (< 1.0 dS/m). Non-saline."
        elif val <= 2.0:
            status_label = "critical"
            explanation = f"Electrical conductivity of {val:.2f} dS/m is critical (1.0 - 2.0 dS/m). Sensitive crops may show yield loss."
        else:
            status_label = "high_saline"
            explanation = f"Electrical conductivity of {val:.2f} dS/m is injurious (> 2.0 dS/m). Saline conditions present."
    elif benchmark["parameter"] in ["Zn", "Fe", "Cu", "Mn", "B", "S"]:
        if val < low:
            status_label = "low_deficient"
            explanation = f"{benchmark['parameter_name']} ({val:.2f} {benchmark['unit']}) is below critical limit ({low} {benchmark['unit']}). Deficient."
        else:
            status_label = "optimal"
            explanation = f"{benchmark['parameter_name']} ({val:.2f} {benchmark['unit']}) meets or exceeds critical limit (>= {low} {benchmark['unit']}). Adequate."
    else:
        # N, P, K, OC
        if val < low:
            status_label = "low_deficient"
            explanation = f"{benchmark['parameter_name']} ({val:.1f} {benchmark['unit']}) is classified as Low (< {low}). Increased basal dosing required."
        elif val <= high:
            status_label = "optimal"
            explanation = f"{benchmark['parameter_name']} ({val:.1f} {benchmark['unit']}) is classified as Medium ({low} - {high} {benchmark['unit']}). Maintenance dosing."
        else:
            status_label = "high_adequate"
            explanation = f"{benchmark['parameter_name']} ({val:.1f} {benchmark['unit']}) is classified as High (> {high}). Reduce synthetic application."

    return {
        "parameter": benchmark["parameter"],
        "observed_value": val,
        "unit": benchmark["unit"],
        "reference": benchmark["reference"],
        "source_id": benchmark["source_id"],
        "validation_status": "validated",
        "status_label": status_label,
        "soil_test_method": benchmark["soil_test_method"],
        "source_institution": benchmark["source_institution"],
        "publication_title": benchmark["publication_title"],
        "version": benchmark["version"],
        "official_reference_url": benchmark["official_reference_url"],
        "explanation": explanation
    }
