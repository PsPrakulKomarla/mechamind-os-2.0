from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.core.exceptions import NotFoundException, ValidationException
from app.models.team import Team
from app.models.user import User
from app.models.enums import AuditAction, EntityType
from app.repositories.team import team_repo
from app.repositories.department import department_repo
from app.repositories.audit import audit_repo
from app.schemas.team import TeamCreate, TeamUpdate, UserTeamAssignment

class TeamService:
    @staticmethod
    async def get_team(db: AsyncSession, team_id: UUID) -> Team:
        team = await team_repo.get(db, id=team_id)
        if not team or team.is_deleted:
            raise NotFoundException(message="Team not found")
        return team

    @staticmethod
    async def list_teams(db: AsyncSession, department_id: UUID, skip: int = 0, limit: int = 100) -> List[Team]:
        return await team_repo.get_accessible_multi(db, department_id=department_id, skip=skip, limit=limit)

    @staticmethod
    async def create_team(db: AsyncSession, obj_in: TeamCreate, current_user: User) -> Team:
        dept = await department_repo.get(db, id=obj_in.department_id)
        if not dept or dept.is_deleted:
            raise ValidationException(message="Invalid Department ID")

        existing_team = await team_repo.get_by_name(db, name=obj_in.name, department_id=obj_in.department_id)
        if existing_team:
            raise ValidationException(message="Team name already exists in this department")

        team = await team_repo.create(db, obj_in=obj_in)
        
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.CREATE,
            entity_type=EntityType.TEAM,
            entity_id=team.id,
            changes={"name": team.name, "department_id": str(team.department_id)},
            ip_address=None
        )
        await db.commit()
        return team

    @staticmethod
    async def update_team(db: AsyncSession, team_id: UUID, obj_in: TeamUpdate, current_user: User) -> Team:
        team = await TeamService.get_team(db, team_id)
        
        if obj_in.name and obj_in.name != team.name:
            existing_team = await team_repo.get_by_name(db, name=obj_in.name, department_id=team.department_id)
            if existing_team:
                raise ValidationException(message="Team name already exists in this department")
                
        team = await team_repo.update(db, db_obj=team, obj_in=obj_in)
        
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.UPDATE,
            entity_type=EntityType.TEAM,
            entity_id=team.id,
            changes={"updated_fields": obj_in.model_dump(exclude_unset=True)},
            ip_address=None
        )
        await db.commit()
        return team

    @staticmethod
    async def delete_team(db: AsyncSession, team_id: UUID, current_user: User) -> None:
        team = await TeamService.get_team(db, team_id)
        
        await team_repo.update(db, db_obj=team, obj_in={"is_deleted": True})
        
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.DELETE,
            entity_type=EntityType.TEAM,
            entity_id=team.id,
            changes={"name": team.name},
            ip_address=None
        )
        await db.commit()

    @staticmethod
    async def assign_user(db: AsyncSession, team_id: UUID, obj_in: UserTeamAssignment, current_user: User) -> None:
        team = await TeamService.get_team(db, team_id)
        try:
            await team_repo.assign_user(db, user_id=obj_in.user_id, team_id=team.id)
        except IntegrityError:
            raise ValidationException(message="User does not exist")
            
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.UPDATE,
            entity_type=EntityType.TEAM,
            entity_id=team.id,
            changes={"assigned_user_id": str(obj_in.user_id)},
            ip_address=None
        )
        await db.commit()

    @staticmethod
    async def remove_user(db: AsyncSession, team_id: UUID, user_id: UUID, current_user: User) -> None:
        team = await TeamService.get_team(db, team_id)
        await team_repo.remove_user(db, user_id=user_id, team_id=team.id)
        
        await audit_repo.log_action(
            db=db,
            user_id=current_user.id,
            action=AuditAction.UPDATE,
            entity_type=EntityType.TEAM,
            entity_id=team.id,
            changes={"removed_user_id": str(user_id)},
            ip_address=None
        )
        await db.commit()
