"""
Geospatial utility functions with Shapely/pyproj and resilient pure-Python fallback.
"""
from __future__ import annotations

import json
import math
from typing import Any

# Resilient import in case Windows Application Control blocks C DLLs
SHAPELY_AVAILABLE = False
try:
    from shapely.geometry import mapping, shape
    from shapely.ops import transform
    from pyproj import Transformer
    SHAPELY_AVAILABLE = True
except (ImportError, Exception):
    SHAPELY_AVAILABLE = False


def _pure_python_polygon_area_sqm(coordinates: list[list[float]]) -> float:
    """
    Computes polygon area in square metres using spherical geodesy (WGS-84 radius = 6378137m).
    """
    if len(coordinates) < 3:
        return 0.0

    r = 6378137.0
    area = 0.0
    n = len(coordinates)
    for i in range(n):
        p1 = coordinates[i]
        p2 = coordinates[(i + 1) % n]
        lon1 = math.radians(p1[0])
        lat1 = math.radians(p1[1])
        lon2 = math.radians(p2[0])
        lat2 = math.radians(p2[1])
        area += (lon2 - lon1) * (2.0 + math.sin(lat1) + math.sin(lat2))

    area = abs(area * (r * r) / 2.0)
    return round(area, 2)


def validate_geojson_polygon(geojson: str | dict) -> dict:
    """
    Parse and validate a GeoJSON Polygon or Feature.
    Returns a normalized GeoJSON Geometry dict.
    Raises ValueError for invalid geometry.
    """
    if isinstance(geojson, str):
        try:
            data: dict = json.loads(geojson)
        except json.JSONDecodeError as exc:
            raise ValueError(f"Invalid JSON: {exc}") from exc
    else:
        data = geojson

    # Support both Feature and bare Geometry
    if data.get("type") == "Feature":
        geom_data = data.get("geometry", {})
    else:
        geom_data = data

    if geom_data.get("type") not in ("Polygon", "MultiPolygon"):
        raise ValueError(
            f"Expected Polygon or MultiPolygon, got '{geom_data.get('type')}'"
        )

    coords = geom_data.get("coordinates")
    if not coords or not isinstance(coords, (list, tuple)) or len(coords) == 0:
        raise ValueError("Polygon geometry has empty coordinates")

    if SHAPELY_AVAILABLE:
        try:
            geom = shape(geom_data)
            if not geom.is_valid:
                geom = geom.buffer(0)
            if not geom.is_valid:
                raise ValueError("Polygon geometry is invalid and could not be repaired")
            if geom.is_empty:
                raise ValueError("Polygon geometry is empty")
            return mapping(geom)
        except Exception:
            pass

    # Pure Python validation fallback
    exterior_ring = coords[0]
    if len(exterior_ring) < 4:
        raise ValueError("Polygon must have at least 4 coordinate vertices (including closing vertex)")
    
    # Check coordinate bounds
    for pt in exterior_ring:
        if len(pt) < 2 or not (-180 <= pt[0] <= 180) or not (-90 <= pt[1] <= 90):
            raise ValueError(f"Invalid GPS coordinates: {pt}")

    return geom_data


def calculate_polygon_area_sqm(geojson_geometry: dict) -> float:
    """
    Calculate the area of a GeoJSON Polygon in square metres.
    Uses equal-area projection if Shapely/pyproj is available, otherwise spherical geodesy.
    """
    coords = geojson_geometry.get("coordinates")
    if not coords or not isinstance(coords, (list, tuple)):
        return 0.0

    if SHAPELY_AVAILABLE:
        try:
            geom_wgs84 = shape(geojson_geometry)
            centroid = geom_wgs84.centroid
            proj_string = (
                f"+proj=laea +lat_0={centroid.y:.6f} +lon_0={centroid.x:.6f} "
                f"+x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"
            )
            transformer = Transformer.from_crs("EPSG:4326", proj_string, always_xy=True)
            geom_projected = transform(transformer.transform, geom_wgs84)
            return float(geom_projected.area)
        except Exception:
            pass

    exterior_ring = coords[0]
    return _pure_python_polygon_area_sqm(exterior_ring)


def sqm_to_hectares(sqm: float) -> float:
    return round(sqm / 10_000, 4)


def sqm_to_acres(sqm: float) -> float:
    return round(sqm / 4_046.8564224, 4)
