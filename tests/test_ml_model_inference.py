import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from app.services.soil_model_pipeline import predict_soil_properties
res = predict_soil_properties(19.8646, 75.3081, "Chhatrapati Sambhajinagar")
print("VENV INFERENCE SUCCESS!")
print("Model Version:", res["model_version"])
print("Fertility Index:", res["parameters"]["fertility_index"])
