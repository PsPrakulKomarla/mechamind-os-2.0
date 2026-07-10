# MechaMind OS 2.0 - Authentication Developer Guide

## Architecture Overview
The authentication module in MechaMind OS 2.0 is built on **FastAPI**, **SQLAlchemy**, and **Redis**. It provides a fully stateless, JWT-based security layer enforcing Role-Based Access Control (RBAC).

### Key Components
1. **JWT Service (`app/core/jwt.py`)**: Issues and validates Access and Refresh tokens. Tokens contain rich payloads including `sub` (User ID), `org_id`, `roles`, and `permissions`.
2. **Global Auth Middleware (`app/middleware/auth.py`)**: Intercepts all incoming requests, extracts the Bearer token, validates it against Redis blacklists and signature verification, and safely attaches the decoded payload to `request.state.user_payload`.
3. **RBAC Service (`app/services/rbac.py`)**: Resolves a user's permissions by querying the DB and caching the exact permission strings (`resource.action`) into Redis.
4. **Redis Security Engine (`app/core/redis_security.py`)**: Tracks failed login attempts (Brute Force Protection) and acts as the immediate revocation blocklist for tokens (Logout).

## How to Protect an API Endpoint
To secure a new route, simply use the `RequirePermissions` dependency factory. If a user lacks the required permission, the dependency will throw a `401 Unauthorized` exception automatically.

```python
from fastapi import APIRouter, Depends
from app.dependencies.rbac import RequirePermissions

router = APIRouter()

# Example: Protecting a route
@router.get("/machines", dependencies=[Depends(RequirePermissions(["machine.read"]))])
async def list_machines():
    return {"message": "You have access to read machines!"}

# Example: Protecting a route with multiple requirements (AND logic)
@router.post("/machines", dependencies=[Depends(RequirePermissions(["machine.create", "factory.settings.manage"]))])
async def create_machine():
    return {"message": "You have high-level access!"}
```

## How to Access Current User Context
If your endpoint needs the current user's DB object (e.g., to record an audit log or associate a record), use the `get_current_user` dependency.

```python
from app.dependencies.auth import get_current_user
from app.models.user import User

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {"email": current_user.email, "org_id": current_user.organization_id}
```

## Database Relationships
- `User`: Core identity, references `Organization`.
- `Role`: A collection of permissions. Can be global (no `org_id`) or organization-specific.
- `Permission`: Defines `action` and `resource`.
- `UserRole`: Associates Users -> Roles.
- `RolePermission`: Associates Roles -> Permissions.

## Security Standards (DO NOT BYPASS)
1. **No Hardcoded Secrets**: Always use `settings.SECRET_KEY` and `settings.ENCRYPTION_KEY`.
2. **Symmetric Encryption**: Use `app.core.security.encrypt_data()` to store sensitive 3rd party API keys.
3. **Audit Logging**: Any mutation to a user, role, or permission MUST call `audit_repo.log_action()`.
