#!/bin/sh
set -e

# === Config (optional) ===
: "${DB_WAIT_TIMEOUT:=60}"        # วินาที
: "${SKIP_MIGRATE:=false}"        # ตั้งเป็น "true" เพื่อข้าม migrate ชั่วคราว (เช่น ตอน baseline)

# === Wait for DB (optional) ===
if [ -n "$DATABASE_HOST" ] && [ -n "$DATABASE_PORT" ]; then
  echo "Waiting for DB at $DATABASE_HOST:$DATABASE_PORT (timeout ${DB_WAIT_TIMEOUT}s)..."
  start_ts=$(date +%s)
  while ! nc -z "$DATABASE_HOST" "$DATABASE_PORT" 2>/dev/null; do
    sleep 1
    now_ts=$(date +%s)
    elapsed=$((now_ts - start_ts))
    if [ "$elapsed" -ge "$DB_WAIT_TIMEOUT" ]; then
      echo "Timed out waiting for DB after ${DB_WAIT_TIMEOUT}s"
      exit 1
    fi
  done
  echo "DB is ready."
fi

# === Prisma migrate deploy (prod) ===
if [ "$SKIP_MIGRATE" = "true" ]; then
  echo "Skipping Prisma migrate deploy (SKIP_MIGRATE=true)"
else
  echo "Running Prisma migrations..."
  npx prisma migrate deploy
fi

# === (Optional) seed ===
if [ "$RUN_SEED" = "true" ]; then
  echo "Seeding database..."
  bunx --bun prisma db seed
fi

exec "$@"