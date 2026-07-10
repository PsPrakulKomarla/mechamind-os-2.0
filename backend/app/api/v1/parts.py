from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.rbac import RequirePermissions
from app.models.user import User
from app.models.enums import ScopeType
from app.schemas.component import PartDefinitionCreate, PartDefinitionResponse
from app.repositories.component import component_repo

router = APIRouter(tags=["Part Definitions"])

@router.post("/", response_model=PartDefinitionResponse, status_code=status.HTTP_201_CREATED)
async def create_part_definition(
    obj_in: PartDefinitionCreate,
    db: AsyncSession = Depends(get_db),
    # Part definitions are global master data or org-level. We'll enforce a global permission here for simplicity,
    # but in a full deployment, this could be scoped to ORGANIZATION.
    current_user: User = Depends(RequirePermissions(["part_definition.create"], ScopeType.GLOBAL))
):
    """Create a master part definition (e.g. Mechanical Seal Model XYZ)"""
    return await component_repo.create_part_definition(db, obj_in=obj_in)

@router.get("/{id}", response_model=PartDefinitionResponse)
async def get_part_definition(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user) # Globally readable for simplicity, or check Org scope
):
    """View a master part definition"""
    part = await component_repo.get_part_definition(db, id)
    if not part:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Part not found")
    return part
