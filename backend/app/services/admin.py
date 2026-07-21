from typing import Any, Dict, List, Optional, Union
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_

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
from app.models.user_org_role import UserOrganizationRole
from app.models.user_factory_role import UserFactoryRole
from app.models.user_dept_role import UserDepartmentRole
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.schemas.rbac import RoleCreate, RoleUpdate, AssignPermissionRequest
from app.schemas.admin import SystemSettingsResponse, AdminDashboardStatsResponse, AdminPermissionsSummaryResponse, AdminSystemStatsResponse, RoleSummaryResponse, OrganizationSummaryResponse as AdminOrganizationSummaryResponse
from app.services.rbac import rbac_service
from app.core.security import get_password_hash
from app.core.exceptions import NotFoundException, ValidationException, UnauthorizedException


class AdminService:
    async def get_users(
        self,
        db: AsyncSession,
        filters: Dict[str, Any],
        requesting_user_id: UUID
    ) -> List[UserResponse]:
        base_query = (
            select(User)
            .options(selectinload(User.organization))
            .options(selectinload(User.user_roles)).select_from(User)
            .where(User.is_deleted == False)
        )

        search = filters.get("search")
        if search:
            base_query = base_query.where(
                or_(
                    User.email.like(f"%{search}%"),
                    User.first_name.like(f"%{search}%"),
                    User.last_name.like(f"%{search}%"),
                    User.organization.has(Organization.name.like(f"%{search}%"))
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
                .where(Role.is_deleted == False)
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
        obj_in: UserCreate,
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
        await db.commit()
        await db.refresh(new_user)

        user_role = UserRole(user_id=new_user.id, role_id=obj_in.role_id)
        db.add(user_role)

        await self._create_audit_log(
            db, requesting_user_id, "CREATE", "USER", new_user.id,
            details=f"User {new_user.email} created by admin"
        )

        await db.commit()
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

        user = await db.execute(
            select(User).where(User.id == user_id)
        )
        user = user.scalar_one_or_none()

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
        base_query = select(Role).where(Role.is_deleted == False)

        organization_id = filters.get("organization_id")
        if organization_id:
            base_query = base_query.where(Role.organization_id == organization_id)

        skip = filters.get("skip", 0)
        limit = filters.get("limit", 100)

        result = await db.execute(base_query.offset(skip).limit(limit))

        roles = []
        for role in result.scalars().all():
            permissions_query = (
                select(Permission.id, Permission.name, Permission.action, Permission.resource)
                .join(RolePermission, RolePermission.permission_id == Permission.id)
                .where(RolePermission.role_id == role.id)
                .where(Permission.is_deleted == False)
            )
            permissions_result = await db.execute(permissions_query)
            role.permissions_count = len(permissions_result.all())

            user_count_query = (
                select(User.id)
                .join(UserRole, UserRole.role_id == role.id)
                .join(User, User.id == UserRole.user_id)
                .where(User.is_deleted == False)
            )
            user_count_result = await db.execute(user_count_query)
            role.user_count = len(user_count_result.all())

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
        await db.commit()
        await db.refresh(new_role)

        await self._create_audit_log(
            db, requesting_user_id, "CREATE", "ROLE", new_role.id,
            details=f"Role {new_role.name} created by admin"
        )

        await db.commit()
        return new_role

    async def assign_permissions_to_role(
        self,
        db: AsyncSession,
        role_id: UUID,
        permission_ids: List[UUID],
        requesting_user_id: UUID
    ) -> None:
        role = await db.execute(
            select(Role).where(Role.id == role_id, Role.is_deleted == False)
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
                select(Permission).where(Permission.id == permission_id, Permission.is_deleted == False)
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
            .where(Permission.is_deleted == False)
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
            select(Permission).where(Permission.name == obj_in["name"], Permission.is_deleted == False)
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
        await db.commit()
        await db.refresh(new_permission)

        await self._create_audit_log(
            db, requesting_user_id, "CREATE", "PERMISSION", new_permission.id,
            details=f"Permission {new_permission.name} created by admin"
        )

        await db.commit()
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
            select(Role).where(Role.id == role_id, Role.is_deleted == False)
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
    ) -> AdminDashboardStatsResponse:
        total_users = await db.execute(
            select(User).where(User.is_deleted == False)
        )
        total_organizations = await db.execute(
            select(Organization).where(Organization.is_deleted == False)
        )
        active_organizations = await db.execute(
            select(Organization).where(Organization.is_deleted == False, Organization.status == "ACTIVE")
        )
        total_roles = await db.execute(
            select(Role).where(Role.is_deleted == False)
        )
        total_permissions = await db.execute(
            select(Permission).where(Permission.is_deleted == False)
        )

        users_today = await db.execute(
            select(User).where(
                User.created_at >= dt.now() - timedelta(hours=24),
                User.is_deleted == False
            )
        )
        users_this_week = await db.execute(
            select(User).where(
                User.created_at >= dt.now() - timedelta(days=7),
                User.is_deleted == False
            )
        )

        organizations_today = await db.execute(
            select(Organization).where(
                Organization.created_at >= dt.now() - timedelta(hours=24),
                Organization.is_deleted == False
            )
        )

        return AdminDashboardStatsResponse(
            total_users=total_users.scalar_one_or_none() or 0,
            total_organizations=total_organizations.scalar_one_or_none() or 0,
            active_organizations=active_organizations.scalar_one_or_none() or 0,
            total_roles=total_roles.scalar_one_or_none() or 0,
            total_permissions=total_permissions.scalar_one_or_none() or 0,
            users_created_today=users_today.scalar_one_or_none() or 0,
            users_created_this_week=users_this_week.scalar_one_or_none() or 0,
            organizations_created_today=organizations_today.scalar_one_or_none() or 0,
            storage_used_mb=0,
            system_health_score=100
        )

    async def get_system_stats(
        self,
        db: AsyncSession,
        days: int,
        requesting_user_id: UUID
    ) -> AdminSystemStatsResponse:
        active_sessions = await db.execute(
            select(UserSession).where(UserSession.is_revoked == False)
        )

        active_jobs = await db.execute(
            select(ProcessingJob).where(ProcessingJob.status == "PROCESSING")
        )

        failed_jobs = await db.execute(
            select(ProcessingJob).where(ProcessingJob.status == "FAILED")
        )

        recent_logins = await db.execute(
            select(User, LoginHistory.created_at)
            .join(LoginHistory, User.id == LoginHistory.user_id)
            .where(LoginHistory.success == True)
            .order_by(LoginHistory.created_at.desc())
            .limit(10)
        )

        recent_failures = await db.execute(
            select(User, LoginHistory.created_at, LoginHistory.failure_reason)
            .join(LoginHistory, User.id == LoginHistory.user_id)
            .where(LoginHistory.success == False)
            .order_by(LoginHistory.created_at.desc())
            .limit(10)
        )

        from app.core.system_stats import SystemStats
        system_stats = SystemStats()

        return AdminSystemStatsResponse(
            active_sessions=len(active_sessions.all()),
            active_jobs=len(active_jobs.all()),
            processing_jobs=len(active_jobs.all()),
            failed_jobs=len(failed_jobs.all()),
            memory_usage_mb=system_stats.get_memory_usage_mb(),
            cpu_usage_percent=system_stats.get_cpu_usage_percent(),
            disk_space_used_gb=system_stats.get_disk_space_used_gb(),
            recent_logins=[{"user_id": r[0].id, "timestamp": r[1]} for r in recent_logins.all()],
            recent_failures=[{"user_id": r[0].id, "timestamp": r[1], "reason": r[2]} for r in recent_failures.all()],
            system_alerts=[]
        )

    async def get_permissions_summary(
        self,
        db: AsyncSession,
        requesting_user_id: UUID
    ) -> AdminPermissionsSummaryResponse:
        total_permissions = await db.execute(
            select(Permission).where(Permission.is_deleted == False)
        )
        global_permissions = await db.execute(
            select(Permission).where(Permission.scope_type == ScopeType.GLOBAL, Permission.is_deleted == False)
        )
        organization_permissions = await db.execute(
            select(Permission).where(Permission.scope_type == ScopeType.ORGANIZATION, Permission.is_deleted == False)
        )
        factory_permissions = await db.execute(
            select(Permission).where(Permission.scope_type == ScopeType.FACTORY, Permission.is_deleted == False)
        )
        department_permissions = await db.execute(
            select(Permission).where(Permission.scope_type == ScopeType.DEPARTMENT, Permission.is_deleted == False)
        )

        return AdminPermissionsSummaryResponse(
            total_permissions=len(total_permissions.all()),
            global_permissions=len(global_permissions.all()),
            organization_permissions=len(organization_permissions.all()),
            factory_permissions=len(factory_permissions.all()),
            department_permissions=len(department_permissions.all()),
            permission_groups=[],
            recently_added_permissions=[]
        )

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
            "app_name": settings.APP_NAME,
            "version": settings.VERSION,
            "maintenance_mode": settings.MAINTENANCE_MODE,
            "max_file_size_mb": settings.MAX_FILE_SIZE_MB,
            "allowed_file_types": settings.ALLOWED_FILE_TYPES,
            "rate_limit_per_minute": settings.RATE_LIMIT_PER_MINUTE,
            "cors_origins": settings.CORS_ORIGINS,
            "privacy_policy_version": settings.PRIVACY_POLICY_VERSION,
            "terms_version": settings.TERMS_VERSION,
            "enable_email_verification": settings.ENABLE_EMAIL_VERIFICATION,
            "enable_sso": settings.ENABLE_SSO,
            "enable_audit_log": settings.ENABLE_AUDIT_LOG,
            "audit_log_retention_days": settings.AUDIT_LOG_RETENTION_DAYS,
            "enable_2fa": settings.ENABLE_2FA,
            "enable_password_history": settings.ENABLE_PASSWORD_HISTORY,
            "password_history_count": settings.PASSWORD_HISTORY_COUNT,
            "session_timeout_minutes": settings.SESSION_TIMEOUT_MINUTES,
            "max_login_attempts": settings.MAX_LOGIN_ATTEMPTS,
            "unlock_time_minutes": settings.UNLOCK_TIME_MINUTES,
            "password_min_length": settings.PASSWORD_MIN_LENGTH,
            "require_mixed_case": settings.REQUIRE_MIXED_CASE,
            "require_numbers": settings.REQUIRE_NUMBERS,
            "require_special_chars": settings.REQUIRE_SPECIAL_CHARS,
            "password_expiry_days": settings.PASSWORD_EXPIRY_DAYS,
            "max_file_size_mb": settings.MAX_FILE_SIZE_MB,
            "allowed_file_types": settings.ALLOWED_FILE_TYPES,
            "enable_file_validation": settings.ENABLE_FILE_VALIDATION,
            "enable_versioning": settings.ENABLE_VERSIONING,
            "ocr_languages": settings.OCR_LANGUAGES,
            "extraction_engine": settings.EXTRACTION_ENGINE,
            "enable_auto_indexing": settings.ENABLE_AUTO_INDEXING,
            "search_results_limit": settings.SEARCH_RESULTS_LIMIT,
            "cache_duration_seconds": settings.CACHE_DURATION_SECONDS,
            "enable_api_caching": settings.ENABLE_API_CACHING,
            "enable_metrics": settings.ENABLE_METRICS,
            "metrics_port": settings.METRICS_PORT,
            "enable_health_checks": settings.ENABLE_HEALTH_CHECKS,
            "health_check_interval_seconds": settings.HEALTH_CHECK_INTERVAL_SECONDS,
            "log_level": settings.LOG_LEVEL,
            "log_file_path": settings.LOG_FILE_PATH,
            "max_log_size_mb": settings.MAX_LOG_SIZE_MB,
            "backup_enabled": settings.BACKUP_ENABLED,
            "backup_interval_hours": settings.BACKUP_INTERVAL_HOURS,
            "backup_retention_days": settings.BACKUP_RETENTION_DAYS,
            "backup_s3_bucket": settings.BACKUP_S3_BUCKET,
            "backup_s3_region": settings.BACKUP_S3_REGION,
            "enable_email_notifications": settings.ENABLE_EMAIL_NOTIFICATIONS,
            "email_sender_address": settings.EMAIL_SENDER_ADDRESS,
            "email_sender_name": settings.EMAIL_SENDER_NAME,
            "enable_password_reset": settings.ENABLE_PASSWORD_RESET,
            "password_reset_expiry_hours": settings.PASSWORD_RESET_EXPIRY_HOURS,
            "enable_email_verification": settings.ENABLE_EMAIL_VERIFICATION,
            "email_verification_expiry_hours": settings.EMAIL_VERIFICATION_EXPIRY_HOURS,
        }

    async def update_system_settings(
        self,
        db: AsyncSession,
        obj_in: Dict[str, Any],
        user_id: UUID
    ) -> Dict[str, Any]:
        from app.core.config import settings
        updated_settings = {}

        for key, value in obj_in.items():
            if hasattr(settings, key):
                setattr(settings, key, value)
                updated_settings[key] = value

        await self._create_audit_log(
            db, user_id, "UPDATE", "SYSTEM", None,
            details=f"System settings updated by admin"
        )

        return updated_settings

    async def reset_user_password(
        self,
        db: AsyncSession,
        user_id: UUID,
        new_password_hash: str,
        requesting_user_id: UUID
    ) -> None:
        user = await db.execute(
            select(User).where(User.id == user_id, User.is_deleted == False)
        )
        user = user.scalar_one_or_none()
        if not user:
            raise NotFoundException(message="User not found")

        user.password_hash = new_password_hash

        await self._create_audit_log(
            db, requesting_user_id, "UPDATE", "USER", user_id,
            details=f"User password reset by admin"
        )

        await db.commit()

    async def unlock_user_account(
        self,
        db: AsyncSession,
        user_id: UUID,
        requesting_user_id: UUID
    ) -> None:
        await db.execute(
            Redis.flushdb()
        )

        await self._create_audit_log(
            db, requesting_user_id, "UPDATE", "USER", user_id,
            details=f"User account unlocked by admin"
        )

        await db.commit()

    async def get_dashboard_activities(
        self,
        db: AsyncSession,
        hours: int,
        requesting_user_id: UUID
    ) -> List[AuditLog]:
        from datetime import timedelta

        cutoff = dt.now() - timedelta(hours=hours)

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
    ) -> List[RoleSummaryResponse]:
        result = await db.execute(
            select(Role)
            .where(Role.is_deleted == False)
        )

        roles_summary = []
        for role in result.scalars().all():
            permissions_count = await db.execute(
                select(RolePermission).where(RolePermission.role_id == role.id)
            )
            users_count = await db.execute(
                select(UserRole).where(UserRole.role_id == role.id)
                .join(User, User.id == UserRole.user_id)
                .where(User.is_deleted == False)
            )

            role_summary = RoleSummaryResponse(
                role_id=role.id,
                name=role.name,
                description=role.description,
                permission_count=len(permissions_count.scalars().all()),
                user_count=len(users_count.scalars().all()),
                organization_id=role.organization_id,
                is_global=role.organization_id is None
            )
            roles_summary.append(role_summary)

        return roles_summary

    async def get_organizations_summary(
        self,
        db: AsyncSession,
        requesting_user_id: UUID
    ) -> List[AdminOrganizationSummaryResponse]:
        result = await db.execute(
            select(Organization)
            .where(Organization.is_deleted == False)
        )

        org_summary_list = []
        for org in result.scalars().all():
            users_count = await db.execute(
                select(User).where(User.organization_id == org.id, User.is_deleted == False)
            )
            factories_count = await db.execute(
                select(Factory).where(Factory.organization_id == org.id, Factory.is_deleted == False)
            )
            departments_count = await db.execute(
                select(Department).where(Department.organization_id == org.id, Department.is_deleted == False)
            )

            total_storage_mb = await db.execute(
                select(func.sum(Document.size))
                .join(User, User.organization_id == org.id)
                .join(Document, Document.organization_id == org.id)
            )

            org_summary = AdminOrganizationSummaryResponse(
                organization_id=org.id,
                name=org.name,
                status=org.status.value if hasattr(org.status, 'value') else org.status,
                user_count=len(users_count.scalars().all()),
                factory_count=len(factories_count.scalars().all()),
                department_count=len(departments_count.scalars().all()),
                created_at=org.created_at,
                storage_used_mb=(total_storage_mb.scalar() or 0) / (1024 * 1024)
            )
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
        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            metadata={"details": details} if details else None,
            ip_address=ip_address,
            user_agent=user_agent
        )
        db.add(audit_log)
        await db.commit()
