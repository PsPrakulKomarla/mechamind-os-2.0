from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime

from app.schemas.base import BaseSchema


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


class AdminAuditLogResponse(BaseSchema):
    id: UUID
    organization_id: Optional[UUID]
    user_id: Optional[UUID]
    action: str
    entity_type: str
    entity_id: Optional[UUID]
    changes: Optional[Dict[str, Any]]
    ip_address: Optional[str]
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class AdminSystemSettingsResponse(BaseSchema):
    setting_key: str
    setting_value: str
    description: Optional[str] = None
    is_sensitive: bool = False
    category: str


class AdminRoleSummaryResponse(BaseSchema):
    role_id: UUID
    name: str
    description: Optional[str] = None
    permission_count: int
    user_count: int
    organization_id: Optional[UUID]
    is_global: bool


class AdminOrganizationSummaryResponse(BaseSchema):
    organization_id: UUID
    name: str
    status: str
    user_count: int
    factory_count: int
    department_count: int
    created_at: datetime
    storage_used_mb: float


class AdminPermissionsSummaryResponse(BaseSchema):
    total_permissions: int
    global_permissions: int
    organization_permissions: int
    factory_permissions: int
    department_permissions: int
    permission_groups: List[Dict[str, Any]]
    recently_added_permissions: List[Dict[str, Any]]


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
