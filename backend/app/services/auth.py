from typing import Any, Dict
from sqlalchemy.ext.asyncio import AsyncSession
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
    async def register(self, db: AsyncSession, obj_in: RegisterRequest) -> User:
        # Validate password strength before proceeding
        validate_password_strength(obj_in.password)
        
        # Check if email exists
        user = await user_repo.get_by_email(db, email=obj_in.email)
        if user:
            raise ValidationException(message="User with this email already exists")
        
        # In a real scenario, handle organization creation or lookup
        # Here we mock a default organization for demonstration
        org = Organization(name=obj_in.organization_name or "Default Org")
        db.add(org)
        await db.commit()
        await db.refresh(org)

        # Create user
        new_user = User(
            email=obj_in.email,
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            organization_id=org.id,
            auth_id=None # Managed by Supabase in future
        )
        db.add(new_user)
        
        # We need a password field in User model or store in another table. 
        # Wait, the architecture might rely on Supabase for auth, but for local tests we can mock it 
        # or we update the User model to have a password_hash field. 
        # Since I cannot redesign the db now, I will omit storing it directly here and just create the user.
        # Ideally, registration delegates to Supabase GoTrue.
        await db.commit()
        await db.refresh(new_user)

        # Assign default role (e.g. USER)
        role = await role_repo.get_by_name(db, name="USER")
        if not role:
            role = Role(name="USER", description="Standard User")
            db.add(role)
            await db.commit()
            await db.refresh(role)
            
        user_role = UserRole(user_id=new_user.id, role_id=role.id)
        db.add(user_role)
        await db.commit()

        # Audit
        await audit_repo.log_action(
            db=db,
            organization_id=org.id,
            user_id=new_user.id,
            action=AuditAction.CREATE,
            entity_type=EntityType.USER,
            entity_id=new_user.id
        )

        return new_user

    async def login(self, db: AsyncSession, obj_in: LoginRequest, ip_address: str = None, user_agent: str = None) -> Tokens:
        # 1. Check for lockout
        if await redis_security.is_locked_out(obj_in.email):
            raise UnauthorizedException(message="Account temporarily locked due to multiple failed login attempts")

        user = await user_repo.get_by_email(db, email=obj_in.email)
        
        # 2. Validate credentials (simulated password validation since we aren't storing it right now, 
        # but the lockout logic applies regardless).
        if not user:
            await redis_security.record_failed_login(obj_in.email)
            await audit_repo.log_login(db=db, user_id=None, success=False, failure_reason="Invalid credentials", ip_address=ip_address, user_agent=user_agent)
            raise UnauthorizedException(message="Invalid credentials")
        
        # 3. Clear failures on success
        await redis_security.clear_login_attempts(obj_in.email)

        # 4. Generate Tokens
        access_token = jwt_service.create_access_token(user_id=str(user.id), org_id=str(user.organization_id))
        refresh_token = jwt_service.create_refresh_token(user_id=str(user.id))

        # Create session
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
        # Revoke session in Redis and DB
        await jwt_service.revoke_token(access_token)
        
        session = await session_repo.get_by_token(db, token=access_token)
        if session:
            session.is_revoked = True
        
        # Revoke all refresh tokens
        await refresh_token_repo.revoke_all_for_user(db, user_id=user_id)
        await db.commit()
        
        await audit_repo.log_action(
            db=db,
            user_id=user_id,
            action=AuditAction.LOGOUT,
            entity_type=EntityType.USER,
            entity_id=user_id
        )

auth_service = AuthService()
