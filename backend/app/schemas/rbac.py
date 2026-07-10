from typing import Optional, List
from uuid import UUID
from pydantic import ConfigDict, Field

from app.schemas.base import BaseSchema

# --- Permissions ---

class PermissionBase(BaseSchema):
    action: str = Field(..., description="Action e.g., read, write, manage")
    resource: str = Field(..., description="Resource e.g., machine, document, factory")
    description: Optional[str] = None

class PermissionCreate(PermissionBase):
    pass

class PermissionUpdate(BaseSchema):
    description: Optional[str] = None

class PermissionResponse(PermissionBase):
    id: UUID
    
    model_config = ConfigDict(from_attributes=True)

# --- Roles ---

class RoleBase(BaseSchema):
    name: str = Field(..., description="Role Name")
    description: Optional[str] = None
    organization_id: Optional[UUID] = None  # Null for global roles

class RoleCreate(RoleBase):
    pass

class RoleUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None

class RoleResponse(RoleBase):
    id: UUID
    
    model_config = ConfigDict(from_attributes=True)

# --- Assignments ---

class AssignRoleRequest(BaseSchema):
    role_id: UUID

class AssignPermissionRequest(BaseSchema):
    permission_ids: List[UUID]

class PermissionCheckRequest(BaseSchema):
    action: str
    resource: str
