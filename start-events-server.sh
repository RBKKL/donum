#!/usr/bin/sh

# env variables needed:
# EVENTS_SERVER_AUTH_TOKEN
# POSTGRES_PRISMA_URL

pnpm -F @donum/events-server start > logs.log 2>&1 &
