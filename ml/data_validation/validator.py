"""
Soil Data Validation Module for AI Bhoomi ML Pipeline.
Validates input parameter ranges against agronomic physical limits.
"""
from typing import Dict, Any, Tuple, List

VALID_RANGES = {
    "pH": (3.5, 10.5),          # Soil pH range
    "EC": (0.01, 25.0),         # Electrical conductivity (dS/m)
    "OC": (0.05, 5.0),          # Organic carbon (%)
    "N": (10.0, 1200.0),        # Available Nitrogen (kg/ha)
    "P": (1.0, 150.0),          # Available Phosphorus (kg/ha)
    "K": (20.0, 1500.0),        # Available Potassium (kg/ha)
    "Zn": (0.05, 20.0),         # Zinc (mg/kg)
    "Fe": (0.5, 100.0),         # Iron (mg/kg)
}

def validate_soil_features(features: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """
    Validates dictionary of soil test features.
    Returns (is_valid, list_of_error_messages).
    """
    errors = []
    for param, (min_val, max_val) in VALID_RANGES.items():
        if param in features and features[param] is not None:
            try:
                val = float(features[param])
                if val < min_val or val > max_val:
                    errors.append(
                        f"Parameter '{param}' value {val} is outside acceptable agronomic range [{min_val}, {max_val}]."
                    )
            except (ValueError, TypeError):
                errors.append(f"Parameter '{param}' must be a numerical value.")
    
    return len(errors) == 0, errors
