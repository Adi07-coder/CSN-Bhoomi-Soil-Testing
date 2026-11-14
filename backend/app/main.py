"""

AI Bhoomi — FastAPI Application Entry Point

"""

from contextlib import asynccontextmanager



from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from fastapi.middleware.gzip import GZipMiddleware



import logging



from app.core.config import settings

from app.core.database import init_db

from app.api.v1.router import api_router



logger = logging.getLogger("uvicorn.error")





@asynccontextmanager

async def lifespan(app: FastAPI):

    """Application lifespan: startup and shutdown hooks."""

    try:

        await init_db()

        logger.info("Database initialized successfully.")

    except Exception as exc:

        logger.warning(

            "Database connection warning on startup: %s. "

            "Ensure PostgreSQL is running (e.g. docker compose up -d) for persistent DB operations.",

            exc,

        )

    yield





def create_application() -> FastAPI:

    application = FastAPI(

        title="AI Bhoomi API",

        description=(

            "Smart Satellite Soil Analysis & Fertilizer Recommendation System. "

            "Primary geography: Maharashtra, India."

        ),

        version="1.0.0",

        openapi_url="/api/openapi.json",

        docs_url="/api/docs",

        redoc_url="/api/redoc",

        lifespan=lifespan,

    )



    # ── Middleware ────────────────────────────────────────────────────────────

    application.add_middleware(GZipMiddleware, minimum_size=1000)

    application.add_middleware(

        CORSMiddleware,

        allow_origins=settings.BACKEND_CORS_ORIGINS,

        allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$|^https://[a-zA-Z0-9\-]+\.netlify\.app$",

        allow_credentials=True,

        allow_methods=["*"],

        allow_headers=["*"],

    )



    # ── Routers ───────────────────────────────────────────────────────────────

    application.include_router(api_router, prefix="/api/v1")



    @application.get("/health", tags=["health"])

    async def health_check():

        return {"status": "ok", "app": "AI Bhoomi", "version": "1.0.0"}



    return application





app = create_application()


if __name__ == "__main__":
    from run import main
    main()

