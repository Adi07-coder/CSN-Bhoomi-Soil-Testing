"""
AI Bhoomi — Database Seeding Script.
Populates the database with realistic Maharashtra agricultural data:
- Test farmer account
- 4 farms (Pune, Nashik, Kolhapur, Solapur) with cadastral references and GeoJSON bounds
- Laboratory soil test records
- Sentinel-2 satellite NDVI vegetation runs
- Advisory reports
"""
import asyncio
import json
import uuid
from datetime import datetime, date

SEED_USER = {
    "email": "farmer@aibhoomi.in",
    "password_hash": "$2b$12$e8YkZ8cZb7pEKnM2zJ8K0eA7zV8z.ZJ0bU.mX4D/k3IeFqGfRzW6O", # hashed Farmer@123
    "full_name": "Ramesh Dnyandev Patil",
    "phone": "+91 98220 12345",
    "state": "Maharashtra",
    "district": "Pune",
}

FARMS = [
    {
        "name": "Baramati Sugarcane Farm",
        "owner_name": "Ramesh Patil",
        "land_record_ref": "Survey No. 142/2A (7/12 Extract)",
        "state": "Maharashtra",
        "district": "Pune",
        "taluka": "Baramati",
        "village": "Malegaon",
        "latitude": 18.1552,
        "longitude": 74.5731,
        "area_acres": 4.5,
        "area_hectares": 1.82,
        "status": "active",
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[74.57214, 18.15621], [74.57482, 18.15685], [74.57428, 18.15422], [74.57165, 18.15378], [74.57214, 18.15621]]]
        })
    },
    {
        "name": "Pimpalgaon Onion & Grape Orchard",
        "owner_name": "Ramesh Patil",
        "land_record_ref": "Gat No. 88/1B",
        "state": "Maharashtra",
        "district": "Nashik",
        "taluka": "Niphad",
        "village": "Pimpalgaon Baswant",
        "latitude": 20.1731,
        "longitude": 73.9864,
        "area_acres": 3.2,
        "area_hectares": 1.29,
        "status": "active",
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[73.98512, 20.17425], [73.98824, 20.17488], [73.98776, 20.17192], [73.98460, 20.17145], [73.98512, 20.17425]]]
        })
    },
    {
        "name": "Panchganga Soybean & Sugarcane Plot",
        "owner_name": "Ramesh Patil",
        "land_record_ref": "Survey No. 204/3",
        "state": "Maharashtra",
        "district": "Kolhapur",
        "taluka": "Karveer",
        "village": "Shiroli",
        "latitude": 16.7410,
        "longitude": 74.2790,
        "area_acres": 5.0,
        "area_hectares": 2.02,
        "status": "active",
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[74.2775, 16.7425], [74.2810, 16.7428], [74.2805, 16.7395], [74.2770, 16.7392], [74.2775, 16.7425]]]
        })
    }
]

print("Seed template prepared. Ready to execute against DB.")
