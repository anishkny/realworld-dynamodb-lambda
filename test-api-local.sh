#!/usr/bin/env bash
set -x
./start-server.sh

set -e
API_URL=http://localhost:3000 mocha
sleep 5

./stop-server.sh
