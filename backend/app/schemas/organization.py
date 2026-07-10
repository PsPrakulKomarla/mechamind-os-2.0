from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import CompanySize, OrganizationStatus

class OrganizationBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    domain: Optional[str] = Field(None, max_length=255)
    industry_type: Optional[str] = Field(None, max_length=255)
    company_size: Optional[CompanySize] = None
    description: Optional[str] = Field(None, max_length=1000)
    logo: Optional[str] = Field(None, max_length=255)
    country: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = Field(None, max_length=255)
    contact_information: Optional[str] = Field(None, max_length=255)
    status: OrganizationStatus = OrganizationStatus.ACTIVE

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    domain: Optional[str] = Field(None, max_length=255)
    industry_type: Optional[str] = Field(None, max_length=255)
    company_size: Optional[CompanySize] = None
    description: Optional[str] = Field(None, max_length=1000)
    logo: Optional[str] = Field(None, max_length=255)
    status: Optional[OrganizationStatus] = None

class OrganizationSettingsUpdate(BaseModel):
    country: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = Field(None, max_length=255)
    contact_information: Optional[str] = Field(None, max_length=255)

class OrganizationResponse(OrganizationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
