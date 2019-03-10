#!/bin/bash
set -e

echo 'Waiting for container `postgres`.'

dockerize -timeout=60s -wait tcp://${POSTGRES_HOST:=localhost}:${POSTGRES_PORT:-5432}
echo 'Container `postgres` up.'
cmd="$@"

echo 'Waiting for Postgres service.'
until pg_isready -d "${POSTGRES_DB}" -h ${POSTGRES_HOST} -U "${POSTGRES_USER}"; do
    sleep 1
done
echo 'Postgres service ready.'
exec $cmd