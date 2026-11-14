"""
Pydantic schemas — FarmProfile (Agricultural Information Wizard)
"""
from __future__ import annotations

import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class FarmProfileBase(BaseModel):
    # Step A — Crop and Season
    target_crop: str | None = "Sugarcane"
    season: str | None = "Kharif"
    sowing_date: str | None = None
    crop_duration_days: int | None = None

    # Step B — Water and Irrigation
    farming_type: str | None = "Irrigated"
    irrigation_method: str | None = "Drip Irrigation"
    water_availability: str | None = "High"
    water_source: str | None = "Borewell"

    # Step C — Previous Farming Practices
    previous_crop: str | None = "Soybean"
    crop_rotation_history: str | None = None
    fertilizers_applied: str | None = None
    organic_manure_applied: str | None = None
    manure_quantity_tons_acre: float | None = 2.5
    soil_amendments: str | None = None

    # Step D — Farming Objective
    farming_objective: str | None = "Balance yield potential and input costs"

    # Step E — Existing Soil Laboratory Report
    has_lab_report: bool = False
    lab_name: str | None = None
    sample_date: str | None = None
    report_date: str | None = None
    sample_ref: str | None = None


class FarmProfileCreate(FarmProfileBase):
    pass


class FarmProfileUpdate(FarmProfileBase):
    pass


class FarmProfileRead(FarmProfileBase):
    id: uuid.UUID
    farm_id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
