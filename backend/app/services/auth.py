from typing import Any, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta, timezone

from app.core.security import verify_password, get_password_hash, validate_password_strength
from app.core.jwt import jwt_service
from app.core.redis_security import redis_security
from app.core.exceptions import UnauthorizedException, ValidationException, NotFoundException
from app.core.config import settings
from app.models.user import User
from app.models.organization import Organization
from app.models.role import Role
from app.models.user_role import UserRole
from app.models.user_session import UserSession
from app.models.refresh_token import RefreshToken
from app.models.enums import AuditAction, EntityType
from app.repositories.user import user_repo
from app.repositories.session import session_repo, refresh_token_repo
from app.repositories.audit import audit_repo
from app.repositories.role import role_repo
from app.schemas.auth import LoginRequest, RegisterRequest, Tokens


class AuthService:
    async def _get_user_roles(self, db: AsyncSession, user_id) -> list[str]:
        query = (
            select(Role.name)
            .join(UserRole, UserRole.role_id == Role.id)
            .where(UserRole.user_id == user_id)
        )
        result = await db.execute(query)
        return [r for r in result.scalars().all()]

    async def register(self, db: AsyncSession, obj_in: RegisterRequest) -> User:
        validate_password_strength(obj_in.password)

        user = await user_repo.get_by_email(db, email=obj_in.email)
        if user:
            raise ValidationException(message="User with this email already exists")

        # Create organization
        org = Organization(name=obj_in.organization_name or "Default Org")
        db.add(org)
        await db.flush()  # Get org.id without committing

        # Create user
        new_user = User(
            email=obj_in.email,
            password_hash=get_password_hash(obj_in.password),
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            organization_id=org.id,
            auth_id=None
        )
        db.add(new_user)
        await db.flush()  # Get user.id without committing

        # Get or create USER role
        role = await role_repo.get_by_name(db, name="USER")
        if not role:
            role = Role(name="USER", description="Standard User")
            db.add(role)
            await db.flush()

        # Assign role
        user_role = UserRole(user_id=new_user.id, role_id=role.id)
        db.add(user_role)

        # Audit log
        await audit_repo.log_action(
            db=db,
            organization_id=org.id,
            user_id=new_user.id,
            action=AuditAction.CREATE,
            entity_type=EntityType.USER,
            entity_id=new_user.id
        )

        # Single atomic commit for all registration data
        await db.commit()
        await db.refresh(new_user)

        return new_user

    async def login(self, db: AsyncSession, obj_in: LoginRequest, ip_address: str = None, user_agent: str = None) -> Tokens:
        if await redis_security.is_locked_out(obj_in.email):
            raise UnauthorizedException(message="Account temporarily locked due to multiple failed login attempts")

        user = await user_repo.get_by_email(db, email=obj_in.email)

        if not user:
            await redis_security.record_failed_login(obj_in.email)
            raise UnauthorizedException(message="Invalid credentials")

        if not verify_password(obj_in.password, user.password_hash):
            await redis_security.record_failed_login(obj_in.email)
            await audit_repo.log_login(
                db=db, user_id=user.id, success=False,
                failure_reason="Invalid credentials",
                ip_address=ip_address, user_agent=user_agent
            )
            await db.commit()
            raise UnauthorizedException(message="Invalid credentials")

        await redis_security.clear_login_attempts(obj_in.email)

        roles = await self._get_user_roles(db, user.id)
        access_token = jwt_service.create_access_token(user_id=str(user.id), org_id=str(user.organization_id), roles=roles)
        refresh_token = jwt_service.create_refresh_token(user_id=str(user.id))

        session = UserSession(
            user_id=user.id,
            session_token=access_token,
            ip_address=ip_address,
            user_agent=user_agent,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        db.add(session)

        rt = RefreshToken(
            user_id=user.id,
            token=refresh_token,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
        )
        db.add(rt)

        await audit_repo.log_login(db=db, user_id=user.id, success=True, ip_address=ip_address, user_agent=user_agent)
        await db.commit()

        return Tokens(access_token=access_token, refresh_token=refresh_token)

    async def logout(self, db: AsyncSession, user_id: str, access_token: str) -> None:
        await jwt_service.revoke_token(access_token)

        session = await session_repo.get_by_token(db, token=access_token)
        if session:
            session.is_revoked = True

        await refresh_token_repo.revoke_all_for_user(db, user_id=user_id)

        await audit_repo.log_action(
            db=db,
            user_id=user_id,
            action=AuditAction.LOGOUT,
            entity_type=EntityType.USER,
            entity_id=user_id
        )
        await db.commit()


auth_service = AuthService()
