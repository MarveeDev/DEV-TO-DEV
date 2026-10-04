"""Safe, isolated execution of learner-submitted Python code.

This module is the ONLY place where learner code is ever executed. It hands the
submitted code to a compiled launcher (`sandbox_launcher`) which, before the
Python interpreter starts, lowers resource limits and installs a seccomp-BPF
filter that denies `socket`/`socketpair`. The launcher then exec's Python.

Runner-level controls (all Linux-only, by design):
  * wall-clock timeout,
  * clean, minimal child environment (no container secrets),
  * isolated working directory that is always cleaned up,
  * source-size and output-size caps.
"""

import os
import shutil
import subprocess
import sys
import tempfile
import time

MAX_CODE_BYTES = 10_000
MAX_OUTPUT_BYTES = 20_000
MAX_TIME_SECONDS = 5

# The learner process gets a clean, minimal environment so no container secret
# (including SANDBOX_TOKEN) is ever visible to untrusted code.
SAFE_ENV = {
    "PATH": "/usr/local/bin:/usr/bin:/bin",
    "HOME": "/tmp",
    "LANG": "C.UTF-8",
    "LC_ALL": "C.UTF-8",
}

LAUNCHER = os.environ.get("SANDBOX_LAUNCHER", "/usr/local/bin/sandbox_launcher")


def _truncate(text: str) -> str:
    data = text.encode("utf-8", "replace")
    if len(data) <= MAX_OUTPUT_BYTES:
        return text
    return data[:MAX_OUTPUT_BYTES].decode("utf-8", "replace") + "\n[output truncated]"


def _sanitize(text: str, workdir: str) -> str:
    """Replace the ephemeral work directory path so it never leaks to users."""
    return text.replace(workdir, "<script>")


def run_python(code: str) -> dict:
    if not isinstance(code, str):
        return {"success": False, "output": "", "error": "Code must be a string."}

    if len(code.encode("utf-8")) > MAX_CODE_BYTES:
        return {
            "success": False,
            "output": "",
            "error": "Code exceeds the maximum allowed size.",
        }

    workdir = tempfile.mkdtemp(prefix="dtdev-")
    script_path = os.path.join(workdir, "main.py")

    try:
        with open(script_path, "w", encoding="utf-8") as fh:
            fh.write(code)

        started = time.monotonic()
        try:
            proc = subprocess.run(
                [LAUNCHER, sys.executable, "-I", script_path],
                capture_output=True,
                text=True,
                timeout=MAX_TIME_SECONDS,
                cwd=workdir,
                env=SAFE_ENV,
                stdin=subprocess.DEVNULL,
            )
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "output": "",
                "error": "Execution timed out after %d seconds." % MAX_TIME_SECONDS,
                "executionTimeMs": int((time.monotonic() - started) * 1000),
            }

        execution_time_ms = int((time.monotonic() - started) * 1000)

        stdout = proc.stdout or ""
        stderr = proc.stderr or ""

        combined = stdout
        if stderr:
            combined = combined + ("\n" if combined else "") + stderr

        combined = _sanitize(combined, workdir)
        combined = _truncate(combined)

        if proc.returncode != 0:
            if proc.returncode < 0:
                return {
                    "success": False,
                    "output": combined,
                    "error": "Execution was terminated (time or resource limit exceeded).",
                    "executionTimeMs": execution_time_ms,
                }
            return {
                "success": False,
                "output": combined,
                "error": _sanitize(stderr.strip(), workdir)
                or ("Process exited with code %d." % proc.returncode),
                "executionTimeMs": execution_time_ms,
            }

        return {
            "success": True,
            "output": combined,
            "error": None,
            "executionTimeMs": execution_time_ms,
        }
    finally:
        shutil.rmtree(workdir, ignore_errors=True)
