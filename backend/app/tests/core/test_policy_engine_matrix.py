import pytest
from app.core.policy import PolicyEngine
from app.models.enums import ScopeType

def test_maintenance_engineer_matrix():
    # Scenario:
    # User: Maintenance Engineer
    # Permission: machine.update
    # Scope: Factory A

    factory_a_id = "factory-a-uuid"
    factory_b_id = "factory-b-uuid"
    
    global_perms = set()
    scoped_perms = {
        ScopeType.FACTORY: {
            factory_a_id: {"machine.update", "machine.read"}
        }
    }

    # Request 1: Update Factory A machine -> Expected: ALLOW
    allowed = PolicyEngine.evaluate(["machine.update"], global_perms, scoped_perms, ScopeType.FACTORY, factory_a_id)
    assert allowed == True

    # Request 2: Update Factory B machine -> Expected: DENY
    allowed = PolicyEngine.evaluate(["machine.update"], global_perms, scoped_perms, ScopeType.FACTORY, factory_b_id)
    assert allowed == False

def test_admin_global_override():
    # User: Global Admin
    # Permission: machine.update (global)
    global_perms = {"machine.update", "machine.read", "machine.delete"}
    scoped_perms = {}

    factory_b_id = "factory-b-uuid"

    # Request: Update Factory B machine (no explicit scope map) -> Expected: ALLOW
    allowed = PolicyEngine.evaluate(["machine.update"], global_perms, scoped_perms, ScopeType.FACTORY, factory_b_id)
    assert allowed == True

def test_missing_resource_scope_fallback():
    # If the user has permission on Factory A, but the route requires GLOBAL scope, it should deny.
    global_perms = set()
    scoped_perms = {
        ScopeType.FACTORY: {
            "factory-a-uuid": {"factory.delete"}
        }
    }

    # Trying to run a global delete
    allowed = PolicyEngine.evaluate(["factory.delete"], global_perms, scoped_perms, ScopeType.GLOBAL, None)
    assert allowed == False
