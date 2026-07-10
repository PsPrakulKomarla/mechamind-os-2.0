# Scoped RBAC Integration

## Overview
MechaMind OS merges standard RBAC with multi-tenant physical boundaries using Scoped Mapping Tables.

## How it works in FastAPI
We built the `RequirePermissions` dependency to dynamically intercept routes:

```python
@router.get("/{factory_id}", dependencies=[
    Depends(RequirePermissions(["machine.read"], ScopeType.FACTORY, "factory_id"))
])
```
1. It extracts `factory_id` from the URL string.
2. It requests the `AuthorizationService` to check if the user holds `machine.read` explicitly mapped against that `factory_id` in the `user_factory_roles` table.

## The Benefit
Security is bulletproof and automated. A developer creating the `Machines` API in Phase 9 only needs to append the `RequirePermissions` dependency to the route signature, and cross-factory isolation is mathematically guaranteed by the framework.
