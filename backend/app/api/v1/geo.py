"""

Geospatial API endpoints:

- Location Search across India with autocomplete

- Reverse Geocoding with administrative resolution

- Polygon resolution (vertices, centroid, bounds, area in m2/ha/acres, perimeter)

- Authoritative area and perimeter calculation

- Provider status check

"""

from __future__ import annotations



import math

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query

from pydantic import BaseModel, Field



from app.services.geocoding_service import search_locations, reverse_geocode

from app.services.geo_utils import (

    validate_geojson_polygon,

    calculate_polygon_area_sqm,

    sqm_to_acres,

    sqm_to_hectares,

    _pure_python_polygon_area_sqm

)



router = APIRouter(prefix="/geo", tags=["Geospatial & Field Intelligence"])





class ResolvePolygonRequest(BaseModel):

    geojson: Any = Field(..., description="GeoJSON Polygon Geometry or Feature or raw coordinates")





class VertexItem(BaseModel):

    label: str

    latitude: float

    longitude: float





class ResolvePolygonResponse(BaseModel):

    is_valid: bool

    vertex_count: int

    vertices: List[VertexItem]

    centroid: Dict[str, float]

    bounding_box: Dict[str, float]

    area_sqm: float

    area_hectares: float

    area_acres: float

    perimeter_meters: float

    administrative: Dict[str, Any]

    geojson: Dict[str, Any]





class CalculateAreaRequest(BaseModel):

    coordinates: List[List[float]] = Field(..., description="List of [lon, lat] coordinate pairs")





def _calculate_perimeter_meters(coords: List[List[float]]) -> float:

    """

    Computes perimeter in metres using Haversine formula between successive points.

    """

    if len(coords) < 2:

        return 0.0

    r = 6378137.0  # meters

    perimeter = 0.0

    n = len(coords)

    for i in range(n):

        p1 = coords[i]

        p2 = coords[(i + 1) % n]

        lon1, lat1 = math.radians(p1[0]), math.radians(p1[1])

        lon2, lat2 = math.radians(p2[0]), math.radians(p2[1])

        dlat = lat2 - lat1

        dlon = lon2 - lon1

        a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2

        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

        perimeter += r * c

    return round(perimeter, 2)





@router.get("/search")

async def api_search_locations(

    q: str = Query(..., min_length=2, description="Place, village, taluka, district, or PIN code"),

    limit: int = Query(8, ge=1, le=20)

):

    """

    Search places across India with debounced geocoding and autocomplete.

    """

    results = await search_locations(q, limit=limit)

    return {

        "query": q,

        "count": len(results),

        "results": results

    }





@router.get("/reverse")

async def api_reverse_geocode(

    lat: float = Query(..., ge=-90.0, le=90.0),

    lon: float = Query(..., ge=-180.0, le=180.0)

):

    """

    Reverse geocodes GPS coordinates into State, District, Taluka, Village, and PIN.

    """

    location = await reverse_geocode(lat, lon)

    return location





@router.post("/resolve-polygon", response_model=ResolvePolygonResponse)

async def api_resolve_polygon(req: ResolvePolygonRequest):

    """

    Validates polygon, computes authoritative area (m2, ha, acres), perimeter,

    extracts all labeled vertices, centroid, and reverse-geocodes administrative hierarchy.

    """

    try:

        geom = validate_geojson_polygon(req.geojson)

    except ValueError as e:

        raise HTTPException(status_code=422, detail=str(e))



    raw_coords = geom.get("coordinates", [[]])[0]

    if len(raw_coords) < 4:  # At least 3 points + 1 closing point

        raise HTTPException(status_code=422, detail="Polygon must contain at least 3 distinct vertices.")



    # Distinct vertices (excluding closing duplicate point for labels)

    distinct_coords = raw_coords[:-1] if raw_coords[0] == raw_coords[-1] else raw_coords



    vertices: List[VertexItem] = []

    lats = []

    lons = []

    for idx, pt in enumerate(distinct_coords):

        lon_val, lat_val = float(pt[0]), float(pt[1])

        lons.append(lon_val)

        lats.append(lat_val)

        vertices.append(VertexItem(

            label=f"P{idx + 1}",

            latitude=round(lat_val, 6),

            longitude=round(lon_val, 6)

        ))



    # Centroid

    cent_lat = round(sum(lats) / len(lats), 6)

    cent_lon = round(sum(lons) / len(lons), 6)



    # Bounding box

    bbox = {

        "min_lat": round(min(lats), 6),

        "max_lat": round(max(lats), 6),

        "min_lon": round(min(lons), 6),

        "max_lon": round(max(lons), 6),

    }



    # Authoritative area & perimeter

    area_sqm = _pure_python_polygon_area_sqm(raw_coords)

    area_hectares = round(area_sqm / 10000.0, 4)

    area_acres = round(area_sqm / 4046.8564224, 4)

    perimeter_m = _calculate_perimeter_meters(distinct_coords)



    # Reverse geocode the centroid

    admin_info = await reverse_geocode(cent_lat, cent_lon)



    return ResolvePolygonResponse(

        is_valid=True,

        vertex_count=len(vertices),

        vertices=vertices,

        centroid={"latitude": cent_lat, "longitude": cent_lon},

        bounding_box=bbox,

        area_sqm=area_sqm,

        area_hectares=area_hectares,

        area_acres=area_acres,

        perimeter_meters=perimeter_m,

        administrative=admin_info,

        geojson=geom

    )





@router.post("/calculate-area")

async def api_calculate_area(req: CalculateAreaRequest):

    """

    Computes geodesic area directly from an array of [lon, lat] pairs.

    """

    coords = req.coordinates

    if len(coords) < 3:

        raise HTTPException(status_code=422, detail="At least 3 coordinate pairs required.")

    

    # Ensure closed ring

    ring = coords if coords[0] == coords[-1] else coords + [coords[0]]

    sqm = _pure_python_polygon_area_sqm(ring)

    ha = round(sqm / 10000.0, 4)

    acres = round(sqm / 4046.8564224, 4)

    perimeter = _calculate_perimeter_meters(coords[:-1] if coords[0] == coords[-1] else coords)



    return {

        "is_valid": True,

        "area_sqm": sqm,

        "area_hectares": ha,

        "area_acres": acres,

        "perimeter_meters": perimeter

    }





@router.get("/providers/status")

async def api_providers_status():

    """

    Status of map tile layers and geocoding providers.

    """

    return {

        "geocoding_provider": "Geoapify / OpenStreetMap",

        "geocoding_status": "operational",

        "tile_layers": {

            "street": "OpenStreetMap Standard",

            "satellite": "Geoapify / ESRI World Imagery",

            "topo": "OpenTopoMap"

        },

        "default_focus": "Maharashtra, India",

        "default_center": [19.7515, 75.7139],

        "default_zoom": 7

    }

