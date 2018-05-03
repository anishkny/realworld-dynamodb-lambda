#!/usr/bin/env bash
set -x

./start-server.sh

rm -rf .test_output && mkdir -p .test_output
touch .test_output/network.md
export NETWORK_DUMP_FILE=.test_output/network.md

set -eo pipefail
API_URL=http://localhost:3000 mocha 2>&1 | tee .test_output/test.log
sleep 5

./stop-server.sh
