"""
Unit tests for geospatial geometry validation and area conversion.
"""
import pytest
from app.services.geo_utils import (
    validate_geojson_polygon,
    calculate_polygon_area_sqm,
    sqm_to_hectares,
    sqm_to_acres,
)

SAMPLE_POLYGON = {
    "type": "Polygon",
    "coordinates": [
        [
            [74.57214, 18.15621],
            [74.57482, 18.15685],
            [74.57428, 18.15422],
            [74.57165, 18.15378],
            [74.57214, 18.15621]
        ]
    ]
}

def test_validate_valid_geojson_polygon():
    validated = validate_geojson_polygon(SAMPLE_POLYGON)
    assert validated["type"] == "Polygon"
    assert len(validated["coordinates"][0]) >= 4

def test_validate_invalid_geojson_polygon():
    invalid_point = {"type": "Point", "coordinates": [74.5, 18.1]}
    with pytest.raises(ValueError):
        validate_geojson_polygon(invalid_point)

def test_area_calculation_and_conversions():
    area_sqm = calculate_polygon_area_sqm(SAMPLE_POLYGON)
    assert area_sqm > 5000  # realistic farm plot size in sqm
    ha = sqm_to_hectares(area_sqm)
    acres = sqm_to_acres(area_sqm)
    assert ha > 0.5
    assert acres > 1.0
    assert abs(acres - ha * 2.47105) < 0.1
