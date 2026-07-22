from typing import Optional, List
from pydantic import EmailStr, ConfigDict, Field
from uuid import UUID

from app.schemas.base import BaseSchema
from app.models.enums import UserStatus

# Shared properties
class UserBase(BaseSchema):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    status: Optional[UserStatus] = None

# Properties to receive via API on creation
class UserCreate(BaseSchema):
    email: EmailStr
    first_name: str
    last_name: str
    organization_id: UUID


# Properties for admin user creation (includes password)
class AdminUserCreate(BaseSchema):
    email: EmailStr
    first_name: str
    last_name: str
    organization_id: UUID
    password: str

# Properties to receive via API on update
class UserUpdate(UserBase):
    pass

# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    id: UUID
    organization_id: UUID
    auth_id: Optional[UUID] = None
    email: EmailStr
    first_name: str
    last_name: str
    status: UserStatus
    is_deleted: bool

    model_config = ConfigDict(from_attributes=True)

# Properties to return to client
class UserResponse(UserInDBBase):
    roles: Optional[List[str]] = None
    organization_name: Optional[str] = None
