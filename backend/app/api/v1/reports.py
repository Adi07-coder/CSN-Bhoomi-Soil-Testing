"""
Reports API — PDF generation and download.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.ml_model import Report
from app.repositories.farm_repo import FarmRepository
from app.reports.pdf_generator import generate_farm_report_pdf

router = APIRouter(tags=["Reports"])


@router.post("/farms/{farm_id}/reports", status_code=201)
async def create_report(
    farm_id: uuid.UUID,
    title: str | None = None,
    season: str | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    farm_repo = FarmRepository(db)
    farm = await farm_repo.get_by_id(farm_id)
    if not farm:
        raise HTTPException(404, "Farm not found")
    if farm.owner_id != current_user.id:
        raise HTTPException(403, "Not your farm")

    report_title = title or f"{farm.name} — Soil Analysis Report"
    report = Report(
        farm_id=farm_id,
        owner_id=current_user.id,
        title=report_title,
        season=season,
        year=datetime.now().year,
        generated_at=datetime.now(timezone.utc),
        contains_demo_data=True,  # until real data pipeline is connected
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return {"id": str(report.id), "title": report.title, "status": "created"}


@router.get("/reports")
async def list_reports(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Report)
        .where(Report.owner_id == current_user.id)
        .order_by(Report.generated_at.desc())
    )
    reports = list(result.scalars().all())
    return [
        {
            "id": str(r.id),
            "farm_id": str(r.farm_id),
            "title": r.title,
            "season": r.season,
            "year": r.year,
            "contains_demo_data": r.contains_demo_data,
            "generated_at": r.generated_at,
        }
        for r in reports
    ]


@router.get("/reports/{report_id}")
async def get_report(
    report_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalar_one_or_none()
    if not report:
        raise HTTPException(404, "Report not found")
    if report.owner_id != current_user.id:
        raise HTTPException(403, "Not your report")
    return report


@router.get("/reports/{report_id}/download")
async def download_report(
    report_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalar_one_or_none()
    if not report:
        raise HTTPException(404, "Report not found")
    if report.owner_id != current_user.id:
        raise HTTPException(403, "Not your report")

    farm_repo = FarmRepository(db)
    farm = await farm_repo.get_by_id(report.farm_id)

    pdf_bytes = generate_farm_report_pdf(farm=farm, report=report, user=current_user)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="aibhoomi_report_{report_id}.pdf"'
        },
    )
