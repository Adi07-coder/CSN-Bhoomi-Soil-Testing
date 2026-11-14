"""
Geocoding and reverse geocoding service with Geoapify and Nominatim fallback.
Includes server-side in-memory caching and administrative hierarchy resolution.
"""
from __future__ import annotations

import httpx
import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

GEOAPIFY_API_KEY = "b31f9b52572f477e86f208e6cc6bc433"

# In-memory cache for reverse geocoding & search
_CACHE: Dict[str, Any] = {}

class GeocodingProviderStatus:
    PROVIDER_NAME = "Geoapify / OpenStreetMap"
    IS_ACTIVE = True

async def search_locations(query: str, limit: int = 8) -> List[Dict[str, Any]]:
    """
    Search places across India (states, districts, talukas, villages, towns).
    """
    clean_q = query.strip()
    if len(clean_q) < 2:
        return []

    cache_key = f"search:{clean_q.lower()}:{limit}"
    if cache_key in _CACHE:
        return _CACHE[cache_key]

    results: List[Dict[str, Any]] = []

    # 1. Try Geoapify Geocoding API
    if GEOAPIFY_API_KEY:
        try:
            url = "https://api.geoapify.com/v1/geocode/autocomplete"
            params = {
                "text": clean_q,
                "filter": "countrycode:in",
                "limit": limit,
                "apiKey": GEOAPIFY_API_KEY,
            }
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url, params=params)
                if res.status_code == 200:
                    data = res.json()
                    features = data.get("features", [])
                    for feat in features:
                        props = feat.get("properties", {})
                        results.append({
                            "formatted": props.get("formatted"),
                            "name": props.get("name") or props.get("city") or props.get("village"),
                            "village": props.get("village") or props.get("suburb"),
                            "taluka": props.get("county") or props.get("district"),
                            "district": props.get("state_district") or props.get("county"),
                            "state": props.get("state"),
                            "postcode": props.get("postcode"),
                            "country": props.get("country", "India"),
                            "lat": props.get("lat"),
                            "lon": props.get("lon"),
                            "place_id": props.get("place_id"),
                            "provider": "geoapify"
                        })
                    if results:
                        _CACHE[cache_key] = results
                        return results
        except Exception as e:
            logger.warning("Geoapify search failed, falling back: %s", e)

    # 2. Fallback to OpenStreetMap Nominatim
    try:
        url = "https://nominatim.openstreetmap.org/search"
        headers = {"User-Agent": "AIBhoomi-GeospatialPlatform/1.0"}
        params = {
            "q": f"{clean_q}, India",
            "format": "jsonv2",
            "addressdetails": "1",
            "limit": limit,
            "countrycodes": "in",
        }
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.get(url, params=params, headers=headers)
            if res.status_code == 200:
                for item in res.json():
                    addr = item.get("address", {})
                    results.append({
                        "formatted": item.get("display_name"),
                        "name": item.get("name"),
                        "village": addr.get("village") or addr.get("hamlet") or addr.get("suburb"),
                        "taluka": addr.get("county") or addr.get("state_district"),
                        "district": addr.get("state_district") or addr.get("county"),
                        "state": addr.get("state"),
                        "postcode": addr.get("postcode"),
                        "country": addr.get("country", "India"),
                        "lat": float(item.get("lat")),
                        "lon": float(item.get("lon")),
                        "place_id": str(item.get("place_id")),
                        "provider": "nominatim"
                    })
    except Exception as e:
        logger.warning("Nominatim search failed: %s", e)

    _CACHE[cache_key] = results
    return results


async def reverse_geocode(lat: float, lon: float) -> Dict[str, Any]:
    """
    Reverse geocode GPS coordinates to extract State, District, Taluka, Village, and PIN.
    """
    rounded_lat = round(lat, 5)
    rounded_lon = round(lon, 5)
    cache_key = f"rev:{rounded_lat}:{rounded_lon}"
    if cache_key in _CACHE:
        return _CACHE[cache_key]

    info: Dict[str, Any] = {
        "formatted": f"Location at {rounded_lat}, {rounded_lon}",
        "state": "Maharashtra",  # default context if within MH bounds
        "district": None,
        "taluka": None,
        "village": None,
        "postcode": None,
        "country": "India",
        "lat": rounded_lat,
        "lon": rounded_lon,
        "confidence": "approximate",
        "provider": "local_inference"
    }

    # If within Maharashtra coordinate envelope:
    # Lat: 15.6 to 22.1, Lon: 72.6 to 80.9
    if 15.6 <= lat <= 22.1 and 72.6 <= lon <= 80.9:
        info["state"] = "Maharashtra"

    # 1. Geoapify Reverse Geocoding
    if GEOAPIFY_API_KEY:
        try:
            url = "https://api.geoapify.com/v1/geocode/reverse"
            params = {
                "lat": rounded_lat,
                "lon": rounded_lon,
                "apiKey": GEOAPIFY_API_KEY,
            }
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url, params=params)
                if res.status_code == 200:
                    data = res.json()
                    features = data.get("features", [])
                    if features:
                        props = features[0].get("properties", {})
                        info.update({
                            "formatted": props.get("formatted"),
                            "state": props.get("state") or info["state"],
                            "district": props.get("state_district") or props.get("county"),
                            "taluka": props.get("county") or props.get("district"),
                            "village": props.get("village") or props.get("suburb") or props.get("city"),
                            "postcode": props.get("postcode"),
                            "country": props.get("country", "India"),
                            "confidence": "geocoder_verified",
                            "provider": "geoapify"
                        })
                        _CACHE[cache_key] = info
                        return info
        except Exception as e:
            logger.warning("Geoapify reverse geocoding failed: %s", e)

    # 2. Nominatim Reverse Geocoding Fallback
    try:
        url = "https://nominatim.openstreetmap.org/reverse"
        headers = {"User-Agent": "AIBhoomi-GeospatialPlatform/1.0"}
        params = {
            "lat": rounded_lat,
            "lon": rounded_lon,
            "format": "jsonv2",
            "addressdetails": "1",
        }
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.get(url, params=params, headers=headers)
            if res.status_code == 200:
                data = res.json()
                addr = data.get("address", {})
                info.update({
                    "formatted": data.get("display_name"),
                    "state": addr.get("state") or info["state"],
                    "district": addr.get("state_district") or addr.get("county"),
                    "taluka": addr.get("county") or addr.get("state_district"),
                    "village": addr.get("village") or addr.get("hamlet") or addr.get("suburb") or addr.get("town"),
                    "postcode": addr.get("postcode"),
                    "country": addr.get("country", "India"),
                    "confidence": "geocoder_verified",
                    "provider": "nominatim"
                })
    except Exception as e:
        logger.warning("Nominatim reverse geocoding failed: %s", e)

    _CACHE[cache_key] = info
    return info
