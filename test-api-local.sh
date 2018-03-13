#!/usr/bin/env bash
set -x
export PORT=3000
lsof -ti:$PORT | xargs kill
rm -rf .nyc_output/ coverage/

set -e
nyc serverless offline &
export SLS_PID=$!
sleep 2
API_URL=http://localhost:$PORT mocha
sleep 2
kill $SLS_PID
sleep 2
