"""

Farm repository - async CRUD operations.

"""

from __future__ import annotations



import json

import uuid



from sqlalchemy import select, delete

from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy.exc import IntegrityError



from app.models.farm import Farm

from app.models.ml_model import MLPrediction, Report

from app.models.satellite import SatelliteAnalysis

from app.models.soil import SoilSample, SoilMeasurement

from app.services.geo_utils import calculate_polygon_area_sqm, validate_geojson_polygon





class FarmRepository:

    def __init__(self, db: AsyncSession) -> None:

        self.db = db



    async def list_by_owner(self, owner_id: uuid.UUID) -> list[Farm]:

        result = await self.db.execute(

            select(Farm).where(Farm.owner_id == owner_id).order_by(Farm.created_at.desc())

        )

        return list(result.scalars().all())



    async def get_by_id(self, farm_id: uuid.UUID) -> Farm | None:

        result = await self.db.execute(select(Farm).where(Farm.id == farm_id))

        return result.scalar_one_or_none()



    async def has_dependent_records(self, farm_id: uuid.UUID) -> bool:

        res = await self.db.execute(select(Report.id).where(Report.farm_id == farm_id).limit(1))

        if res.scalar_one_or_none() is not None:

            return True

        sample_res = await self.db.execute(select(SoilSample.id).where(SoilSample.farm_id == farm_id).limit(1))

        if sample_res.scalar_one_or_none() is not None:

            return True

        sat_res = await self.db.execute(select(SatelliteAnalysis.id).where(SatelliteAnalysis.farm_id == farm_id).limit(1))

        if sat_res.scalar_one_or_none() is not None:

            return True

        return False



    async def create(self, owner_id: uuid.UUID, **kwargs) -> Farm:
        boundary_geojson = kwargs.pop("boundary_geojson", None)
        if not boundary_geojson:
            raise ValueError("A valid field boundary is mandatory for farm registration.")

        validated = validate_geojson_polygon(boundary_geojson)
        kwargs["boundary_geojson"] = json.dumps(validated)
        area_sqm = calculate_polygon_area_sqm(validated)

        if area_sqm <= 0:
            raise ValueError("Selected field polygon has zero or invalid geographic area.")

        # Recompute / ensure authoritative centroid from polygon vertices
        raw_coords = validated.get("coordinates", [[]])[0]
        distinct_coords = raw_coords[:-1] if raw_coords and raw_coords[0] == raw_coords[-1] else raw_coords
        if distinct_coords:
            lons = [p[0] for p in distinct_coords]
            lats = [p[1] for p in distinct_coords]
            if kwargs.get("latitude") is None:
                kwargs["latitude"] = round(sum(lats) / len(lats), 6)
            if kwargs.get("longitude") is None:
                kwargs["longitude"] = round(sum(lons) / len(lons), 6)

        farm = Farm(owner_id=owner_id, area_sqm=area_sqm, **kwargs)
        self.db.add(farm)
        await self.db.commit()
        await self.db.refresh(farm)
        return farm



    async def update(self, farm: Farm, **kwargs) -> Farm:

        boundary_geojson = kwargs.pop("boundary_geojson", None)

        if boundary_geojson is not None:

            validated = validate_geojson_polygon(boundary_geojson)

            kwargs["boundary_geojson"] = json.dumps(validated)

            kwargs["area_sqm"] = calculate_polygon_area_sqm(validated)



        for key, value in kwargs.items():

            if value is not None:

                setattr(farm, key, value)

        await self.db.commit()

        await self.db.refresh(farm)

        return farm



    async def delete(self, farm: Farm, cascade: bool = False) -> None:

        if cascade:

            sample_ids_stmt = select(SoilSample.id).where(SoilSample.farm_id == farm.id)

            await self.db.execute(delete(SoilMeasurement).where(SoilMeasurement.sample_id.in_(sample_ids_stmt)))

            await self.db.execute(delete(SoilSample).where(SoilSample.farm_id == farm.id))

            await self.db.execute(delete(Report).where(Report.farm_id == farm.id))

            await self.db.execute(delete(SatelliteAnalysis).where(SatelliteAnalysis.farm_id == farm.id))

            await self.db.execute(delete(MLPrediction).where(MLPrediction.farm_id == farm.id))



        try:

            await self.db.delete(farm)

            await self.db.commit()

        except IntegrityError:

            await self.db.rollback()

            raise

