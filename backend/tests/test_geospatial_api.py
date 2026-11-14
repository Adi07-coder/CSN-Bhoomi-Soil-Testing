import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_geo_providers_status():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/v1/geo/providers/status")
        assert res.status_code == 200
        data = res.json()
        assert data["geocoding_status"] == "operational"
        assert "Maharashtra, India" in data["default_focus"]

@pytest.mark.asyncio
async def test_calculate_area_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        coords = [
            [73.85, 18.52],
            [73.86, 18.52],
            [73.86, 18.53],
            [73.85, 18.53],
            [73.85, 18.52]
        ]
        res = await ac.post("/api/v1/geo/calculate-area", json={"coordinates": coords})
        assert res.status_code == 200
        data = res.json()
        assert data["area_sqm"] > 0
        assert data["area_acres"] > 0
        assert data["perimeter_meters"] > 0

@pytest.mark.asyncio
async def test_resolve_polygon_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        geojson = {
            "type": "Polygon",
            "coordinates": [[
                [75.71, 19.75],
                [75.72, 19.75],
                [75.72, 19.76],
                [75.71, 19.76],
                [75.71, 19.75]
            ]]
        }
        res = await ac.post("/api/v1/geo/resolve-polygon", json={"geojson": geojson})
        assert res.status_code == 200
        data = res.json()
        assert data["is_valid"] is True
        assert data["vertex_count"] == 4
        assert len(data["vertices"]) == 4
        assert data["vertices"][0]["label"] == "P1"
        assert "centroid" in data
        assert data["area_acres"] > 0
        assert "administrative" in data

@pytest.mark.asyncio
async def test_field_analysis_and_model_registry():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Test Analysis (Demo Mode)
        geojson = {
            "type": "Polygon",
            "coordinates": [[
                [75.71, 19.75],
                [75.72, 19.75],
                [75.72, 19.76],
                [75.71, 19.76],
                [75.71, 19.75]
            ]]
        }
        res = await ac.post("/api/v1/analyses", json={
            "farm_name": "Baramati Sugarcane Plot",
            "geometry": geojson,
            "crop": "Sugarcane",
            "season": "Kharif",
            "analysis_mode": "demo"
        })
        assert res.status_code == 200
        anl = res.json()
        assert anl["is_demo"] is True
        assert "soil_parameters" in anl
        assert "pH" in anl["soil_parameters"]
        assert "N" in anl["soil_parameters"]
        assert "agronomic_advisory" in anl

        # Test Models Registry
        res_models = await ac.get("/api/v1/models")
        assert res_models.status_code == 200
        models = res_models.json()
        assert len(models) >= 1
        active_model = models[0]

        # Test Training Job
        res_job = await ac.post("/api/v1/training-jobs", json={
            "dataset_id": "ds-maharashtra-default",
            "model_name": "Test Candidate Model",
            "algorithm": "Random Forest Regressor"
        })
        assert res_job.status_code == 200
        job_data = res_job.json()
        assert job_data["status"] == "completed"
        assert "model_id" in job_data
