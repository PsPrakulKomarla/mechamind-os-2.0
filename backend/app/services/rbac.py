from typing import List, Set
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import UnauthorizedException
from app.repositories.permission import user_role_repo, role_permission_repo
from app.core.redis_rbac import redis_rbac

class RBACService:
    async def get_user_permissions(self, db: AsyncSession, user_id: UUID) -> List[str]:
        """
        Gets all permission strings (e.g. 'machine.read') for a given user.
        Uses Redis caching to avoid DB bottleneck.
        """
        # 1. Check Cache
        cached_perms = await redis_rbac.get_user_permissions(str(user_id))
        if cached_perms is not None:
            return cached_perms
            
        # 2. Fetch from DB if not cached
        user_roles = await user_role_repo.get_roles_for_user(db, user_id=user_id)
        
        perm_strings: Set[str] = set()
        
        for ur in user_roles:
            permissions = await role_permission_repo.get_permissions_for_role(db, role_id=ur.role_id)
            for p in permissions:
                perm_strings.add(f"{p.resource}.{p.action}")
                
        perm_list = list(perm_strings)
        
        # 3. Cache the result
        await redis_rbac.cache_user_permissions(str(user_id), perm_list)
        
        return perm_list

    async def check_access(self, db: AsyncSession, user_id: UUID, required_permissions: List[str]) -> bool:
        """
        Checks if the user has ALL of the required permissions.
        Supports wildcard scopes in the future (e.g., 'machine.*').
        """
        user_perms = await self.get_user_permissions(db, user_id)
        
        # Super Admin override check
        if "*.*" in user_perms:
            return True
            
        for required in required_permissions:
            if required not in user_perms:
                # Also check if they have a wildcard for the resource (e.g., resource.*)
                resource = required.split(".")[0]
                if f"{resource}.*" not in user_perms:
                    return False
                    
        return True

    async def require_permissions(self, db: AsyncSession, user_id: UUID, required_permissions: List[str]) -> None:
        """Throws UnauthorizedException if access is denied. Used by Dependency injection."""
        has_access = await self.check_access(db, user_id, required_permissions)
        if not has_access:
            raise UnauthorizedException(f"Insufficient permissions. Required: {', '.join(required_permissions)}")

rbac_service = RBACService()
