#!/usr/bin/env bash
set -euo pipefail

# Lightweight local CI runner (requires docker)
# Usage:
#   chmod +x scripts/run_ci.sh
#   ./scripts/run_ci.sh

echo "Starting local CI..."

cleanup() {
  echo "Cleaning up containers..."
  docker stop notes-app-test ci-mysql ci-mysql-app-db >/dev/null 2>&1 || true
  docker rm notes-app-test ci-mysql ci-mysql-app-db >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "Launching temporary MySQL for local tests..."
docker run -d --name ci-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=notes_app -p 3306:3306 mysql:8.0

echo "Waiting for MySQL to be ready..."
for i in $(seq 1 30); do
  docker exec ci-mysql mysqladmin ping -uroot -ppassword >/dev/null 2>&1 && break || sleep 2
done

echo "Installing node dependencies..."
npm ci

echo "Running lint..."
npm run lint

echo "Running tests (pointing at local MySQL)..."
DB_HOST=127.0.0.1 DB_USER=root DB_PASSWORD=password DB_NAME=notes_app npm test

echo "Building Docker image..."
docker build -t notes-app:local .

echo "Starting a fresh MySQL for containerized app test..."
docker run -d --name ci-mysql-app-db -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=notes_app mysql:8.0

echo "Waiting for MySQL (for containerized test)..."
for i in $(seq 1 30); do
  docker exec ci-mysql-app-db mysqladmin ping -uroot -ppassword >/dev/null 2>&1 && break || sleep 2
done

echo "Running app container linked to MySQL..."
docker run -d --name notes-app-test --link ci-mysql-app-db:mysql -p 3000:3000 \
  -e DB_HOST=ci-mysql-app-db -e DB_USER=root -e DB_PASSWORD=password -e DB_NAME=notes_app \
  notes-app:local

echo "Waiting for app /health..."
for i in $(seq 1 30); do
  curl -fsS http://localhost:3000/health && break || sleep 2
done

echo "Local CI completed successfully."
