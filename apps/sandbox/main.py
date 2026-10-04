"""DEV-TO-DEV Code Sandbox — HTTP service.

Exposes a single execution endpoint used by the main API. This service is
deliberately minimal: it holds no secrets, has no database/Redis access, and is
deployed on an isolated network. It is the only component that ever runs
learner-submitted code (see runner.py).
"""

import os
import threading

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.concurrency import run_in_threadpool

import runner

app = FastAPI(title="DEV-TO-DEV Code Sandbox", version="1.0.0")

SANDBOX_TOKEN = os.environ.get("SANDBOX_TOKEN", "")

# Global concurrency ceiling for this sandbox service. This is the single
# process-level limit; it is intentionally simple and not distributed.
MAX_CONCURRENT = int(os.environ.get("SANDBOX_MAX_CONCURRENT", "4"))
_exec_semaphore = threading.BoundedSemaphore(MAX_CONCURRENT)


@app.get("/health")
def health() -> dict:
    return {"status": "healthy"}


@app.post("/run")
async def run(request: Request) -> JSONResponse:
    if SANDBOX_TOKEN:
        token = request.headers.get("x-sandbox-token", "")
        if token != SANDBOX_TOKEN:
            return JSONResponse(
                status_code=401,
                content={"success": False, "output": "", "error": "Unauthorized"},
            )

    try:
        body = await request.json()
    except Exception:
        return JSONResponse(
            status_code=400,
            content={"success": False, "output": "", "error": "Invalid request body."},
        )

    language = body.get("language", "")
    code = body.get("code", "")

    if language != "python":
        return JSONResponse(
            status_code=400,
            content={"success": False, "output": "", "error": "Unsupported language."},
        )

    if not isinstance(code, str):
        return JSONResponse(
            status_code=400,
            content={"success": False, "output": "", "error": "Code must be a string."},
        )

    if not _exec_semaphore.acquire(blocking=False):
        return JSONResponse(
            status_code=429,
            content={
                "success": False,
                "output": "",
                "error": "Too many concurrent executions. Try again shortly.",
            },
        )

    try:
        result = await run_in_threadpool(runner.run_python, code)
        return JSONResponse(status_code=200, content=result)
    finally:
        _exec_semaphore.release()
