"""

Application configuration — reads from environment variables / .env file.

"""

from __future__ import annotations



import ast
import json

from typing import Any, Union



from pydantic import AnyHttpUrl, field_validator

from pydantic_settings import BaseSettings, SettingsConfigDict





class Settings(BaseSettings):

    model_config = SettingsConfigDict(

        env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore"

    )



    # ── Application ──────────────────────────────────────────────────────────

    APP_ENV: str = "development"

    DEBUG: bool = True

    SECRET_KEY: str = "CHANGE_ME"



    # ── Database ─────────────────────────────────────────────────────────────

    DATABASE_URL: str = "postgresql+asyncpg://aibhoomi:aibhoomi_dev@localhost:5432/aibhoomi"

    SYNC_DATABASE_URL: str = "postgresql://aibhoomi:aibhoomi_dev@localhost:5432/aibhoomi"



    # ── JWT ───────────────────────────────────────────────────────────────────

    JWT_ALGORITHM: str = "HS256"

    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7



    # ── CORS ─────────────────────────────────────────────────────────────────

    BACKEND_CORS_ORIGINS: Union[list[str], str] = [

        "http://localhost:5173",

        "http://localhost:3000",

        "http://127.0.0.1:5173",

        "http://127.0.0.1:3000",

    ]



    @field_validator("DEBUG", mode="before")

    @classmethod

    def parse_debug(cls, v: Any) -> bool:

        if isinstance(v, str):

            return v.lower() in ("true", "1", "t", "yes", "y", "debug", "dev", "development")

        return bool(v)



    @field_validator("BACKEND_CORS_ORIGINS", mode="before")

    @classmethod

    def parse_cors(cls, v: Any) -> list[str]:

        default_origins = [

            "http://localhost:5173",

            "http://localhost:3000",

            "http://127.0.0.1:5173",

            "http://127.0.0.1:3000",

        ]

        if not v:

            return default_origins

        if isinstance(v, list):

            return [str(item).strip() for item in v if item]

        if isinstance(v, str):

            v = v.strip()

            if not v:

                return default_origins

            if v.startswith("[") and v.endswith("]"):

                try:

                    parsed = json.loads(v)

                    if isinstance(parsed, list):

                        return [str(item).strip() for item in parsed if item]

                except Exception:

                    try:

                        parsed = ast.literal_eval(v)

                        if isinstance(parsed, list):

                            return [str(item).strip() for item in parsed if item]

                    except Exception:

                        pass

            return [item.strip() for item in v.split(",") if item.strip()]

        return [str(v)]



    # ── Gemini AI (Backend Only) ──────────────────────────────────────────────

    GEMINI_API_KEY: str = ""



    # ── GEE / Satellite ───────────────────────────────────────────────────────

    GEE_DEMO_MODE: bool = True

    GEE_SERVICE_ACCOUNT_EMAIL: str | None = None

    GEE_SERVICE_ACCOUNT_KEY_FILE: str | None = None

    GEE_PROJECT_ID: str | None = None



    # ── SoilGrids ─────────────────────────────────────────────────────────────

    SOILGRIDS_BASE_URL: str = "https://rest.isric.org/soilgrids/v2.0"



    # ── Rate limiting ─────────────────────────────────────────────────────────

    RATE_LIMIT_PER_MINUTE: int = 60



    # ── File storage ─────────────────────────────────────────────────────────

    UPLOAD_DIR: str = "./uploads"

    MAX_UPLOAD_SIZE_MB: int = 10





settings = Settings()



# reload trigger

