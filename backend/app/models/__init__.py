"""Register all models for SQLAlchemy metadata."""
from app.models.user import User
from app.models.farm import Farm
from app.models.farm_profile import FarmProfile
from app.models.soil import SoilSample, SoilMeasurement
from app.models.satellite import SatelliteScene, SatelliteAnalysis
from app.models.ml_model import MLModel, MLPrediction, Report

__all__ = [
    "User", "Farm", "FarmProfile",
    "SoilSample", "SoilMeasurement",
    "SatelliteScene", "SatelliteAnalysis",
    "MLModel", "MLPrediction", "Report",
]
