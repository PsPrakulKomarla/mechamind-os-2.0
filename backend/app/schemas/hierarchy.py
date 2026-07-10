from typing import Optional, List
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import IndustrySector, OperationalStatus, CompanySize

class FactoryBase(BaseModel):
    name: str
    factory_code: Optional[str] = None
    industry_sector: Optional[IndustrySector] = None
    factory_type: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None
    timezone: str = "UTC"
    operational_status: OperationalStatus = OperationalStatus.ACTIVE

class FactoryCreate(FactoryBase):
    organization_id: UUID

class FactoryUpdate(BaseModel):
    name: Optional[str] = None
    factory_code: Optional[str] = None
    industry_sector: Optional[IndustrySector] = None
    factory_type: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None
    timezone: Optional[str] = None
    operational_status: Optional[OperationalStatus] = None

class FactoryResponse(FactoryBase):
    id: UUID
    organization_id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    manager_id: Optional[UUID] = None
    status: OperationalStatus = OperationalStatus.ACTIVE

class DepartmentCreate(DepartmentBase):
    factory_id: UUID

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    manager_id: Optional[UUID] = None
    status: Optional[OperationalStatus] = None

class DepartmentResponse(DepartmentBase):
    id: UUID
    factory_id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None
    team_lead_id: Optional[UUID] = None
    status: OperationalStatus = OperationalStatus.ACTIVE

class TeamCreate(TeamBase):
    department_id: UUID

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    team_lead_id: Optional[UUID] = None
    status: Optional[OperationalStatus] = None

class TeamResponse(TeamBase):
    id: UUID
    department_id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
