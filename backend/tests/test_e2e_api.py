"""
End-to-End API Integration Verification for all AI Bhoomi backend services.
"""
import pytest
import httpx
from app.main import app

@pytest.mark.asyncio
async def test_full_system_workflow():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health
        r = await client.get("/health")
        assert r.status_code == 200

        # 2. Register
        reg_payload = {
            "email": "e2e_farmer@aibhoomi.in",
            "password": "FarmerPassword@123",
            "full_name": "E2E Farmer",
            "state": "Maharashtra",
            "district": "Pune"
        }
        r = await client.post("/api/v1/auth/register", json=reg_payload)
        assert r.status_code in (201, 409)

        # 3. Login
        login_payload = {
            "email": "e2e_farmer@aibhoomi.in",
            "password": "FarmerPassword@123"
        }
        r = await client.post("/api/v1/auth/login", json=login_payload)
        assert r.status_code == 200
        token = r.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 4. Auth Me
        r = await client.get("/api/v1/auth/me", headers=headers)
        assert r.status_code == 200
        assert r.json()["email"] == "e2e_farmer@aibhoomi.in"

        # 5. Create Farm
        farm_payload = {
            "name": "E2E Pune Farm",
            "owner_name": "E2E Farmer",
            "state": "Maharashtra",
            "district": "Pune",
            "taluka": "Haveli",
            "village": "Hadapsar",
            "latitude": 18.5089,
            "longitude": 73.9259,
            "boundary_geojson": '{"type": "Polygon", "coordinates": [[[73.92, 18.50], [73.93, 18.50], [73.93, 18.51], [73.92, 18.51], [73.92, 18.50]]]}'
        }
        r = await client.post("/api/v1/farms", json=farm_payload, headers=headers)
        assert r.status_code == 201
        farm_id = r.json()["id"]

        # 6. List Farms
        r = await client.get("/api/v1/farms", headers=headers)
        assert r.status_code == 200
        assert len(r.json()) >= 1

        # 7. Create Soil Sample
        soil_payload = {
            "farm_id": farm_id,
            "sample_label": "Kharif Soil Test",
            "sample_date": "2026-10-12",
            "depth_cm": 15.0,
            "measurements": [
                {"parameter": "pH", "value": 7.4, "unit": "pH"},
                {"parameter": "EC", "value": 0.42, "unit": "dS/m"},
                {"parameter": "OC", "value": 0.68, "unit": "%"},
                {"parameter": "N", "value": 260.0, "unit": "kg/ha"},
                {"parameter": "P", "value": 19.5, "unit": "kg/ha"},
                {"parameter": "K", "value": 320.0, "unit": "kg/ha"}
            ]
        }
        r = await client.post("/api/v1/soil-samples", json=soil_payload, headers=headers)
        assert r.status_code == 201

        # 8. List Soil Samples
        r = await client.get(f"/api/v1/farms/{farm_id}/soil-samples", headers=headers)
        assert r.status_code == 200
        assert len(r.json()) >= 1

        # 9. Trigger Satellite Analysis
        r = await client.post(f"/api/v1/farms/{farm_id}/satellite-analyses", headers=headers)
        assert r.status_code == 201
        assert "ndvi_mean" in r.json()

        # 10. Crop Recommendations
        r = await client.post(f"/api/v1/farms/{farm_id}/crop-recommendations", params={"season": "kharif"}, headers=headers)
        assert r.status_code == 200
        assert "recommendations" in r.json()

        # 11. Fertilizer Recommendations
        r = await client.post(f"/api/v1/farms/{farm_id}/fertilizer-recommendations", params={"crop": "wheat", "season": "rabi"}, headers=headers)
        assert r.status_code == 200
        assert r.json()["status"] == "available"

        # 12. Create Report
        r = await client.post(f"/api/v1/farms/{farm_id}/reports", headers=headers)
        assert r.status_code == 201

        # 13. List Reports
        r = await client.get("/api/v1/reports", headers=headers)
        assert r.status_code == 200
        assert len(r.json()) >= 1
