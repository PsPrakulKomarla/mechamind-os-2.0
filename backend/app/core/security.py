import re
from datetime import datetime, timedelta, timezone
from typing import Any, Union
import jwt
from passlib.context import CryptContext
from cryptography.fernet import Fernet
from cryptography.fernet import InvalidToken

from app.core.config import settings
from app.core.exceptions import ValidationException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
fernet = Fernet(settings.ENCRYPTION_KEY.encode())

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def validate_password_strength(password: str) -> bool:
    """
    Validate password meets enterprise standards:
    - Min 8 chars
    - 1 uppercase, 1 lowercase
    - 1 number, 1 special character
    """
    if len(password) < 8:
        raise ValidationException("Password must be at least 8 characters long.")
    if not re.search(r"[A-Z]", password):
        raise ValidationException("Password must contain at least one uppercase letter.")
    if not re.search(r"[a-z]", password):
        raise ValidationException("Password must contain at least one lowercase letter.")
    if not re.search(r"\d", password):
        raise ValidationException("Password must contain at least one number.")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise ValidationException("Password must contain at least one special character.")
    return True

def encrypt_data(data: str) -> str:
    """Encrypt sensitive data securely using symmetric AES (Fernet)."""
    return fernet.encrypt(data.encode()).decode()

def decrypt_data(encrypted_data: str) -> str:
    """Decrypt symmetrically encrypted data."""
    try:
        return fernet.decrypt(encrypted_data.encode()).decode()
    except InvalidToken:
        raise ValueError("Invalid encryption token or data corruption.")
