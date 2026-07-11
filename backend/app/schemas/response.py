from typing import Generic, TypeVar, Optional, List
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime, timezone

T = TypeVar("T")

def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)

class BaseSchema(BaseModel):
    """Base schema with common configurations."""
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class ResponseMeta(BaseModel):
    """Metadata for paginated responses."""
    total: int
    skip: int
    limit: int

class APIResponse(BaseModel, Generic[T]):
    """Standard success API response wrapper."""
    status: str = "success"
    message: str = "Operation completed successfully"
    data: Optional[T] = None
    timestamp: datetime = Field(default_factory=get_utc_now)
    meta: Optional[ResponseMeta] = None

class ErrorResponse(BaseModel):
    """Standard error API response wrapper."""
    error_code: str
    message: str
    details: Optional[dict] = None
    timestamp: datetime = Field(default_factory=get_utc_now)

class PaginatedData(BaseModel, Generic[T]):
    """Wrapper for paginated data returned from services."""
    items: List[T]
    total: int
