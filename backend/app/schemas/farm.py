"""
Pydantic schemas — Farm
"""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, field_validator


class FarmCreate(BaseModel):
    name: str
    owner_name: str
    land_record_ref: str | None = None
    state: str = "Maharashtra"
    district: str | None = None
    taluka: str | None = None
    village: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    boundary_geojson: str  # Mandatory GeoJSON polygon string
    notes: str | None = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Farm Name / Land Name cannot be blank")
        return v.strip()

    @field_validator("owner_name")
    @classmethod
    def owner_name_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Farmer / Owner Name cannot be blank")
        return v.strip()

    @field_validator("boundary_geojson")
    @classmethod
    def boundary_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("A valid field boundary is mandatory for farm registration")
        return v.strip()

    @field_validator("latitude")
    @classmethod
    def lat_range(cls, v: float | None) -> float | None:
        if v is not None and not (-90 <= v <= 90):
            raise ValueError("Latitude must be between -90 and 90")
        return v

    @field_validator("longitude")
    @classmethod
    def lon_range(cls, v: float | None) -> float | None:
        if v is not None and not (-180 <= v <= 180):
            raise ValueError("Longitude must be between -180 and 180")
        return v


class FarmUpdate(BaseModel):
    name: str | None = None
    owner_name: str | None = None
    land_record_ref: str | None = None
    district: str | None = None
    taluka: str | None = None
    village: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    boundary_geojson: str | None = None
    notes: str | None = None
    status: str | None = None


class FarmRead(BaseModel):
    id: uuid.UUID
    owner_id: uuid.UUID
    name: str
    owner_name: str | None
    land_record_ref: str | None
    state: str
    district: str | None
    taluka: str | None
    village: str | None
    latitude: float | None
    longitude: float | None
    boundary_geojson: str | None
    area_sqm: float | None
    area_hectares: float | None
    area_acres: float | None
    status: str
    notes: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
