from typing import List, Callable, Optional
from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.enums import ScopeType
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.services.authorization import AuthorizationService
from app.core.exceptions import UnauthorizedException

class RequirePermissions:
    """
    Dependency factory to protect routes with specific permissions, optionally bound to a scope.
    Usage: @router.get("/{factory_id}", dependencies=[Depends(RequirePermissions(["factory.read"], ScopeType.FACTORY, "factory_id"))])
    """
    def __init__(self, required_permissions: List[str], scope_type: Optional[ScopeType] = ScopeType.GLOBAL, scope_key: Optional[str] = None):
        self.required_permissions = required_permissions
        self.scope_type = scope_type
        self.scope_key = scope_key

    async def __call__(
        self,
        request: Request,
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
    ) -> User:
        if not current_user:
            raise UnauthorizedException("Authentication required")
            
        target_scope_id = None
        if self.scope_key:
            # Extract from path parameters
            target_scope_id = request.path_params.get(self.scope_key)
            if not target_scope_id:
                # Fallback to query params or raise? In REST, standard is path.
                raise UnauthorizedException(f"Missing {self.scope_key} in request path")

        # In Phase 8.5, we route to the new AuthorizationService which incorporates Scoped Role mapping
        await AuthorizationService.authorize(
            db, 
            current_user.id, 
            self.required_permissions,
            target_scope_type=self.scope_type,
            target_scope_id=target_scope_id
        )
        
        return current_user
