#!/usr/bin/sh

# env variables needed:
# EVENTS_SERVER_AUTH_TOKEN
# DATABASE_URL

pnpm -F @donum/events-server start > logs.log 2>&1 &
