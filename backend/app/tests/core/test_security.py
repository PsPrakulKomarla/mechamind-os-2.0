import pytest
import uuid
from datetime import timedelta
import jwt

from app.core.security import (
    get_password_hash, 
    verify_password, 
    validate_password_strength,
    encrypt_data,
    decrypt_data
)
from app.core.jwt import jwt_service
from app.core.exceptions import ValidationException, UnauthorizedException

def test_password_hashing():
    password = "StrongPassword123!"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed)
    assert not verify_password("wrongpassword", hashed)

def test_password_strength():
    # Valid
    assert validate_password_strength("StrongPassword123!") == True
    
    # Invalid length
    with pytest.raises(ValidationException):
        validate_password_strength("Short1!")
        
    # No uppercase
    with pytest.raises(ValidationException):
        validate_password_strength("nouppercase123!")
        
    # No lowercase
    with pytest.raises(ValidationException):
        validate_password_strength("NOLOWERCASE123!")
        
    # No number
    with pytest.raises(ValidationException):
        validate_password_strength("NoNumberHere!")
        
    # No special char
    with pytest.raises(ValidationException):
        validate_password_strength("NoSpecialChar123")

def test_encryption_decryption():
    secret = "my_sensitive_data"
    encrypted = encrypt_data(secret)
    assert encrypted != secret
    assert decrypt_data(encrypted) == secret

    with pytest.raises(ValueError):
        decrypt_data("invalid_token")

@pytest.mark.asyncio
async def test_jwt_issuance_and_validation():
    user_id = str(uuid.uuid4())
    org_id = str(uuid.uuid4())
    roles = ["USER", "ADMIN"]
    
    # Issue Access Token
    token = jwt_service.create_access_token(user_id=user_id, org_id=org_id, roles=roles)
    
    # Validate
    payload = await jwt_service.validate_token(token, expected_type="access")
    assert payload.sub == user_id
    assert payload.org_id == org_id
    assert payload.roles == roles
    
    # Check invalid type
    with pytest.raises(UnauthorizedException):
        await jwt_service.validate_token(token, expected_type="refresh")

@pytest.mark.asyncio
async def test_jwt_revocation():
    user_id = str(uuid.uuid4())
    token = jwt_service.create_access_token(user_id=user_id)
    
    # Revoke it
    await jwt_service.revoke_token(token)
    
    # Validate should fail due to blacklist
    with pytest.raises(UnauthorizedException, match="Token has been revoked"):
        await jwt_service.validate_token(token)
