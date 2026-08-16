import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "LoanCraft AI"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql://loancraft_user:loancraft_password@localhost:5432/loancraft_db"
    )
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    CLERK_API_KEY: str = os.getenv("CLERK_API_KEY", "mock_clerk_key")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "mock_openai_key")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GOOGLE_DOC_AI_KEY: str = os.getenv("GOOGLE_DOC_AI_KEY", "mock_doc_ai_key")

    class Config:
        case_sensitive = True

settings = Settings()
