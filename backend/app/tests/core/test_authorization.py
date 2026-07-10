import pytest
from app.core.policy import PolicyEngine
from app.models.enums import ScopeType

def test_policy_engine_global_access():
    global_perms = {"machine.read"}
    scoped_perms = {}
    
    # 1. Action requires "machine.read" globally
    allowed = PolicyEngine.evaluate(["machine.read"], global_perms, scoped_perms, ScopeType.GLOBAL, None)
    assert allowed == True
    
    # 2. Action requires "machine.read" at FACTORY level, but user has it globally
    allowed = PolicyEngine.evaluate(["machine.read"], global_perms, scoped_perms, ScopeType.FACTORY, "factory-uuid-123")
    assert allowed == True

def test_policy_engine_scoped_access():
    global_perms = set()
    scoped_perms = {
        ScopeType.FACTORY: {
            "factory-A": {"maintenance.create", "maintenance.read"},
            "factory-B": {"maintenance.read"}
        }
    }
    
    # User tries to create maintenance in Factory A
    allowed = PolicyEngine.evaluate(["maintenance.create"], global_perms, scoped_perms, ScopeType.FACTORY, "factory-A")
    assert allowed == True
    
    # User tries to create maintenance in Factory B (Only has read)
    allowed = PolicyEngine.evaluate(["maintenance.create"], global_perms, scoped_perms, ScopeType.FACTORY, "factory-B")
    assert allowed == False
    
    # User tries to read maintenance in Factory B
    allowed = PolicyEngine.evaluate(["maintenance.read"], global_perms, scoped_perms, ScopeType.FACTORY, "factory-B")
    assert allowed == True
    
    # User tries to access Factory C (Not assigned)
    allowed = PolicyEngine.evaluate(["maintenance.read"], global_perms, scoped_perms, ScopeType.FACTORY, "factory-C")
    assert allowed == False

def test_policy_engine_default_deny():
    allowed = PolicyEngine.evaluate(["critical.action"], set(), {}, ScopeType.GLOBAL, None)
    assert allowed == False
