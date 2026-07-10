from typing import Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import IndustrySector, OperationalStatus, FactorySize, OperationalCriticality, ProductionType

class FactorySettings(BaseModel):
    ai_settings: Optional[Dict[str, Any]] = None
    notification_settings: Optional[Dict[str, Any]] = None
    safety_settings: Optional[Dict[str, Any]] = None
    operational_settings: Optional[Dict[str, Any]] = None

class FactoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    factory_code: Optional[str] = Field(None, max_length=50)
    industry_sector: Optional[IndustrySector] = None
    factory_type: Optional[str] = Field(None, max_length=100)
    production_type: Optional[ProductionType] = None
    factory_size: Optional[FactorySize] = None
    operational_criticality: Optional[OperationalCriticality] = None
    operating_hours: Optional[str] = Field(None, max_length=100)
    number_of_employees: Optional[int] = None
    production_capacity: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    country: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = Field(None, max_length=255)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = Field(None, max_length=1000)
    timezone: str = "UTC"
    operational_status: OperationalStatus = OperationalStatus.ACTIVE

class FactoryCreate(FactoryBase):
    organization_id: UUID

class FactoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    factory_code: Optional[str] = Field(None, max_length=50)
    industry_sector: Optional[IndustrySector] = None
    factory_type: Optional[str] = Field(None, max_length=100)
    production_type: Optional[ProductionType] = None
    factory_size: Optional[FactorySize] = None
    operational_criticality: Optional[OperationalCriticality] = None
    operating_hours: Optional[str] = Field(None, max_length=100)
    number_of_employees: Optional[int] = None
    production_capacity: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    country: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = Field(None, max_length=255)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = Field(None, max_length=1000)
    timezone: Optional[str] = None
    operational_status: Optional[OperationalStatus] = None
    settings: Optional[Dict[str, Any]] = None

class FactorySettingsUpdate(BaseModel):
    settings: FactorySettings

class FactoryResponse(FactoryBase):
    id: UUID
    organization_id: UUID
    settings: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
