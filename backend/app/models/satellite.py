"""
SQLAlchemy ORM models — SatelliteScene and SatelliteAnalysis
"""
from __future__ import annotations

import uuid
from datetime import date, datetime, timezone
from enum import Enum

from sqlalchemy import (
    Boolean, Date, DateTime, Float, ForeignKey, Integer, JSON, String, Text, text
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, GUID as UUID


class AnalysisStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    DEMO = "demo"
    NO_IMAGERY = "no_imagery"


class SatelliteScene(Base):
    """Metadata for a single satellite acquisition."""
    __tablename__ = "satellite_scenes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    scene_id: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    satellite: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g. "Sentinel-2A"
    sensor: Mapped[str | None] = mapped_column(String(50))
    acquisition_date: Mapped[date] = mapped_column(Date, nullable=False)
    cloud_cover_pct: Mapped[float | None] = mapped_column(Float)
    data_source: Mapped[str] = mapped_column(String(100))  # e.g. "Google Earth Engine"
    collection: Mapped[str | None] = mapped_column(String(255))  # e.g. "COPERNICUS/S2_SR_HARMONIZED"
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class SatelliteAnalysis(Base):
    """Result of analysing a farm with satellite imagery."""
    __tablename__ = "satellite_analyses"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    farm_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True
    )
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    scene_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("satellite_scenes.id"), nullable=True
    )

    status: Mapped[str] = mapped_column(String(30), default=AnalysisStatus.PENDING.value)
    error_message: Mapped[str | None] = mapped_column(Text)

    # Date range queried
    date_from: Mapped[date | None] = mapped_column(Date)
    date_to: Mapped[date | None] = mapped_column(Date)

    # Acquisition date of actual imagery used
    acquisition_date: Mapped[date | None] = mapped_column(Date)

    # Quality
    valid_pixel_pct: Mapped[float | None] = mapped_column(Float)
    cloud_cover_pct: Mapped[float | None] = mapped_column(Float)

    # Vegetation index summary statistics (stored as JSON for extensibility)
    ndvi_mean: Mapped[float | None] = mapped_column(Float)
    ndvi_min: Mapped[float | None] = mapped_column(Float)
    ndvi_max: Mapped[float | None] = mapped_column(Float)
    ndvi_std: Mapped[float | None] = mapped_column(Float)
    extra_indices: Mapped[dict | None] = mapped_column(JSON)
    # e.g. {"evi_mean": 0.32, "savi_mean": 0.41}

    is_demo: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    processed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    farm: Mapped["Farm"] = relationship("Farm", back_populates="satellite_analyses")  # noqa: F821
