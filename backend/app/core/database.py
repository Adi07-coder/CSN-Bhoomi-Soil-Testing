"""
Async SQLAlchemy engine and session factory with SQLite/PostgreSQL resilience.
"""
from __future__ import annotations

import logging
import uuid
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.types import CHAR, TypeDecorator
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from app.core.config import settings

logger = logging.getLogger("uvicorn.error")


class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID type, otherwise CHAR(36) on SQLite/other backends.
    """
    impl = CHAR
    cache_ok = True

    def __init__(self, as_uuid: bool = True, **kwargs: Any) -> None:
        self.as_uuid = as_uuid
        super().__init__(**kwargs)

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if dialect.name == "postgresql":
            return value
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, uuid.UUID):
            return value
        return uuid.UUID(str(value))


def normalize_database_url(url: str) -> str:
    """Normalize raw database URLs to SQLAlchemy 2.0 Async-compatible dialect drivers."""
    if not url:
        return url
    url = url.strip()
    if url.startswith("postgres://"):
        url = "postgresql+asyncpg://" + url[len("postgres://"):]
    elif url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
        url = "postgresql+asyncpg://" + url[len("postgresql://"):]
    elif url.startswith("sqlite://") and not url.startswith("sqlite+aiosqlite://"):
        url = "sqlite+aiosqlite://" + url[len("sqlite://"):]

    # Convert sslmode query parameter to ssl for asyncpg compatibility
    if "postgresql+asyncpg://" in url and "sslmode=" in url:
        url = url.replace("sslmode=", "ssl=")
    return url


def get_active_database_url() -> str:
    """Resolve and validate the active database URL based on APP_ENV."""
    raw_url = (settings.DATABASE_URL or "").strip()
    app_env = getattr(settings, "APP_ENV", "development").lower()

    if app_env == "production":
        if not raw_url:
            raise RuntimeError(
                "CRITICAL CONFIGURATION ERROR: APP_ENV=production requires the DATABASE_URL environment "
                "variable to be configured with a PostgreSQL connection string (e.g. postgresql+asyncpg://...). "
                "DATABASE_URL is currently empty."
            )
        if "sqlite" in raw_url.lower():
            raise RuntimeError(
                "CRITICAL CONFIGURATION ERROR: APP_ENV=production requires a PostgreSQL database with PostGIS. "
                "SQLite is disabled in production to protect data persistence. "
                "Please configure DATABASE_URL with your PostgreSQL connection string in Render, "
                "or set APP_ENV=development if testing with local SQLite."
            )

    # In development/test, if DATABASE_URL is not set or defaults to sqlite
    if not raw_url:
        raw_url = "sqlite+aiosqlite:///./aibhoomi.db"

    return normalize_database_url(raw_url)


# Choose active DB URL and configure engine
ACTIVE_DB_URL = get_active_database_url()
engine_kwargs: dict[str, Any] = {
    "echo": False,
}

if "sqlite" in ACTIVE_DB_URL:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20
    engine_kwargs["pool_recycle"] = 1800

engine = create_async_engine(ACTIVE_DB_URL, **engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


async def init_db() -> None:
    """Create extensions (PostgreSQL) and tables on startup."""
    import app.models  # noqa: F401 — registers all models on Base.metadata
    async with engine.begin() as conn:
        if engine.dialect.name == "postgresql":
            try:
                from sqlalchemy import text
                await conn.execute(text('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'))
                await conn.execute(text('CREATE EXTENSION IF NOT EXISTS "postgis";'))
                logger.info("PostgreSQL extensions (uuid-ossp, postgis) checked/enabled.")
            except Exception as ext_err:
                logger.warning(
                    "Notice: Could not automatically enable PostGIS/uuid-ossp extension: %s",
                    ext_err,
                )
        await conn.run_sync(Base.metadata.create_all)


async def get_db() -> AsyncSession:  # type: ignore[return]
    """FastAPI dependency — yields a database session."""
    async with AsyncSessionLocal() as session:
        yield session
