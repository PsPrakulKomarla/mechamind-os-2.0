from fastapi import APIRouter
from app.api.v1 import (
    health, auth, users, roles, permissions, organizations, factories, departments, teams, machines,
    subsystems, components, parts, relationships, risk, asset_health, documents, extraction, entities, knowledge, copilot, learning, maintenance, failures, compliance, safety
)

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["system"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
api_router.include_router(factories.router, prefix="/factories", tags=["factories"])
api_router.include_router(departments.router, prefix="/departments", tags=["departments"])
api_router.include_router(teams.router, prefix="/teams", tags=["teams"])
api_router.include_router(machines.router, prefix="/machines", tags=["machines"])
api_router.include_router(subsystems.router, prefix="/subsystems", tags=["subsystems"])
api_router.include_router(components.router, prefix="/components", tags=["components"])
api_router.include_router(parts.router, prefix="/parts", tags=["parts"])
api_router.include_router(relationships.router, prefix="/relationships", tags=["relationships"])
api_router.include_router(risk.router, prefix="/risk", tags=["asset-risk"])
api_router.include_router(asset_health.router, prefix="/asset-health", tags=["asset-health"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(extraction.router, prefix="/extraction", tags=["extraction"])
api_router.include_router(entities.router, prefix="/entities", tags=["entities"])
api_router.include_router(knowledge.router, prefix="/knowledge", tags=["knowledge"])
api_router.include_router(copilot.router, prefix="/copilot", tags=["copilot"])
api_router.include_router(learning.router, prefix="/learning", tags=["learning"])
api_router.include_router(maintenance.router, prefix="/maintenance", tags=["maintenance"])
api_router.include_router(failures.router, prefix="/failures", tags=["failures"])
api_router.include_router(compliance.router, prefix="/compliance", tags=["compliance"])
api_router.include_router(safety.router, prefix="/safety", tags=["safety"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(roles.router, prefix="/roles", tags=["roles"])
api_router.include_router(permissions.router, prefix="/permissions", tags=["permissions"])
