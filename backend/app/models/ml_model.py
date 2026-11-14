"""
SQLAlchemy ORM models — MLModel, MLPrediction, Report
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import (
    Boolean, DateTime, Float, ForeignKey, JSON, String, Text, text
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, GUID as UUID


class MLModel(Base):
    __tablename__ = "ml_models"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    version: Mapped[str] = mapped_column(String(50), nullable=False)
    target: Mapped[str] = mapped_column(String(100), nullable=False)
    # e.g. "nitrogen_kg_ha", "crop_suitability_wheat"
    target_unit: Mapped[str | None] = mapped_column(String(50))
    algorithm: Mapped[str] = mapped_column(String(100))
    feature_schema: Mapped[dict] = mapped_column(JSON, default=dict)
    training_dataset_version: Mapped[str | None] = mapped_column(String(100))
    artifact_path: Mapped[str | None] = mapped_column(String(500))
    mae: Mapped[float | None] = mapped_column(Float)
    rmse: Mapped[float | None] = mapped_column(Float)
    r2: Mapped[float | None] = mapped_column(Float)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)
    # Must be explicitly activated after review
    limitations: Mapped[str | None] = mapped_column(Text)
    trained_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class MLPrediction(Base):
    __tablename__ = "ml_predictions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    farm_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False
    )
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    model_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("ml_models.id"), nullable=False
    )
    input_features: Mapped[dict] = mapped_column(JSON, default=dict)
    predicted_value: Mapped[float | None] = mapped_column(Float)
    confidence_interval_low: Mapped[float | None] = mapped_column(Float)
    confidence_interval_high: Mapped[float | None] = mapped_column(Float)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    farm_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True
    )
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    report_type: Mapped[str] = mapped_column(String(50), default="full")
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    season: Mapped[str | None] = mapped_column(String(50))
    year: Mapped[int | None] = mapped_column()
    pdf_path: Mapped[str | None] = mapped_column(String(500))
    data_snapshot: Mapped[dict] = mapped_column(JSON, default=dict)
    # serialized snapshot of data at time of generation
    contains_demo_data: Mapped[bool] = mapped_column(Boolean, default=False)
    generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    farm: Mapped["Farm"] = relationship("Farm", back_populates="reports")  # noqa: F821
