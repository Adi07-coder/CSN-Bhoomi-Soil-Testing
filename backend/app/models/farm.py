"""
SQLAlchemy ORM model — Farm and FarmBoundary
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import (
    Boolean, DateTime, Float, ForeignKey, String, Text, text
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, GUID as UUID


class FarmStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"


class Farm(Base):
    __tablename__ = "farms"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # Identity
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    owner_name: Mapped[str | None] = mapped_column(String(255))
    land_record_ref: Mapped[str | None] = mapped_column(String(255))

    # Location
    state: Mapped[str] = mapped_column(String(100), nullable=False, default="Maharashtra")
    district: Mapped[str | None] = mapped_column(String(100))
    taluka: Mapped[str | None] = mapped_column(String(100))
    village: Mapped[str | None] = mapped_column(String(100))
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)

    # Geometry (EPSG:4326 WGS84)
    boundary: Mapped[str | None] = mapped_column(Text, nullable=True)
    boundary_geojson: Mapped[str | None] = mapped_column(Text)  # cached GeoJSON string

    # Area — always store in sq metres; derive ha/acres at query time
    area_sqm: Mapped[float | None] = mapped_column(Float)

    status: Mapped[str] = mapped_column(String(20), default=FarmStatus.ACTIVE.value, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    owner: Mapped["User"] = relationship("User", back_populates="farms")  # noqa: F821
    profile: Mapped["FarmProfile | None"] = relationship("FarmProfile", back_populates="farm", uselist=False, cascade="all, delete-orphan", lazy="selectin")  # noqa: F821
    soil_samples: Mapped[list["SoilSample"]] = relationship("SoilSample", back_populates="farm", lazy="selectin")  # noqa: F821
    satellite_analyses: Mapped[list["SatelliteAnalysis"]] = relationship("SatelliteAnalysis", back_populates="farm", lazy="selectin")  # noqa: F821
    reports: Mapped[list["Report"]] = relationship("Report", back_populates="farm", lazy="selectin")  # noqa: F821

    @property
    def area_hectares(self) -> float | None:
        return round(self.area_sqm / 10_000, 4) if self.area_sqm else None

    @property
    def area_acres(self) -> float | None:
        return round(self.area_sqm / 4_046.8564224, 4) if self.area_sqm else None

    def __repr__(self) -> str:
        return f"<Farm id={self.id} name={self.name}>"
