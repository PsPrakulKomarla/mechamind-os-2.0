from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import OperationalStatus, DepartmentType

class DepartmentBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    department_type: DepartmentType = DepartmentType.CUSTOM
    description: Optional[str] = Field(None, max_length=1000)
    manager_id: Optional[UUID] = None
    status: OperationalStatus = OperationalStatus.ACTIVE

class DepartmentCreate(DepartmentBase):
    factory_id: UUID

class DepartmentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    department_type: Optional[DepartmentType] = None
    description: Optional[str] = Field(None, max_length=1000)
    manager_id: Optional[UUID] = None
    status: Optional[OperationalStatus] = None

class DepartmentResponse(DepartmentBase):
    id: UUID
    factory_id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class UserAssignment(BaseModel):
    user_id: UUID
    role_id: Optional[UUID] = None  # If assigning a specific role (like UserDepartmentRole)
