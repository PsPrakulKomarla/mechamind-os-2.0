from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., example="admin@gmail.com")
    password: str = Field(..., example="qwertyuiop")

class RegisterRequest(BaseModel):
    email: EmailStr = Field(..., example="user@company.com")
    password: str = Field(..., example="securePassword123")
    first_name: str = Field(..., example="John")
    last_name: str = Field(..., example="Doe")
    organization_name: Optional[str] = Field(None, example="Acme Corp")

class TokenData(BaseModel):
    sub: str = Field(..., example="550e8400-e29b-41d4-a716-446655440000")
    exp: datetime
    type: str = Field(..., example="access")

class Tokens(BaseModel):
    access_token: str = Field(..., example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    refresh_token: str = Field(..., example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    token_type: str = Field(default="bearer", example="bearer")

class PasswordResetRequest(BaseModel):
    email: EmailStr = Field(..., example="user@company.com")

class PasswordResetConfirm(BaseModel):
    token: str = Field(..., example="reset_token_here")
    new_password: str = Field(..., example="newSecurePassword123")

class EmailVerificationConfirm(BaseModel):
    token: str = Field(..., example="verification_token_here")
