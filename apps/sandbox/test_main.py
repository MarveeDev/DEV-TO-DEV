"""Tests for the sandbox's fail-closed authentication.

These tests exercise `main.run` directly (no network, no FastAPI TestClient) and
mock the execution path so no learner code is ever run.
"""

import asyncio
import importlib
import json
import os
import sys

import pytest

sys.path.insert(0, os.path.dirname(__file__))

import runner as runner_module  # noqa: E402


class FakeRequest:
    def __init__(self, headers=None, body=None):
        self.headers = headers if headers is not None else {}
        self._body = body

    async def json(self):
        return self._body


def _load_main(monkeypatch, token_value=None):
    """(Re)import `main` with `SANDBOX_TOKEN` set/unset."""
    if token_value is None:
        monkeypatch.delenv("SANDBOX_TOKEN", raising=False)
    else:
        monkeypatch.setenv("SANDBOX_TOKEN", token_value)
    module = importlib.import_module("main")
    return importlib.reload(module)


def _prepare(main, monkeypatch):
    """Patch the execution path; returns a list that records invocations."""
    calls = []

    async def fake_run_in_threadpool(fn, *args, **kwargs):
        return fn(*args)

    def fake_run_python(code):
        calls.append(code)
        return {"success": True, "output": "", "error": None}

    monkeypatch.setattr(main, "run_in_threadpool", fake_run_in_threadpool)
    monkeypatch.setattr(runner_module, "run_python", fake_run_python)
    return calls


def _post(main, token_header, body=None):
    headers = {"x-sandbox-token": token_header} if token_header is not None else {}
    return asyncio.run(
        main.run(FakeRequest(headers=headers, body=body))
    )


@pytest.mark.parametrize("token_value", [None, "", "   "])
def test_run_fails_closed_when_token_unconfigured(monkeypatch, token_value):
    main = _load_main(monkeypatch, token_value)
    calls = _prepare(main, monkeypatch)

    resp = _post(main, None, body={"language": "python", "code": "print(1)"})

    assert resp.status_code == 503
    payload = json.loads(resp.body)
    assert payload["error"] == "Sandbox authentication is not configured"
    assert calls == []


def test_run_rejects_missing_header(monkeypatch):
    main = _load_main(monkeypatch, "secret-token")
    calls = _prepare(main, monkeypatch)

    resp = _post(main, None, body={"language": "python", "code": "print(1)"})

    assert resp.status_code == 401
    assert calls == []


def test_run_rejects_incorrect_token(monkeypatch):
    main = _load_main(monkeypatch, "secret-token")
    calls = _prepare(main, monkeypatch)

    resp = _post(main, "wrong-token", body={"language": "python", "code": "print(1)"})

    assert resp.status_code == 401
    assert calls == []


def test_run_proceeds_with_correct_token(monkeypatch):
    main = _load_main(monkeypatch, "secret-token")
    calls = _prepare(main, monkeypatch)

    resp = _post(
        main,
        "secret-token",
        body={"language": "python", "code": "print(1)"},
    )

    assert resp.status_code == 200
    payload = json.loads(resp.body)
    assert payload["success"] is True
    assert calls == ["print(1)"]


def test_health_is_public(monkeypatch):
    main = _load_main(monkeypatch, None)
    assert main.health() == {"status": "healthy"}
