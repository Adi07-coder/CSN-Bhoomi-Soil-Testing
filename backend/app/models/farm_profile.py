"""
SQLAlchemy ORM model — FarmProfile (Agricultural Profile & Management History)
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, GUID as UUID


class FarmProfile(Base):
    __tablename__ = "farm_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    farm_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, unique=True, index=True
    )
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    # Step A — Crop and Season
    target_crop: Mapped[str | None] = mapped_column(String(100), default="Sugarcane")
    season: Mapped[str | None] = mapped_column(String(50), default="Kharif")  # Kharif, Rabi, Summer
    sowing_date: Mapped[str | None] = mapped_column(String(50))
    crop_duration_days: Mapped[int | None] = mapped_column(Integer)

    # Step B — Water and Irrigation
    farming_type: Mapped[str | None] = mapped_column(String(50), default="Irrigated")  # Rain-fed or Irrigated
    irrigation_method: Mapped[str | None] = mapped_column(String(100), default="Drip Irrigation")  # Drip, Sprinkler, Flood, Rain-fed
    water_availability: Mapped[str | None] = mapped_column(String(50), default="High")  # Low, Moderate, High
    water_source: Mapped[str | None] = mapped_column(String(100), default="Borewell")  # Borewell, Canal, River, Well, Rain

    # Step C — Previous Farming Practices
    previous_crop: Mapped[str | None] = mapped_column(String(100), default="Soybean")
    crop_rotation_history: Mapped[str | None] = mapped_column(Text)
    fertilizers_applied: Mapped[str | None] = mapped_column(Text)
    organic_manure_applied: Mapped[str | None] = mapped_column(Text)
    manure_quantity_tons_acre: Mapped[float | None] = mapped_column(Float, default=2.5)
    soil_amendments: Mapped[str | None] = mapped_column(String(255))  # Gypsum, Lime, None

    # Step D — Farming Objective
    farming_objective: Mapped[str | None] = mapped_column(
        String(100), default="Balance yield potential and input costs"
    )

    # Step E — Existing Soil Laboratory Report summary
    has_lab_report: Mapped[bool] = mapped_column(Boolean, default=False)
    lab_name: Mapped[str | None] = mapped_column(String(255))
    sample_date: Mapped[str | None] = mapped_column(String(50))
    report_date: Mapped[str | None] = mapped_column(String(50))
    sample_ref: Mapped[str | None] = mapped_column(String(100))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    farm: Mapped["Farm"] = relationship("Farm", back_populates="profile")  # noqa: F821
