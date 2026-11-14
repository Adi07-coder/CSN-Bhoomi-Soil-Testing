"""
Main v1 API router.
"""
from fastapi import APIRouter

from app.api.v1 import (
    crop_recommendation_card,
    auth, farms, soil, satellite, recommendations, reports, geo, ml_ops, system_status
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(farms.router)
api_router.include_router(soil.router)
api_router.include_router(satellite.router)
api_router.include_router(recommendations.router)
api_router.include_router(reports.router)
api_router.include_router(geo.router)
api_router.include_router(ml_ops.router)

api_router.include_router(system_status.router)

api_router.include_router(crop_recommendation_card.router)


@api_router.get("/health")
def api_v1_health():
    return {
        "status": "ok",
        "service": "AI Bhoomi API v1",
        "satellite_layer": "Visual Basemap (Sentinel-2) - No spectral feature fabrication",
        "benchmarks": "ICAR-IISS / MPKV Rahuri Verified Matrix"
    }
