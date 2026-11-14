"""
Satellite analysis API — demo mode when GEE credentials are absent.
"""
from __future__ import annotations

import uuid
from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.satellite import SatelliteAnalysis, AnalysisStatus
from app.repositories.farm_repo import FarmRepository

router = APIRouter(tags=["Satellite"])


@router.post("/farms/{farm_id}/satellite-analyses", status_code=201)
async def trigger_satellite_analysis(
    farm_id: uuid.UUID,
    date_from: date | None = None,
    date_to: date | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    farm_repo = FarmRepository(db)
    farm = await farm_repo.get_by_id(farm_id)
    if not farm:
        raise HTTPException(404, "Farm not found")
    if farm.owner_id != current_user.id:
        raise HTTPException(403, "Not your farm")
    if not farm.boundary_geojson:
        raise HTTPException(422, "Farm has no boundary polygon. Draw a boundary first.")

    if settings.GEE_DEMO_MODE:
        # Return clearly-labelled synthetic demo data
        analysis = SatelliteAnalysis(
            farm_id=farm_id,
            owner_id=current_user.id,
            status=AnalysisStatus.DEMO.value,
            date_from=date_from or date(2024, 1, 1),
            date_to=date_to or date(2024, 3, 31),
            acquisition_date=date(2024, 2, 15),
            valid_pixel_pct=87.4,
            cloud_cover_pct=12.6,
            ndvi_mean=0.52,
            ndvi_min=0.18,
            ndvi_max=0.81,
            ndvi_std=0.14,
            extra_indices={"evi_mean": 0.38, "savi_mean": 0.41},
            is_demo=True,
            processed_at=datetime.now(timezone.utc),
        )
        db.add(analysis)
        await db.commit()
        await db.refresh(analysis)
        return {
            "id": str(analysis.id),
            "status": analysis.status,
            "is_demo": True,
            "demo_notice": (
                "This analysis uses synthetic demonstration data. "
                "Configure Google Earth Engine credentials to retrieve real Sentinel-2 imagery."
            ),
            "ndvi_mean": analysis.ndvi_mean,
            "acquisition_date": str(analysis.acquisition_date),
        }

    # Real GEE processing would be triggered here as a background task.
    # For now, create a PENDING record and instruct caller to poll.
    analysis = SatelliteAnalysis(
        farm_id=farm_id,
        owner_id=current_user.id,
        status=AnalysisStatus.PENDING.value,
        date_from=date_from,
        date_to=date_to,
        is_demo=False,
    )
    db.add(analysis)
    await db.commit()
    await db.refresh(analysis)
    return {
        "id": str(analysis.id),
        "status": analysis.status,
        "message": "Analysis queued. GEE processing not yet implemented in this deployment.",
    }


@router.get("/satellite-analyses/{analysis_id}")
async def get_satellite_analysis(
    analysis_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SatelliteAnalysis).where(SatelliteAnalysis.id == analysis_id)
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(404, "Analysis not found")
    if analysis.owner_id != current_user.id:
        raise HTTPException(403, "Not your analysis")
    return analysis
