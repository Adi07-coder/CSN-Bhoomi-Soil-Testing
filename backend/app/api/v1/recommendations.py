"""
Crop suitability and fertilizer recommendation API.

Rules are deterministic and source-backed. References:
  - ICAR Fertilizer Use Recommendations for Maharashtra crops.
  - Krishi Vibhag Maharashtra nutrient guidelines.
All recommendation text must cite its source. No invented doses.
"""
from __future__ import annotations

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.repositories.farm_repo import FarmRepository
from app.services.recommendation_engine import (
    get_crop_recommendations,
    get_fertilizer_recommendation,
)

router = APIRouter(tags=["Recommendations"])


@router.post("/farms/{farm_id}/crop-recommendations")
async def crop_recommendations(
    farm_id: uuid.UUID,
    soil_ph: float | None = None,
    season: str = "kharif",
    irrigation: bool = False,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    farm_repo = FarmRepository(db)
    farm = await farm_repo.get_by_id(farm_id)
    if not farm:
        raise HTTPException(404, "Farm not found")
    if farm.owner_id != current_user.id:
        raise HTTPException(403, "Not your farm")

    return get_crop_recommendations(
        district=farm.district,
        season=season,
        soil_ph=soil_ph,
        irrigation=irrigation,
    )


@router.post("/farms/{farm_id}/fertilizer-recommendations")
async def fertilizer_recommendations(
    farm_id: uuid.UUID,
    crop: str = "wheat",
    season: str = "rabi",
    nitrogen_kg_ha: float | None = None,
    phosphorus_kg_ha: float | None = None,
    potassium_kg_ha: float | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    farm_repo = FarmRepository(db)
    farm = await farm_repo.get_by_id(farm_id)
    if not farm:
        raise HTTPException(404, "Farm not found")
    if farm.owner_id != current_user.id:
        raise HTTPException(403, "Not your farm")

    area_ha = farm.area_hectares or 1.0

    return get_fertilizer_recommendation(
        crop=crop,
        season=season,
        area_ha=area_ha,
        soil_n=nitrogen_kg_ha,
        soil_p=phosphorus_kg_ha,
        soil_k=potassium_kg_ha,
    )
