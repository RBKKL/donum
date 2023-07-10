#!/usr/bin/sh

# this variables are public example, use other values in prod
EVENTS_SERVER_AUTH_TOKEN=xBf9D3MY2Yp1Jywb DATABASE_URL=postgresql://postgres:DkDVHPeaPHsFvLpO@db.bvizuwjbhqlyqyoggyys.supabase.co:5432/postgres pnpm -F @donum/events-server start > logs.log 2>&1 &
