#!/usr/bin/env bash
set -x
export PORT=3000
lsof -ti:$PORT | xargs kill
rm -rf .nyc_output/ coverage/

set -e
nyc serverless offline &
export SLS_PID=$!
sleep 5
API_URL=http://localhost:$PORT mocha
sleep 5
kill $SLS_PID
sleep 5
