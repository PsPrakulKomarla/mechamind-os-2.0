from typing import List, Callable
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.services.rbac import rbac_service
from app.core.exceptions import UnauthorizedException

class RequirePermissions:
    """
    Dependency factory to protect routes with specific permissions.
    Usage: @router.get("/machines", dependencies=[Depends(RequirePermissions(["machine.read"]))])
    """
    def __init__(self, required_permissions: List[str]):
        self.required_permissions = required_permissions

    async def __call__(
        self,
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
    ) -> User:
        # Deny by default if no user
        if not current_user:
            raise UnauthorizedException("Authentication required")
            
        # Check permissions using RBAC service
        await rbac_service.require_permissions(db, current_user.id, self.required_permissions)
        
        return current_user
