import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Centro Inteligente API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Seguridad JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_clave_secreta_desarrollo_12345")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 horas

    # Base de datos PostgreSQL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:password@localhost:5432/empresa_db"
    )

    class Config:
        case_sensitive = True

settings = Settings()