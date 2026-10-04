FROM python:3.12-slim AS builder

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libc6-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY launcher.c ./
RUN gcc -O2 -Wall -o sandbox_launcher launcher.c

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN useradd --uid 10001 --create-home --shell /usr/sbin/nologin sandbox \
    && mkdir -p /tmp/sandbox \
    && chown -R sandbox:sandbox /tmp/sandbox

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py runner.py ./
COPY --from=builder /src/sandbox_launcher /usr/local/bin/sandbox_launcher

# Run as a non-root user. Learner subprocesses inherit this uid and are further
# constrained by sandbox_launcher (rlimits + seccomp) before Python starts.
USER 10001

EXPOSE 9000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9000"]
