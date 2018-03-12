#!/usr/bin/env bash
set -x
export PORT=3000
lsof -ti:$PORT | xargs kill

set -e
nyc serverless offline &
export SLS_PID=$!
sleep 5
API_URL=http://localhost:$PORT mocha
kill $SLS_PID
sleep 5

ls -lhta
find coverage
