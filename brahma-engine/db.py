"""
PROJECT BRAHMA — DATABASE CONNECTION LAYER & SUPAVISOR POOLING
Enforces connection pooling via Supavisor Transaction Pooler (Port 6543).
Configured with asyncpg connection pool limits: min_size=5, max_size=20.
"""

import os
import logging
import asyncpg
from typing import Optional

logger = logging.getLogger("brahma.db")

# 1. Supavisor Port 6543 Enforcement
# Supabase Transaction Pooler URL must target port 6543 (not direct 5432 session port)
DEFAULT_POOLER_HOST = os.getenv("SUPAVISOR_HOST", "aws-0-ap-south-1.pooler.supabase.com")
DEFAULT_POOLER_PORT = int(os.getenv("SUPAVISOR_PORT", "6543"))
DEFAULT_DB_USER = os.getenv("DB_USER", "postgres.hbbunfizlwgvripgwzdo")
DEFAULT_DB_NAME = os.getenv("DB_NAME", "postgres")
DEFAULT_DB_PASS = os.getenv("DB_PASSWORD", "BrahmaSecurePass2026!")

DATABASE_POOLER_URL = os.getenv(
    "DATABASE_POOLER_URL",
    f"postgresql://{DEFAULT_DB_USER}:{DEFAULT_DB_PASS}@{DEFAULT_POOLER_HOST}:{DEFAULT_POOLER_PORT}/{DEFAULT_DB_NAME}?sslmode=require"
)

# Global connection pool instance
_db_pool: Optional[asyncpg.Pool] = None


async def init_db_pool(
    dsn: Optional[str] = None,
    min_size: int = 5,
    max_size: int = 20,
    timeout: float = 30.0
) -> asyncpg.Pool:
    """
    Initializes asyncpg connection pool against Supavisor Transaction Pooler (Port 6543).
    Limits: min_size=5, max_size=20.
    """
    global _db_pool
    if _db_pool is not None and not _db_pool._closed:
        return _db_pool

    target_dsn = dsn or DATABASE_POOLER_URL

    # Ensure port 6543 enforcement notice
    if ":5432" in target_dsn:
        logger.warning(
            "[DB POOLER] Warning: Direct PostgreSQL port 5432 detected in DSN. "
            "Switching to Supavisor Transaction Pooler port 6543."
        )
        target_dsn = target_dsn.replace(":5432", ":6543")

    logger.info(
        f"[DB POOLER] Initializing asyncpg pool against Supavisor Transaction Pooler (Port 6543) "
        f"[min_size={min_size}, max_size={max_size}]..."
    )

    try:
        # Note: In mock/offline mode when remote database credentials are not active,
        # we handle connection gracefully while keeping pool architecture ready
        _db_pool = await asyncpg.create_pool(
            dsn=target_dsn,
            min_size=min_size,
            max_size=max_size,
            command_timeout=timeout,
            ssl="require" if "sslmode=require" in target_dsn or "supabase.co" in target_dsn or "pooler.supabase.com" in target_dsn else False
        )
        logger.info("[DB POOLER] asyncpg connection pool successfully established.")
        return _db_pool
    except Exception as e:
        logger.warning(
            f"[DB POOLER] Could not connect to remote Supavisor Pooler: {e}. "
            "Engine will operate in hardened decoupled standalone mode."
        )
        return None


async def get_db_pool() -> Optional[asyncpg.Pool]:
    """Returns the active asyncpg connection pool."""
    global _db_pool
    return _db_pool


async def close_db_pool():
    """Gracefully terminates the asyncpg connection pool."""
    global _db_pool
    if _db_pool is not None and not _db_pool._closed:
        logger.info("[DB POOLER] Closing asyncpg connection pool...")
        await _db_pool.close()
        _db_pool = None
