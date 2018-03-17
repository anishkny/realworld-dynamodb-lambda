#!/usr/bin/env bash
set -x
export PORT=3000
lsof -ti:$PORT -ti:8000 | xargs kill
rm -rf .nyc_output/ coverage/

set -e
which java
java -version
sls dynamodb start --migrate &
export DDB_PID=$!
sleep 5
nyc serverless offline &
export SLS_PID=$!
sleep 5
API_URL=http://localhost:$PORT mocha
sleep 5
kill $SLS_PID $DDB_PID
sleep 5
