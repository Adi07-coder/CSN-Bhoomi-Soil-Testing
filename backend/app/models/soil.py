"""
SQLAlchemy ORM models — SoilSample and SoilMeasurement
"""
from __future__ import annotations

import uuid
from datetime import date, datetime, timezone
from enum import Enum

from sqlalchemy import (
    Boolean, Date, DateTime, Float, ForeignKey, String, Text, text
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, GUID as UUID


class MeasurementSource(str, Enum):
    LABORATORY = "laboratory"
    FIELD_KIT = "field_kit"
    SOIL_HEALTH_CARD = "soil_health_card"
    ML_PREDICTION = "ml_prediction"
    SOILGRIDS_ESTIMATE = "soilgrids_estimate"
    USER_PROVIDED = "user_provided"
    DEMO = "demo"


class VerificationStatus(str, Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


class SoilSample(Base):
    __tablename__ = "soil_samples"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    farm_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True
    )
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    # Sample identity
    sample_label: Mapped[str | None] = mapped_column(String(100))
    sample_date: Mapped[date | None] = mapped_column(Date)
    laboratory_name: Mapped[str | None] = mapped_column(String(255))
    laboratory_ref: Mapped[str | None] = mapped_column(String(100))
    source: Mapped[str] = mapped_column(String(50), default=MeasurementSource.LABORATORY.value)
    verification_status: Mapped[str] = mapped_column(
        String(20), default=VerificationStatus.PENDING.value
    )

    # Sample location (optional)
    sample_latitude: Mapped[float | None] = mapped_column(Float)
    sample_longitude: Mapped[float | None] = mapped_column(Float)
    depth_cm: Mapped[float | None] = mapped_column(Float)  # e.g. 0–20 cm

    is_demo: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text)
    raw_csv_row: Mapped[str | None] = mapped_column(Text)  # original CSV line for audit

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    farm: Mapped["Farm"] = relationship("Farm", back_populates="soil_samples")  # noqa: F821
    measurements: Mapped[list["SoilMeasurement"]] = relationship(
        "SoilMeasurement", back_populates="sample", cascade="all, delete-orphan", lazy="selectin"
    )


class SoilMeasurement(Base):
    """
    One row per analyte per sample.
    All stored with explicit units and source.
    """
    __tablename__ = "soil_measurements"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    sample_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("soil_samples.id", ondelete="CASCADE"), nullable=False, index=True
    )

    parameter: Mapped[str] = mapped_column(String(100), nullable=False)
    # e.g. "nitrogen", "phosphorus", "potassium", "ph", "organic_carbon", "ec", "texture_sand" …
    value: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(String(50), nullable=False)
    # e.g. "kg/ha", "mg/kg", "ppm", "%", "dS/m", "pH units" …

    source: Mapped[str] = mapped_column(
        String(50), default=MeasurementSource.LABORATORY.value, nullable=False
    )
    method: Mapped[str | None] = mapped_column(String(255))
    # e.g. "Kjeldahl", "Olsen", "Flame Photometry", "Walkley-Black" …

    confidence: Mapped[float | None] = mapped_column(Float)
    # 0–1 for ML predictions; None for direct measurements

    sample: Mapped["SoilSample"] = relationship("SoilSample", back_populates="measurements")
