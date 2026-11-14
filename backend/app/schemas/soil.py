"""
Pydantic schemas — Soil samples and measurements
"""
from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, field_validator


PARAM_ALIAS_MAP = {
    "n": "nitrogen",
    "nitrogen": "nitrogen",
    "p": "phosphorus",
    "phosphorus": "phosphorus",
    "k": "potassium",
    "potassium": "potassium",
    "oc": "organic_carbon",
    "organic_carbon": "organic_carbon",
    "ph": "ph",
    "ec": "ec",
    "s": "sulphur",
    "sulphur": "sulphur",
    "sulfur": "sulphur",
    "zn": "zinc",
    "zinc": "zinc",
    "b": "boron",
    "boron": "boron",
    "mn": "manganese",
    "manganese": "manganese",
    "cu": "copper",
    "copper": "copper",
    "fe": "iron",
    "iron": "iron",
    "ca": "calcium",
    "calcium": "calcium",
    "mg": "magnesium",
    "magnesium": "magnesium",
    "na": "sodium",
    "sodium": "sodium",
    "cec": "cec",
    "texture_sand": "texture_sand",
    "texture_silt": "texture_silt",
    "texture_clay": "texture_clay",
}
ALLOWED_PARAMETERS = set(PARAM_ALIAS_MAP.values())


class MeasurementIn(BaseModel):
    parameter: str
    value: float
    unit: str
    method: str | None = None

    @field_validator("parameter")
    @classmethod
    def validate_parameter(cls, v: str) -> str:
        norm = v.lower().strip()
        if norm in PARAM_ALIAS_MAP:
            return PARAM_ALIAS_MAP[norm]
        raise ValueError(
            f"Unknown parameter '{v}'. Allowed symbols/names include: N, P, K, OC, pH, EC, Zn, Fe, Cu, Mn, B, S"
        )

    @field_validator("value")
    @classmethod
    def value_reasonable(cls, v: float) -> float:
        if v < 0:
            raise ValueError("Measurement value cannot be negative")
        return v


class SoilSampleCreate(BaseModel):
    farm_id: uuid.UUID
    sample_label: str | None = None
    sample_date: date | None = None
    laboratory_name: str | None = None
    laboratory_ref: str | None = None
    source: str = "laboratory"
    sample_latitude: float | None = None
    sample_longitude: float | None = None
    depth_cm: float | None = None
    notes: str | None = None
    measurements: list[MeasurementIn] = []


class MeasurementRead(BaseModel):
    id: uuid.UUID
    parameter: str
    value: float
    unit: str
    source: str
    method: str | None
    confidence: float | None

    model_config = {"from_attributes": True}


class SoilSampleRead(BaseModel):
    id: uuid.UUID
    farm_id: uuid.UUID
    sample_label: str | None
    sample_date: date | None
    laboratory_name: str | None
    source: str
    verification_status: str
    depth_cm: float | None
    is_demo: bool
    created_at: datetime
    measurements: list[MeasurementRead]

    model_config = {"from_attributes": True}
