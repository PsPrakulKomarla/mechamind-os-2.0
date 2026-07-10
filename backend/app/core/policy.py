from typing import List, Dict, Set, Optional
from app.models.enums import ScopeType

class PolicyEngine:
    """
    Core Policy Evaluation Engine.
    Determines if a resolved set of permissions and scopes permits a specific action.
    """
    
    @staticmethod
    def evaluate(
        required_permissions: List[str],
        user_global_permissions: Set[str],
        user_scoped_permissions: Dict[ScopeType, Dict[str, Set[str]]],
        target_scope_type: ScopeType,
        target_scope_id: Optional[str]
    ) -> bool:
        """
        Evaluate if the user has ALL required_permissions in the given target scope.
        - `user_global_permissions`: Set of permissions the user holds globally.
        - `user_scoped_permissions`: Map of ScopeType -> { target_id -> Set[permissions] }
        - `target_scope_type`: The level at which this action is being performed (e.g., FACTORY).
        - `target_scope_id`: The ID of the specific target (e.g., the factory UUID).
        """
        if not required_permissions:
            return True # No permissions required means allowed
            
        for req_perm in required_permissions:
            if not PolicyEngine._has_permission(
                req_perm, 
                user_global_permissions, 
                user_scoped_permissions, 
                target_scope_type, 
                target_scope_id
            ):
                return False
        return True
        
    @staticmethod
    def _has_permission(
        req_perm: str,
        user_global_permissions: Set[str],
        user_scoped_permissions: Dict[ScopeType, Dict[str, Set[str]]],
        target_scope_type: ScopeType,
        target_scope_id: Optional[str]
    ) -> bool:
        # 1. Global overrides everything (SuperAdmin)
        if req_perm in user_global_permissions:
            return True
            
        # If the requirement is global but user doesn't have it globally, DENY
        if target_scope_type == ScopeType.GLOBAL:
            return False

        if not target_scope_id:
            return False

        target_scope_id_str = str(target_scope_id)
            
        # 2. Check exact scope match
        if target_scope_type in user_scoped_permissions:
            scope_map = user_scoped_permissions[target_scope_type]
            if target_scope_id_str in scope_map:
                if req_perm in scope_map[target_scope_id_str]:
                    return True
                    
        return False
