import os
import secrets
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "MechaMind OS 2.0 API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # Database Settings
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "mechamind"
    POSTGRES_PORT: str = "5432"
    DATABASE_URL: str = ""

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Redis Settings
    REDIS_URL: str = "redis://localhost:6379/0"

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    # Security — defaults to a random key if not set via env; MUST override in production
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Storage Config
    STORAGE_BACKEND: str = "local"
    LOCAL_STORAGE_DIR: str = "./storage/documents"

    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # File Upload Limits (1GB = 1,073,741,824 bytes)
    MAX_CONTENT_LENGTH: int = 1_073_741_824  # 1GB max request size
    MAX_FILE_SIZE: int = 1_073_741_824  # 1GB max individual file size

    # Encryption Settings — defaults to a random Fernet key if not set via env
    ENCRYPTION_KEY: str = ""

    # Security Settings
    MAX_LOGIN_ATTEMPTS: int = 5
    LOCKOUT_MINUTES: int = 15

    # IoT API Key for edge gateways
    IOT_API_KEY: str = ""

    # LLM Settings
    LLM_PROVIDER: str = "mock"
    LLM_API_KEY: str = ""
    LLM_MODEL: str = "google/gemini-2.0-flash-lite-preview-02-05:free"
    LLM_BASE_URL: str = "https://openrouter.ai/api/v1"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    def model_post_init(self, __context) -> None:
        """Generate secure defaults for secrets if not provided."""
        if not self.SECRET_KEY:
            self.SECRET_KEY = secrets.token_urlsafe(64)
        if not self.ENCRYPTION_KEY:
            from cryptography.fernet import Fernet
            self.ENCRYPTION_KEY = Fernet.generate_key().decode()
        if not self.IOT_API_KEY:
            self.IOT_API_KEY = secrets.token_urlsafe(32)


settings = Settings()
