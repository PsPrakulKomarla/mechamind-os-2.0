from typing import List, Dict, Set, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, union_all

from app.models.enums import ScopeType
from app.models.user_role import UserRole
from app.models.user_org_role import UserOrganizationRole
from app.models.user_factory_role import UserFactoryRole
from app.models.user_dept_role import UserDepartmentRole
from app.models.role_permission import RolePermission
from app.models.permission import Permission
from app.core.policy import PolicyEngine
from app.core.exceptions import UnauthorizedException

class AuthorizationService:
    @staticmethod
    async def get_role_permissions(db: AsyncSession, role_id: UUID) -> Set[str]:
        """Get permissions for a single role (used in scoped lookups)."""
        query = (
            select(Permission.name)
            .join(RolePermission, Permission.id == RolePermission.permission_id)
            .where(RolePermission.role_id == role_id)
        )
        result = await db.execute(query)
        return set(result.scalars().all())

    @staticmethod
    async def get_all_user_permissions(db: AsyncSession, user_id: UUID) -> Set[str]:
        """Get ALL permissions for a user across all roles in a single query (N+1 optimized)."""
        query = (
            select(Permission.name)
            .join(RolePermission, Permission.id == RolePermission.permission_id)
            .join(UserRole, UserRole.role_id == RolePermission.role_id)
            .where(UserRole.user_id == user_id)
            .distinct()
        )
        result = await db.execute(query)
        return set(result.scalars().all())

    @staticmethod
    async def get_user_global_permissions(db: AsyncSession, user_id: UUID) -> Set[str]:
        """Alias for backward compatibility."""
        return await AuthorizationService.get_all_user_permissions(db, user_id)

    @staticmethod
    async def get_user_scoped_permissions(db: AsyncSession, user_id: UUID) -> Dict[ScopeType, Dict[str, Set[str]]]:
        """
        Returns a map: ScopeType -> { target_id_string -> set of permissions }
        """
        scoped_perms: Dict[ScopeType, Dict[str, Set[str]]] = {
            ScopeType.ORGANIZATION: {},
            ScopeType.FACTORY: {},
            ScopeType.DEPARTMENT: {}
        }

        # Organizations
        org_query = (
            select(UserOrganizationRole.organization_id, UserOrganizationRole.role_id)
            .where(UserOrganizationRole.user_id == user_id)
        )
        org_result = await db.execute(org_query)
        for org_id, role_id in org_result.all():
            perms = await AuthorizationService.get_role_permissions(db, role_id)
            org_id_str = str(org_id)
            if org_id_str not in scoped_perms[ScopeType.ORGANIZATION]:
                scoped_perms[ScopeType.ORGANIZATION][org_id_str] = set()
            scoped_perms[ScopeType.ORGANIZATION][org_id_str].update(perms)

        # Factories
        fac_query = (
            select(UserFactoryRole.factory_id, UserFactoryRole.role_id)
            .where(UserFactoryRole.user_id == user_id)
        )
        fac_result = await db.execute(fac_query)
        for fac_id, role_id in fac_result.all():
            perms = await AuthorizationService.get_role_permissions(db, role_id)
            fac_id_str = str(fac_id)
            if fac_id_str not in scoped_perms[ScopeType.FACTORY]:
                scoped_perms[ScopeType.FACTORY][fac_id_str] = set()
            scoped_perms[ScopeType.FACTORY][fac_id_str].update(perms)

        # Departments
        dept_query = (
            select(UserDepartmentRole.department_id, UserDepartmentRole.role_id)
            .where(UserDepartmentRole.user_id == user_id)
        )
        dept_result = await db.execute(dept_query)
        for dept_id, role_id in dept_result.all():
            perms = await AuthorizationService.get_role_permissions(db, role_id)
            dept_id_str = str(dept_id)
            if dept_id_str not in scoped_perms[ScopeType.DEPARTMENT]:
                scoped_perms[ScopeType.DEPARTMENT][dept_id_str] = set()
            scoped_perms[ScopeType.DEPARTMENT][dept_id_str].update(perms)

        return scoped_perms

    @staticmethod
    async def authorize(
        db: AsyncSession, 
        user_id: UUID, 
        required_permissions: List[str], 
        target_scope_type: ScopeType = ScopeType.GLOBAL, 
        target_scope_id: Optional[str] = None
    ) -> None:
        
        # Load Global Perms (single query, no N+1)
        global_perms = await AuthorizationService.get_all_user_permissions(db, user_id)
        
        # Load Scoped Perms
        scoped_perms = await AuthorizationService.get_user_scoped_permissions(db, user_id)
        
        # Evaluate Policy
        allowed = PolicyEngine.evaluate(
            required_permissions=required_permissions,
            user_global_permissions=global_perms,
            user_scoped_permissions=scoped_perms,
            target_scope_type=target_scope_type,
            target_scope_id=target_scope_id
        )
        
        if not allowed:
            raise UnauthorizedException(
                f"Insufficient permissions. Required: {required_permissions} at scope {target_scope_type.value}"
            )
