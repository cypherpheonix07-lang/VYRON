"""
PROJECT BRAHMA — CELERY ASYNC WORKER & QUEUE ORCHESTRATION
Decouples CPU-bound AST/Security scans and PDF compilations from FastAPI async event loop.
"""

import os
from celery import Celery
from kombu import Queue, Exchange

# Redis broker configuration with in-memory fallback for local verification
REDIS_BROKER_URL = os.getenv("REDIS_URL", "redis://127.0.0.1:6379/0")
REDIS_RESULT_BACKEND = os.getenv("REDIS_RESULT_BACKEND", os.getenv("REDIS_URL", "redis://127.0.0.1:6379/0"))

# Check if we should use memory broker for offline environments
USE_MEMORY_BROKER = os.getenv("USE_MEMORY_BROKER", "false").lower() in ("true", "1")

if USE_MEMORY_BROKER:
    broker_url = "memory://"
    result_backend = "cache+memory://"
else:
    broker_url = REDIS_BROKER_URL
    result_backend = REDIS_RESULT_BACKEND

celery_app = Celery(
    "brahma_engine",
    broker=broker_url,
    backend=result_backend,
    include=["tasks"]
)

# Strict Industrial Queue Topology
default_exchange = Exchange("brahma_exchange", type="direct")

celery_app.conf.update(
    task_default_queue="default",
    task_queues=(
        Queue("default", default_exchange, routing_key="default"),
        Queue("scans_queue", default_exchange, routing_key="scans.#"),
        # Dedicated PDF queue with concurrency=1 and strict memory isolation
        Queue("pdf_queue", default_exchange, routing_key="pdf.#"),
        Queue("webhooks_queue", default_exchange, routing_key="webhooks.#"),
    ),
    task_routes={
        "tasks.scan_repo_task": {"queue": "scans_queue", "routing_key": "scans.repo"},
        "tasks.compile_pdf_task": {"queue": "pdf_queue", "routing_key": "pdf.compile"},
        "tasks.process_webhooks_task": {"queue": "webhooks_queue", "routing_key": "webhooks.process"},
    },
    # Industrial Concurrency and Memory Guardrails
    worker_prefetch_multiplier=1,          # Prevent worker starvation
    task_acks_late=True,                   # Guarantee delivery upon worker crash
    task_reject_on_worker_lost=True,       # Re-queue if worker killed
    worker_max_memory_per_child=200000,    # Max 200MB memory per child worker to prevent OOM
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    result_expires=86400                   # 24 hour result retention
)

if __name__ == "__main__":
    celery_app.start()
