from typing import Any, Dict, List, Optional, Union
from uuid import UUID
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func

from app.models.user import User
from app.models.organization import Organization
from app.models.role import Role
from app.models.permission import Permission
from app.models.enums import UserStatus, ScopeType
from app.models.audit_log import AuditLog
from app.models.user_role import UserRole
from app.models.role_permission import RolePermission
from app.models.department import Department
from app.models.factory import Factory
from app.models.user_session import UserSession
from app.models.login_history import LoginHistory
from app.models.document import Document
from app.models.extraction import ProcessingJob
from app.schemas.user import AdminUserCreate, UserUpdate, UserResponse
from app.schemas.rbac import RoleCreate, RoleUpdate, AssignPermissionRequest
from app.core.security import get_password_hash
from app.core.exceptions import NotFoundException, ValidationException, UnauthorizedException
from app.core.redis_security import redis_security


class AdminService:
    async def get_users(
        self,
        db: AsyncSession,
        filters: Dict[str, Any],
        requesting_user_id: UUID
    ) -> List[UserResponse]:
        base_query = (
            select(User)
            .where(User.is_deleted == False)
        )

        search = filters.get("search")
        if search:
            base_query = base_query.where(
                or_(
                    User.email.like(f"%{search}%"),
                    User.first_name.like(f"%{search}%"),
                    User.last_name.like(f"%{search}%")
                )
            )

        status = filters.get("status")
        if status:
            base_query = base_query.where(User.status == UserStatus(status))

        organization_id = filters.get("organization_id")
        if organization_id:
            base_query = base_query.where(User.organization_id == organization_id)

        skip = filters.get("skip", 0)
        limit = filters.get("limit", 100)
        result = await db.execute(base_query.offset(skip).limit(limit))

        users = []
        for user in result.scalars().all():
            user_response = UserResponse.model_validate(user)

            roles_query = (
                select(Role.name)
                .join(UserRole, UserRole.role_id == Role.id)
                .where(UserRole.user_id == user.id)
            )
            roles_result = await db.execute(roles_query)
            user_response.roles = [r for r in roles_result.scalars().all()]

            org_query = select(Organization.name).where(Organization.id == user.organization_id)
            org_result = await db.execute(org_query)
            org_name = org_result.scalar()
            user_response.organization_name = org_name

            users.append(user_response)

        return users

    async def create_user(
        self,
        db: AsyncSession,
        obj_in: AdminUserCreate,
        requesting_user_id: UUID
    ) -> User:
        existing_user = await db.execute(
            select(User).where(User.email == obj_in.email, User.is_deleted == False)
        )
        if existing_user.scalar_one_or_none():
            raise ValidationException(message="User with this email already exists")

        new_user = User(
            email=obj_in.email,
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            organization_id=obj_in.organization_id,
            password_hash=get_password_hash(obj_in.password),
            status=UserStatus.ACTIVE
        )
        db.add(new_user)
        await db.flush()

        await self._create_audit_log(
            db, requesting_user_id, "CREATE", "USER", new_user.id,
            details=f"User {new_user.email} created by admin"
        )

        await db.commit()
        await db.refresh(new_user)
        return new_user

    async def update_user(
        self,
        db: AsyncSession,
        user_id: UUID,
        obj_in: UserUpdate,
        requesting_user_id: UUID
    ) -> User:
        user = await db.execute(
            select(User).where(User.id == user_id, User.is_deleted == False)
        )
        user = user.scalar_one_or_none()
        if not user:
            raise NotFoundException(message="User not found")

        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)

        await self._create_audit_log(
            db, requesting_user_id, "UPDATE", "USER", user_id,
            details=f"User {user.email} updated by admin"
        )

        await db.commit()
        await db.refresh(user)
        return user

    async def delete_user(
        self,
        db: AsyncSession,
        user_id: UUID,
        requesting_user_id: UUID
    ) -> None:
        user = await db.execute(
            select(User).where(User.id == user_id, User.is_deleted == False)
        )
        user = user.scalar_one_or_none()
        if not user:
            raise NotFoundException(message="User not found")

        user.is_deleted = True

        await self._create_audit_log(
            db, requesting_user_id, "DELETE", "USER", user_id,
            details=f"User {user.email} deleted by admin"
        )

        await db.commit()

    async def get_roles(
        self,
        db: AsyncSession,
        filters: Dict[str, Any],
        requesting_user_id: UUID
    ) -> List[Role]:
        base_query = select(Role)

        organization_id = filters.get("organization_id")
        if organization_id:
            base_query = base_query.where(Role.organization_id == organization_id)

        skip = filters.get("skip", 0)
        limit = filters.get("limit", 100)

        result = await db.execute(base_query.offset(skip).limit(limit))

        roles = []
        for role in result.scalars().all():
            permissions_query = (
                select(func.count(RolePermission.id))
                .where(RolePermission.role_id == role.id)
            )
            permissions_result = await db.execute(permissions_query)
            role.permissions_count = permissions_result.scalar() or 0

            user_count_query = (
                select(func.count(UserRole.id))
                .where(UserRole.role_id == role.id)
            )
            user_count_result = await db.execute(user_count_query)
            role.user_count = user_count_result.scalar() or 0

            roles.append(role)

        return roles

    async def create_role(
        self,
        db: AsyncSession,
        obj_in: RoleCreate,
        requesting_user_id: UUID
    ) -> Role:
        new_role = Role(
            name=obj_in.name,
            description=obj_in.description,
            organization_id=obj_in.organization_id
        )
        db.add(new_role)
        await db.flush()

        await self._create_audit_log(
            db, requesting_user_id, "CREATE", "ROLE", new_role.id,
            details=f"Role {new_role.name} created by admin"
        )

        await db.commit()
        await db.refresh(new_role)
        return new_role

    async def assign_permissions_to_role(
        self,
        db: AsyncSession,
        role_id: UUID,
        permission_ids: List[UUID],
        requesting_user_id: UUID
    ) -> None:
        role = await db.execute(
            select(Role).where(Role.id == role_id)
        )
        role = role.scalar_one_or_none()
        if not role:
            raise NotFoundException(message="Role not found")

        existing_assignments = await db.execute(
            select(RolePermission).where(RolePermission.role_id == role_id)
        )
        existing_ids = {rp.permission_id for rp in existing_assignments.scalars().all()}

        new_permission_ids = set(permission_ids) - existing_ids
        removed_permission_ids = existing_ids - set(permission_ids)

        for permission_id in new_permission_ids:
            permission = await db.execute(
                select(Permission).where(Permission.id == permission_id)
            )
            permission = permission.scalar_one_or_none()
            if not permission:
                raise ValidationException(message=f"Permission with id {permission_id} not found")

            role_permission = RolePermission(role_id=role_id, permission_id=permission_id)
            db.add(role_permission)

        for permission_id in removed_permission_ids:
            await db.execute(
                RolePermission.__table__.delete().where(
                    and_(RolePermission.role_id == role_id, RolePermission.permission_id == permission_id)
                )
            )

        await self._create_audit_log(
            db, requesting_user_id, "UPDATE", "ROLE", role_id,
            details=f"Permissions assigned to role {role.name}"
        )

        await db.commit()

    async def get_permissions(
        self,
        db: AsyncSession,
        requesting_user_id: UUID,
        skip: int = 0,
        limit: int = 100
    ) -> List[Permission]:
        result = await db.execute(
            select(Permission)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def create_permission(
        self,
        db: AsyncSession,
        obj_in: Dict[str, Any],
        requesting_user_id: UUID
    ) -> Permission:
        existing_permission = await db.execute(
            select(Permission).where(Permission.name == obj_in["name"])
        )
        if existing_permission.scalar_one_or_none():
            raise ValidationException(message="Permission with this name already exists")

        new_permission = Permission(
            name=obj_in["name"],
            action=obj_in["action"],
            resource=obj_in["resource"],
            description=obj_in.get("description")
        )
        db.add(new_permission)
        await db.flush()

        await self._create_audit_log(
            db, requesting_user_id, "CREATE", "PERMISSION", new_permission.id,
            details=f"Permission {new_permission.name} created by admin"
        )

        await db.commit()
        await db.refresh(new_permission)
        return new_permission

    async def assign_role_to_user(
        self,
        db: AsyncSession,
        user_id: UUID,
        role_id: UUID,
        requesting_user_id: UUID
    ) -> None:
        user = await db.execute(
            select(User).where(User.id == user_id, User.is_deleted == False)
        )
        user = user.scalar_one_or_none()
        if not user:
            raise NotFoundException(message="User not found")

        role = await db.execute(
            select(Role).where(Role.id == role_id)
        )
        role = role.scalar_one_or_none()
        if not role:
            raise NotFoundException(message="Role not found")

        existing_assignment = await db.execute(
            select(UserRole).where(UserRole.user_id == user_id, UserRole.role_id == role_id)
        )
        if existing_assignment.scalar_one_or_none():
            return

        user_role = UserRole(user_id=user_id, role_id=role_id)
        db.add(user_role)

        await self._create_audit_log(
            db, requesting_user_id, "UPDATE", "USER", user_id,
            details=f"Role {role.name} assigned to user"
        )

        await db.commit()

    async def get_dashboard_stats(
        self,
        db: AsyncSession,
        user_id: UUID
    ) -> Dict[str, Any]:
        total_users_result = await db.execute(
            select(func.count(User.id)).where(User.is_deleted == False)
        )
        total_users = total_users_result.scalar() or 0

        total_organizations_result = await db.execute(
            select(func.count(Organization.id)).where(Organization.is_deleted == False)
        )
        total_organizations = total_organizations_result.scalar() or 0

        active_organizations_result = await db.execute(
            select(func.count(Organization.id)).where(
                Organization.is_deleted == False,
                Organization.status == "ACTIVE"
            )
        )
        active_organizations = active_organizations_result.scalar() or 0

        total_roles_result = await db.execute(
            select(func.count(Role.id))
        )
        total_roles = total_roles_result.scalar() or 0

        total_permissions_result = await db.execute(
            select(func.count(Permission.id))
        )
        total_permissions = total_permissions_result.scalar() or 0

        users_today_result = await db.execute(
            select(func.count(User.id)).where(
                User.created_at >= datetime.now() - timedelta(hours=24),
                User.is_deleted == False
            )
        )
        users_today = users_today_result.scalar() or 0

        users_this_week_result = await db.execute(
            select(func.count(User.id)).where(
                User.created_at >= datetime.now() - timedelta(days=7),
                User.is_deleted == False
            )
        )
        users_this_week = users_this_week_result.scalar() or 0

        organizations_today_result = await db.execute(
            select(func.count(Organization.id)).where(
                Organization.created_at >= datetime.now() - timedelta(hours=24),
                Organization.is_deleted == False
            )
        )
        organizations_today = organizations_today_result.scalar() or 0

        return {
            "total_users": total_users,
            "total_organizations": total_organizations,
            "active_organizations": active_organizations,
            "total_roles": total_roles,
            "total_permissions": total_permissions,
            "users_created_today": users_today,
            "users_created_this_week": users_this_week,
            "organizations_created_today": organizations_today,
            "storage_used_mb": 0,
            "system_health_score": 100
        }

    async def get_system_stats(
        self,
        db: AsyncSession,
        days: int,
        requesting_user_id: UUID
    ) -> Dict[str, Any]:
        active_sessions_result = await db.execute(
            select(func.count(UserSession.id)).where(UserSession.is_revoked == False)
        )
        active_sessions = active_sessions_result.scalar() or 0

        active_jobs_result = await db.execute(
            select(func.count(ProcessingJob.id)).where(ProcessingJob.status == "PROCESSING")
        )
        active_jobs = active_jobs_result.scalar() or 0

        failed_jobs_result = await db.execute(
            select(func.count(ProcessingJob.id)).where(ProcessingJob.status == "FAILED")
        )
        failed_jobs = failed_jobs_result.scalar() or 0

        recent_logins_result = await db.execute(
            select(User.id, LoginHistory.created_at)
            .join(LoginHistory, User.id == LoginHistory.user_id)
            .where(LoginHistory.success == True)
            .order_by(LoginHistory.created_at.desc())
            .limit(10)
        )
        recent_logins = [{"user_id": r[0], "timestamp": r[1]} for r in recent_logins_result.all()]

        recent_failures_result = await db.execute(
            select(User.id, LoginHistory.created_at, LoginHistory.failure_reason)
            .join(LoginHistory, User.id == LoginHistory.user_id)
            .where(LoginHistory.success == False)
            .order_by(LoginHistory.created_at.desc())
            .limit(10)
        )
        recent_failures = [{"user_id": r[0], "timestamp": r[1], "reason": r[2]} for r in recent_failures_result.all()]

        import psutil
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')

        return {
            "active_sessions": active_sessions,
            "active_jobs": active_jobs,
            "processing_jobs": active_jobs,
            "failed_jobs": failed_jobs,
            "memory_usage_mb": memory.used / (1024 * 1024),
            "cpu_usage_percent": psutil.cpu_percent(interval=0.1),
            "disk_space_used_gb": disk.used / (1024 * 1024 * 1024),
            "recent_logins": recent_logins,
            "recent_failures": recent_failures,
            "system_alerts": []
        }

    async def get_permissions_summary(
        self,
        db: AsyncSession,
        requesting_user_id: UUID
    ) -> Dict[str, Any]:
        total_result = await db.execute(
            select(func.count(Permission.id))
        )
        total_permissions = total_result.scalar() or 0

        return {
            "total_permissions": total_permissions,
            "global_permissions": total_permissions,
            "organization_permissions": 0,
            "factory_permissions": 0,
            "department_permissions": 0,
            "permission_groups": [],
            "recently_added_permissions": []
        }

    async def get_audit_logs(
        self,
        db: AsyncSession,
        filters: Dict[str, Any],
        requesting_user_id: UUID
    ) -> List[AuditLog]:
        base_query = select(AuditLog)

        start_date = filters.get("start_date")
        if start_date:
            base_query = base_query.where(AuditLog.created_at >= start_date)

        end_date = filters.get("end_date")
        if end_date:
            base_query = base_query.where(AuditLog.created_at <= end_date)

        user_id = filters.get("user_id")
        if user_id:
            base_query = base_query.where(AuditLog.user_id == user_id)

        action = filters.get("action")
        if action:
            base_query = base_query.where(AuditLog.action == action)

        entity_type = filters.get("entity_type")
        if entity_type:
            base_query = base_query.where(AuditLog.entity_type == entity_type)

        skip = filters.get("skip", 0)
        limit = filters.get("limit", 100)

        result = await db.execute(base_query.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit))
        return result.scalars().all()

    async def get_system_settings(
        self,
        db: AsyncSession,
        user_id: UUID
    ) -> Dict[str, Any]:
        from app.core.config import settings
        return {
            "app_name": getattr(settings, "APP_NAME", "MechaMind OS"),
            "version": getattr(settings, "VERSION", "2.0.0"),
            "maintenance_mode": getattr(settings, "MAINTENANCE_MODE", False),
            "max_file_size_mb": getattr(settings, "MAX_FILE_SIZE_MB", 100),
            "rate_limit_per_minute": getattr(settings, "RATE_LIMIT_PER_MINUTE", 60),
            "enable_audit_log": getattr(settings, "ENABLE_AUDIT_LOG", True),
            "audit_log_retention_days": getattr(settings, "AUDIT_LOG_RETENTION_DAYS", 90),
            "enable_2fa": getattr(settings, "ENABLE_2FA", False),
            "session_timeout_minutes": getattr(settings, "SESSION_TIMEOUT_MINUTES", 30),
            "max_login_attempts": getattr(settings, "MAX_LOGIN_ATTEMPTS", 5),
        }

    async def update_system_settings(
        self,
        db: AsyncSession,
        obj_in: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        await self._create_audit_log(
            db, user_id, "UPDATE", "SYSTEM", None,
            details="System settings updated by admin"
        )

        return obj_in

    async def reset_user_password(
        self,
        db: AsyncSession,
        user_id: UUID,
        new_password: str,
        requesting_user_id: UUID
    ) -> None:
        user = await db.execute(
            select(User).where(User.id == user_id, User.is_deleted == False)
        )
        user = user.scalar_one_or_none()
        if not user:
            raise NotFoundException(message="User not found")

        user.password_hash = get_password_hash(new_password)

        await self._create_audit_log(
            db, requesting_user_id, "UPDATE", "USER", user_id,
            details="User password reset by admin"
        )

        await db.commit()

    async def unlock_user_account(
        self,
        db: AsyncSession,
        user_id: UUID,
        requesting_user_id: UUID
    ) -> None:
        user = await db.execute(
            select(User).where(User.id == user_id, User.is_deleted == False)
        )
        user = user.scalar_one_or_none()
        if not user:
            raise NotFoundException(message="User not found")

        await redis_security.clear_login_attempts(user.email)

        await self._create_audit_log(
            db, requesting_user_id, "UPDATE", "USER", user_id,
            details="User account unlocked by admin"
        )

        await db.commit()

    async def get_dashboard_activities(
        self,
        db: AsyncSession,
        hours: int,
        requesting_user_id: UUID
    ) -> List[AuditLog]:
        cutoff = datetime.now() - timedelta(hours=hours)

        result = await db.execute(
            select(AuditLog)
            .where(AuditLog.created_at >= cutoff)
            .order_by(AuditLog.created_at.desc())
            .limit(50)
        )
        return result.scalars().all()

    async def get_roles_summary(
        self,
        db: AsyncSession,
        requesting_user_id: UUID
    ) -> List[Dict[str, Any]]:
        result = await db.execute(select(Role))

        roles_summary = []
        for role in result.scalars().all():
            permissions_count_result = await db.execute(
                select(func.count(RolePermission.id)).where(RolePermission.role_id == role.id)
            )
            permissions_count = permissions_count_result.scalar() or 0

            users_count_result = await db.execute(
                select(func.count(UserRole.id)).where(UserRole.role_id == role.id)
            )
            users_count = users_count_result.scalar() or 0

            role_summary = {
                "role_id": role.id,
                "name": role.name,
                "description": role.description,
                "permission_count": permissions_count,
                "user_count": users_count,
                "organization_id": role.organization_id,
                "is_global": role.organization_id is None
            }
            roles_summary.append(role_summary)

        return roles_summary

    async def get_organizations_summary(
        self,
        db: AsyncSession,
        requesting_user_id: UUID
    ) -> List[Dict[str, Any]]:
        result = await db.execute(
            select(Organization).where(Organization.is_deleted == False)
        )

        org_summary_list = []
        for org in result.scalars().all():
            users_count_result = await db.execute(
                select(func.count(User.id)).where(User.organization_id == org.id, User.is_deleted == False)
            )
            users_count = users_count_result.scalar() or 0

            factories_count_result = await db.execute(
                select(func.count(Factory.id)).where(Factory.organization_id == org.id, Factory.is_deleted == False)
            )
            factories_count = factories_count_result.scalar() or 0

            departments_count_result = await db.execute(
                select(func.count(Department.id))
                .join(Factory, Department.factory_id == Factory.id)
                .where(Factory.organization_id == org.id, Department.is_deleted == False)
            )
            departments_count = departments_count_result.scalar() or 0

            org_summary = {
                "organization_id": org.id,
                "name": org.name,
                "status": org.status.value if hasattr(org.status, 'value') else org.status,
                "user_count": users_count,
                "factory_count": factories_count,
                "department_count": departments_count,
                "created_at": org.created_at,
                "storage_used_mb": 0
            }
            org_summary_list.append(org_summary)

        return org_summary_list

    async def _create_audit_log(
        self,
        db: AsyncSession,
        user_id: UUID,
        action: str,
        entity_type: str,
        entity_id: Optional[UUID] = None,
        details: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> None:
        from app.models.enums import AuditAction, EntityType

        action_enum = AuditAction(action) if action in [e.value for e in AuditAction] else AuditAction.UPDATE
        entity_enum = EntityType(entity_type) if entity_type in [e.value for e in EntityType] else EntityType.USER

        audit_log = AuditLog(
            user_id=user_id,
            action=action_enum,
            entity_type=entity_enum,
            entity_id=entity_id,
            changes={"details": details} if details else None,
            ip_address=ip_address
        )
        db.add(audit_log)


admin_service = AdminService()
