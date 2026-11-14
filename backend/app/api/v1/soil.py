"""
Soil sample API endpoints.
"""
from __future__ import annotations

import csv
import io
import uuid
from datetime import date

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.soil import SoilSample, SoilMeasurement
from app.repositories.farm_repo import FarmRepository
from app.schemas.soil import SoilSampleCreate, SoilSampleRead

router = APIRouter(tags=["Soil"])


def _check_farm_ownership(farm, current_user: User) -> None:
    if farm.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your farm")


@router.post("/soil-samples", response_model=SoilSampleRead, status_code=201)
async def create_soil_sample(
    payload: SoilSampleCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    farm_repo = FarmRepository(db)
    farm = await farm_repo.get_by_id(payload.farm_id)
    if not farm:
        raise HTTPException(404, "Farm not found")
    _check_farm_ownership(farm, current_user)

    sample = SoilSample(
        farm_id=payload.farm_id,
        owner_id=current_user.id,
        sample_label=payload.sample_label,
        sample_date=payload.sample_date,
        laboratory_name=payload.laboratory_name,
        laboratory_ref=payload.laboratory_ref,
        source=payload.source,
        sample_latitude=payload.sample_latitude,
        sample_longitude=payload.sample_longitude,
        depth_cm=payload.depth_cm,
        notes=payload.notes,
    )
    db.add(sample)
    await db.flush()

    for m in payload.measurements:
        meas = SoilMeasurement(
            sample_id=sample.id,
            parameter=m.parameter,
            value=m.value,
            unit=m.unit,
            source=payload.source,
            method=m.method,
        )
        db.add(meas)

    await db.commit()
    await db.refresh(sample)
    return sample


@router.get("/farms/{farm_id}/soil-samples", response_model=list[SoilSampleRead])
async def list_soil_samples(
    farm_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    farm_repo = FarmRepository(db)
    farm = await farm_repo.get_by_id(farm_id)
    if not farm:
        raise HTTPException(404, "Farm not found")
    _check_farm_ownership(farm, current_user)

    result = await db.execute(
        select(SoilSample)
        .where(SoilSample.farm_id == farm_id)
        .order_by(SoilSample.created_at.desc())
    )
    return list(result.scalars().all())


@router.get("/soil-samples/{sample_id}", response_model=SoilSampleRead)
async def get_soil_sample(
    sample_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(SoilSample).where(SoilSample.id == sample_id))
    sample = result.scalar_one_or_none()
    if not sample:
        raise HTTPException(404, "Sample not found")
    if sample.owner_id != current_user.id:
        raise HTTPException(403, "Not your sample")
    return sample


@router.post("/soil-samples/import", status_code=200)
async def import_soil_csv(
    farm_id: uuid.UUID,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Import soil measurements from a CSV file.
    Expected columns: parameter, value, unit, method (optional), sample_label (optional)
    """
    if file.content_type not in ("text/csv", "text/plain", "application/csv"):
        raise HTTPException(415, "File must be a CSV (text/csv)")

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(413, "File exceeds 10 MB limit")

    farm_repo = FarmRepository(db)
    farm = await farm_repo.get_by_id(farm_id)
    if not farm:
        raise HTTPException(404, "Farm not found")
    _check_farm_ownership(farm, current_user)

    text = content.decode("utf-8-sig", errors="replace")
    reader = csv.DictReader(io.StringIO(text))
    required = {"parameter", "value", "unit"}
    if not required.issubset({c.strip().lower() for c in (reader.fieldnames or [])}):
        raise HTTPException(422, f"CSV must contain columns: {required}")

    errors = []
    created_count = 0
    for row_num, row in enumerate(reader, start=2):
        try:
            parameter = row["parameter"].strip().lower()
            value = float(row["value"])
            unit = row["unit"].strip()
            method = row.get("method", "").strip() or None
            label = row.get("sample_label", "").strip() or None

            if value < 0:
                errors.append(f"Row {row_num}: negative value for {parameter}")
                continue

            sample = SoilSample(
                farm_id=farm_id,
                owner_id=current_user.id,
                sample_label=label,
                source="laboratory",
                raw_csv_row=str(row),
            )
            db.add(sample)
            await db.flush()
            meas = SoilMeasurement(
                sample_id=sample.id,
                parameter=parameter,
                value=value,
                unit=unit,
                source="laboratory",
                method=method,
            )
            db.add(meas)
            created_count += 1
        except (ValueError, KeyError) as exc:
            errors.append(f"Row {row_num}: {exc}")

    await db.commit()
    return {
        "imported": created_count,
        "errors": errors,
        "message": f"Imported {created_count} measurements. {len(errors)} rows had errors.",
    }
