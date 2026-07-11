from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.rbac import RequirePermissions
from app.models.user import User
from app.schemas.response import APIResponse
from app.schemas.team import (
    TeamCreate, TeamUpdate, 
    TeamResponse, UserTeamAssignment
)
from app.services.team import TeamService

router = APIRouter()

@router.post("", response_model=APIResponse[TeamResponse], dependencies=[Depends(RequirePermissions(["team.create"]))])
async def create_team(
    obj_in: TeamCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new team inside a department."""
    team = await TeamService.create_team(db, obj_in, current_user)
    return APIResponse(message="Team created successfully", data=TeamResponse.model_validate(team))

@router.get("/department/{department_id}", response_model=APIResponse[List[TeamResponse]])
async def list_teams_for_department(
    department_id: UUID,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List teams within a specific department."""
    teams = await TeamService.list_teams(db, department_id=department_id, skip=skip, limit=limit)
    data = [TeamResponse.model_validate(t) for t in teams]
    return APIResponse(message="Teams retrieved successfully", data=data)

@router.get("/{team_id}", response_model=APIResponse[TeamResponse], dependencies=[Depends(RequirePermissions(["team.read"]))])
async def get_team(
    team_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get team details."""
    team = await TeamService.get_team(db, team_id)
    return APIResponse(message="Team retrieved successfully", data=TeamResponse.model_validate(team))

@router.put("/{team_id}", response_model=APIResponse[TeamResponse], dependencies=[Depends(RequirePermissions(["team.update"]))])
async def update_team(
    team_id: UUID,
    obj_in: TeamUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update team information."""
    team = await TeamService.update_team(db, team_id, obj_in, current_user)
    return APIResponse(message="Team updated successfully", data=TeamResponse.model_validate(team))

@router.delete("/{team_id}", response_model=APIResponse[None], dependencies=[Depends(RequirePermissions(["team.delete"]))])
async def delete_team(
    team_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Soft delete a team."""
    await TeamService.delete_team(db, team_id, current_user)
    return APIResponse(message="Team deleted successfully", data=None)

@router.post("/{team_id}/users", response_model=APIResponse[None], dependencies=[Depends(RequirePermissions(["team.update"]))])
async def assign_user_to_team(
    team_id: UUID,
    obj_in: UserTeamAssignment,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Assign a user to the team."""
    await TeamService.assign_user(db, team_id, obj_in, current_user)
    return APIResponse(message="User assigned to team successfully", data=None)

@router.delete("/{team_id}/users/{user_id}", response_model=APIResponse[None], dependencies=[Depends(RequirePermissions(["team.update"]))])
async def remove_user_from_team(
    team_id: UUID,
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove a user from the team."""
    await TeamService.remove_user(db, team_id, user_id, current_user)
    return APIResponse(message="User removed from team successfully", data=None)
