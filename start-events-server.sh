#!/usr/bin/sh

# env variables needed:
# EVENTS_SERVER_AUTH_TOKEN
# POSTGRES_URL
# POSTGRES_URL_NON_POOLING

pnpm -F @donum/events-server start > logs.log 2>&1 &
