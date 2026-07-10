from typing import Optional, List
from uuid import UUID
from sqlalchemy import select, func, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.team import Team
from app.models.user_team import UserTeam
from app.repositories.base import BaseRepository
from app.schemas.team import TeamCreate, TeamUpdate

class TeamRepository(BaseRepository[Team, TeamCreate, TeamUpdate]):
    async def get_by_name(self, db: AsyncSession, *, name: str, department_id: UUID) -> Optional[Team]:
        result = await db.execute(
            select(Team).where(
                func.lower(Team.name) == name.lower(),
                Team.department_id == department_id,
                Team.is_deleted == False
            )
        )
        return result.scalars().first()
    
    async def get_accessible_multi(self, db: AsyncSession, *, department_id: UUID, skip: int = 0, limit: int = 100) -> List[Team]:
        query = select(Team).where(
            Team.department_id == department_id,
            Team.is_deleted == False
        ).offset(skip).limit(limit)
        
        result = await db.execute(query)
        return list(result.scalars().all())

    async def assign_user(self, db: AsyncSession, *, user_id: UUID, team_id: UUID) -> None:
        # Check if already assigned
        existing = await db.execute(
            select(UserTeam).where(
                UserTeam.user_id == user_id, 
                UserTeam.team_id == team_id
            )
        )
        if not existing.scalars().first():
            user_team = UserTeam(user_id=user_id, team_id=team_id)
            db.add(user_team)
            await db.commit()

    async def remove_user(self, db: AsyncSession, *, user_id: UUID, team_id: UUID) -> None:
        await db.execute(
            delete(UserTeam).where(
                UserTeam.user_id == user_id,
                UserTeam.team_id == team_id
            )
        )
        await db.commit()

team_repo = TeamRepository(Team)
