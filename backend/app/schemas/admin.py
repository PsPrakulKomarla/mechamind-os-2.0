from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime

from app.schemas.base import BaseSchema

# --- Admin Dashboard ---

class AdminDashboardStatsResponse(BaseSchema):
    total_users: int
    total_organizations: int
    active_organizations: int
    total_roles: int
    total_permissions: int
    users_created_today: int
    users_created_this_week: int
    organizations_created_today: int
    storage_used_mb: float
    system_health_score: int

# --- Audit Log ---

class AuditLogResponse(BaseSchema):
    id: UUID
    organization_id: Optional[UUID]
    factory_id: Optional[UUID]
    department_id: Optional[UUID]
    user_id: Optional[UUID]
    action: str
    entity_type: str
    entity_id: Optional[UUID]
    metadata: Optional[Dict[str, Any]]
    ip_address: Optional[str]
    user_agent: Optional[str]
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- System Settings ---

class SystemSettingsBase(BaseSchema):
    setting_key: str
    setting_value: str
    description: Optional[str] = None
    is_sensitive: bool = False
    category: str

class SystemSettingsCreate(SystemSettingsBase):
    pass

class SystemSettingsUpdate(SystemSettingsBase):
    pass

class SystemSettingsResponse(SystemSettingsBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class AdminSettingsResponse(BaseSchema):
    # For admin dashboard settings view
    name: str
    value: Optional[str] = None
    type: str
    description: Optional[str] = None
    sensitive: bool = False
    editable: bool = True

# --- Role Summary ---

class RoleSummaryResponse(BaseSchema):
    role_id: UUID
    name: str
    description: Optional[str] = None
    permission_count: int
    user_count: int
    organization_id: Optional[UUID]
    is_global: bool

# --- Organization Summary ---

class OrganizationSummaryResponse(BaseSchema):
    organization_id: UUID
    name: str
    status: str
    user_count: int
    factory_count: int
    department_count: int
    created_at: datetime
    storage_used_mb: float

# --- Permissions Summary ---

class AdminPermissionsSummaryResponse(BaseSchema):
    total_permissions: int
    global_permissions: int
    organization_permissions: int
    factory_permissions: int
    department_permissions: int
    permission_groups: List[Dict[str, Any]]
    recently_added_permissions: List[Dict[str, Any]]

# --- Additional Required Schemas ---

from app.schemas.rbac import PermissionCreate as PermissionCreateBase

# System Stats

from typing import Dict, List

class AdminSystemStatsResponse(BaseSchema):
    active_sessions: int
    active_jobs: int
    processing_jobs: int
    failed_jobs: int
    memory_usage_mb: float
    cpu_usage_percent: float
    disk_space_used_gb: float
    recent_logins: List[Dict[str, Any]]
    recent_failures: List[Dict[str, Any]]
    system_alerts: List[Dict[str, Any]]

# Additional Data Classes for Admin API

class SystemSettingsResponse(BaseSchema):
    setting_key: str
    setting_value: str
    description: Optional[str] = None
    is_sensitive: bool = False
    category: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PermissionResponse(BaseSchema):
    id: UUID
    name: str
    action: str
    resource: str
    description: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class UserResponse(BaseSchema):
    id: UUID
    organization_id: UUID
    email: str
    first_name: str
    last_name: str
    status: str
    is_deleted: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class RoleResponse(BaseSchema):
    id: UUID
    name: str
    description: Optional[str] = None
    organization_id: Optional[UUID] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class AuditLogResponse(BaseSchema):
    id: UUID
    organization_id: Optional[UUID]
    factory_id: Optional[UUID]
    department_id: Optional[UUID]
    user_id: Optional[UUID]
    action: str
    entity_type: str
    entity_id: Optional[UUID]
    metadata: Optional[Dict[str, Any]]
    ip_address: Optional[str]
    user_agent: Optional[str]
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseSchema):
    email: str
    first_name: str
    last_name: str
    organization_id: UUID
    role_id: UUID

class UserUpdate(BaseSchema):
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    status: Optional[str] = None

# Re-export required types from other schemas

from app.schemas.rbac import RoleCreate as RoleCreate
from app.schemas.rbac import RoleUpdate as RoleUpdate
from app.schemas.rbac import AssignPermissionRequest as AssignPermissionRequest
from app.schemas.rbac import AssignRoleRequest as AssignRoleRequest
from app.schemas.rbac import PermissionCheckRequest as PermissionCheckRequest