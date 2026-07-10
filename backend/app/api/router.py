from fastapi import APIRouter
from app.api.v1 import health, auth, roles, permissions, organizations, factories, departments, teams

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["system"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
api_router.include_router(factories.router, prefix="/factories", tags=["factories"])
api_router.include_router(departments.router, prefix="/departments", tags=["departments"])
api_router.include_router(teams.router, prefix="/teams", tags=["teams"])
api_router.include_router(roles.router, prefix="/roles", tags=["roles"])
api_router.include_router(permissions.router, prefix="/permissions", tags=["permissions"])
