from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class TokenPayload(BaseModel):
    """Structured representation of the JWT payload."""
    sub: str              # Subject (User ID)
    jti: str              # JWT ID (Unique Token Identifier)
    type: str             # Token type (access or refresh)
    exp: datetime         # Expiration time
    iat: datetime         # Issued at time
    
    # Custom Claims
    org_id: Optional[str] = None
    roles: List[str] = []
    permissions: List[str] = []

    model_config = ConfigDict(from_attributes=True)
