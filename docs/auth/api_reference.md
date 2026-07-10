# MechaMind OS 2.0 - API Reference (Authentication & RBAC)

All endpoints prefixed with `/api/v1`

## Authentication

### `POST /auth/register`
Creates a new User and seeds a default Organization.
- **Body**: `{ "email": "str", "password": "str", "first_name": "str", "last_name": "str" }`
- **Response**: `APIResponse[UserResponse]`
- **RBAC**: Public

### `POST /auth/login`
Validates credentials, checks for brute-force lockouts, and issues tokens.
- **Body**: `{ "email": "str", "password": "str" }`
- **Response**: `{ "access_token": "str", "refresh_token": "str", "token_type": "bearer" }`
- **RBAC**: Public

### `POST /auth/logout`
Revokes the current session and refresh tokens. Adds Access Token to Redis Blacklist.
- **Header**: `Authorization: Bearer <token>`
- **Response**: Success Message
- **RBAC**: Authenticated Users

### `GET /auth/me`
Retrieves the profile of the currently authenticated user.
- **Header**: `Authorization: Bearer <token>`
- **Response**: `APIResponse[UserResponse]`
- **RBAC**: Authenticated Users

---

## RBAC Management

### `POST /roles`
Create a new custom role.
- **Header**: `Authorization: Bearer <token>`
- **Body**: `{ "name": "str", "description": "str", "organization_id": "UUID (optional)" }`
- **RBAC**: Requires `role.manage` permission.

### `POST /roles/{role_id}/permissions`
Assigns a list of permissions to a specific role. Replaces existing mappings.
- **Header**: `Authorization: Bearer <token>`
- **Body**: `{ "permission_ids": ["UUID"] }`
- **RBAC**: Requires `role.manage` permission.

### `POST /permissions`
Create a new permission entity (e.g. action="read", resource="machine").
- **Header**: `Authorization: Bearer <token>`
- **Body**: `{ "action": "str", "resource": "str" }`
- **RBAC**: Requires `permission.manage` permission.

### `POST /permissions/check`
Utility endpoint for front-end UIs to verify if the active user has a specific permission.
- **Header**: `Authorization: Bearer <token>`
- **Body**: `{ "action": "str", "resource": "str" }`
- **Response**: `APIResponse[bool]` (true if permitted)
- **RBAC**: Authenticated Users

### `POST /users/{user_id}/assign`
Assigns a role to a user. Invalidates the user's Redis permission cache automatically.
- **Header**: `Authorization: Bearer <token>`
- **Body**: `{ "role_id": "UUID" }`
- **RBAC**: Requires `role.assign` permission.
