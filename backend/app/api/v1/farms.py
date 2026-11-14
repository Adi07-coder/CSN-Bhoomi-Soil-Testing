"""

Farm API endpoints.

"""

from __future__ import annotations



import uuid



from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.farm_profile import FarmProfile
from app.repositories.farm_repo import FarmRepository
from app.schemas.farm import FarmCreate, FarmRead, FarmUpdate
from app.schemas.farm_profile import FarmProfileRead, FarmProfileUpdate



router = APIRouter(prefix="/farms", tags=["Farms"])





def _check_ownership(farm, current_user: User) -> None:

    if farm.owner_id != current_user.id:

        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your farm")





@router.get("", response_model=list[FarmRead])

async def list_farms(

    current_user: User = Depends(get_current_user),

    db: AsyncSession = Depends(get_db),

) -> list:

    repo = FarmRepository(db)

    return await repo.list_by_owner(current_user.id)





@router.post("", response_model=FarmRead, status_code=status.HTTP_201_CREATED)

async def create_farm(

    payload: FarmCreate,

    current_user: User = Depends(get_current_user),

    db: AsyncSession = Depends(get_db),

):

    repo = FarmRepository(db)

    try:

        return await repo.create(owner_id=current_user.id, **payload.model_dump())

    except ValueError as exc:

        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))





@router.get("/{farm_id}", response_model=FarmRead)

async def get_farm(

    farm_id: uuid.UUID,

    current_user: User = Depends(get_current_user),

    db: AsyncSession = Depends(get_db),

):

    repo = FarmRepository(db)

    farm = await repo.get_by_id(farm_id)

    if not farm:

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")

    _check_ownership(farm, current_user)

    return farm





@router.patch("/{farm_id}", response_model=FarmRead)

async def update_farm(

    farm_id: uuid.UUID,

    payload: FarmUpdate,

    current_user: User = Depends(get_current_user),

    db: AsyncSession = Depends(get_db),

):

    repo = FarmRepository(db)

    farm = await repo.get_by_id(farm_id)

    if not farm:

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")

    _check_ownership(farm, current_user)

    try:

        return await repo.update(farm, **payload.model_dump(exclude_none=True))

    except ValueError as exc:

        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))





@router.delete("/{farm_id}", status_code=status.HTTP_204_NO_CONTENT)

async def delete_farm(

    farm_id: uuid.UUID,

    cascade: bool = False,

    current_user: User = Depends(get_current_user),

    db: AsyncSession = Depends(get_db),

):

    repo = FarmRepository(db)

    farm = await repo.get_by_id(farm_id)

    if not farm:

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")

    _check_ownership(farm, current_user)



    if not cascade:

        has_deps = await repo.has_dependent_records(farm_id)

        if has_deps:

            raise HTTPException(

                status_code=status.HTTP_409_CONFLICT,

                detail="Cannot delete farm: associated reports or soil assessments exist. To preserve audit history, consider archiving the farm or specify ?cascade=true to delete all associated records."

            )



    try:
        await repo.delete(farm, cascade=cascade)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot delete farm due to integrity constraints: {exc}"
        )


@router.get("/{farm_id}/profile", response_model=FarmProfileRead | None)
async def get_farm_profile(
    farm_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    repo = FarmRepository(db)
    farm = await repo.get_by_id(farm_id)
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")
    _check_ownership(farm, current_user)

    res = await db.execute(select(FarmProfile).where(FarmProfile.farm_id == farm_id))
    return res.scalar_one_or_none()


@router.put("/{farm_id}/profile", response_model=FarmProfileRead)
async def update_farm_profile(
    farm_id: uuid.UUID,
    payload: FarmProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    repo = FarmRepository(db)
    farm = await repo.get_by_id(farm_id)
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")
    _check_ownership(farm, current_user)

    res = await db.execute(select(FarmProfile).where(FarmProfile.farm_id == farm_id))
    profile = res.scalar_one_or_none()
    if profile:
        for k, v in payload.model_dump(exclude_unset=True).items():
            setattr(profile, k, v)
    else:
        profile = FarmProfile(farm_id=farm_id, owner_id=current_user.id, **payload.model_dump())
        db.add(profile)

    await db.commit()
    await db.refresh(profile)
    return profile


