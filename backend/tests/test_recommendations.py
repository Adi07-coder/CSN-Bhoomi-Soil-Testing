"""
Unit Tests for AI Bhoomi Recommendation Engine
"""
from app.services.recommendation_engine import (
    get_crop_recommendations,
    get_fertilizer_recommendation,
)

def test_crop_recommendations_kharif():
    res = get_crop_recommendations(district="Pune", season="kharif", soil_ph=7.2, irrigation=True)
    assert "recommendations" in res
    assert len(res["recommendations"]) > 0
    # Check top crops contain Soybean or Cotton
    crops = [r["crop"] for r in res["recommendations"]]
    assert "Soybean" in crops or "Cotton" in crops

def test_crop_recommendations_invalid_season():
    res = get_crop_recommendations(district="Pune", season="invalid_season")
    assert "error" in res
    assert res["recommendations"] == []

def test_fertilizer_recommendation_wheat():
    res = get_fertilizer_recommendation(
        crop="wheat",
        season="rabi",
        area_ha=2.0,
        soil_n=250.0,
        soil_p=15.0,
        soil_k=200.0,
    )
    assert res["status"] == "available"
    assert res["area_ha"] == 2.0
    assert "recommended_per_ha" in res
    assert "recommended_total_farm" in res
    # Wheat with medium soil N has factor 0.75: 120 * 0.75 = 90
    assert res["recommended_per_ha"]["N_kg"] == 90.0
    assert res["recommended_total_farm"]["N_kg"] == 180.0
    assert len(res["application_stages"]) > 0

def test_fertilizer_recommendation_unknown_crop():
    res = get_fertilizer_recommendation(
        crop="nonexistent_crop",
        season="kharif",
        area_ha=1.0,
    )
    assert res["status"] == "unavailable"
