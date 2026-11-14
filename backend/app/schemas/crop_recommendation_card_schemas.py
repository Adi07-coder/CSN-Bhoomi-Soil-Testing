# -*- coding: utf-8 -*-
"""
Pydantic Schemas for Crop Selection & Agricultural Configuration Card.
Strictly adheres to Section 8 required JSON output schema with enhanced data status validation.
"""
from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field

AssessmentStatusEnum = Literal["validated", "preliminary", "insufficient_data", "demo", "withheld"]
SuitabilityEnum = Literal["highly_suitable", "moderately_suitable", "conditional", "insufficient_data", "preliminary_assessment"]
DataStatusEnum = Literal[
    "laboratory_measurement_verified",
    "regional_reference_data",
    "model_estimated",
    "demo_data_not_real_measurement",
    "insufficient_provenance",
    "verified_lab",
    "demo"
]
ValidationStatusEnum = Literal["validated", "preliminary", "unavailable", "conflict", "rejected", "evidence_validation_passed", "evidence_validation_failed", "demo_data_not_real_measurement"]

class CropRecommendationCardRequest(BaseModel):
    farm_id: Optional[str] = Field(None, description="Authoritative farm ID or field identifier")
    farm_name: Optional[str] = Field("Selected Field Parcel", description="Farm parcel name")
    district: Optional[str] = Field("Pune", description="Administrative district in Maharashtra")
    taluka: Optional[str] = Field(None, description="Taluka or Tehsil")
    village: Optional[str] = Field(None, description="Village name")
    area_acres: Optional[float] = Field(None, description="Authoritative field area in acres; recalculated from geometry")
    geometry: Optional[Dict[str, Any]] = Field(None, description="GeoJSON polygon geometry for server-side recalculation")
    centroid: Optional[Dict[str, float]] = Field(None, description="Centroid coordinates of selected polygon")
    soil_type: Optional[str] = Field("Vertisol (Medium Deep Black)", description="Soil classification")
    season: Literal["Kharif", "Rabi", "Summer", "All"] = Field("Kharif", description="Agricultural growing season")
    water_availability: Optional[str] = Field("High / Assured Irrigation", description="Irrigation and water access")
    previous_crop: Optional[str] = Field(None, description="Previous season crop in rotation")
    fertility_index: Optional[float] = Field(None, description="Soil fertility index rate (0-100)")
    soil_measurements: Optional[Dict[str, Any]] = Field(None, description="Available soil test measurements")
    soil_parameters: Optional[Dict[str, Any]] = Field(None, description="Legacy alias for soil measurements")
    soil_data_status: Optional[str] = Field("model_estimated", description="Provenance status of input data")
    is_demo: Optional[bool] = Field(False, description="Whether input data is synthetic/demo")
    output_language: Optional[Literal["en", "hi"]] = Field("en", description="Target language: en (English) or hi (Hindi)")

class BenchmarkCheck(BaseModel):
    parameter: str
    observed_value: Optional[float] = None
    unit: str = ""
    reference: str = ""
    source_id: str = ""
    validation_status: str = "unavailable"
    status_label: Optional[str] = "unverified"
    soil_test_method: Optional[str] = ""
    source_institution: Optional[str] = ""
    publication_title: Optional[str] = ""
    version: Optional[str] = ""
    official_reference_url: Optional[str] = ""
    explanation: str = ""

class CropRecommendationItem(BaseModel):
    crop_name: str
    suitability: SuitabilityEnum = "insufficient_data"
    suitability_label: Optional[str] = None
    reasons: List[str] = []
    supporting_evidence_ids: List[str] = []
    soil_constraints: List[str] = []
    water_requirements: str = "Not verified"
    water_details: Optional[Dict[str, Any]] = None
    seasonal_constraints: List[str] = []
    missing_information: List[str] = []
    confidence: Optional[float] = None
    confidence_method: str = "not_calculated"

class NotRecommendedItem(BaseModel):
    crop_name: str
    reason: str
    evidence_ids: List[str] = []

class DataQuality(BaseModel):
    soil_data_status: str = "demo"
    missing_parameters: List[str] = []
    limitations: List[str] = []

class ValidationSummary(BaseModel):
    schema_valid: bool = True
    final_status: str = "pending_validation"
    status_description: Optional[str] = ""
    unsupported_claims_found: List[str] = []
    passed_checks: List[str] = []
    failed_checks: List[str] = []
    unavailable_checks: List[str] = []

class CropRecommendationCardResponse(BaseModel):
    farm_id: Optional[str] = None
    farm_name: str
    district: str
    season: str
    area_acres: Optional[float] = None
    assessment_status: AssessmentStatusEnum = "preliminary"
    data_quality: DataQuality
    benchmark_checks: List[BenchmarkCheck] = []
    crop_recommendations: List[CropRecommendationItem] = []
    not_recommended_or_unassessed: List[NotRecommendedItem] = []
    next_steps: List[str] = []
    validation_summary: ValidationSummary
    gemini_ai_reasoning: Optional[str] = None
    created_at: Optional[str] = None
