#!/usr/bin/env bash
set -x

./start-server.sh

rm -rf .test_output && mkdir -p .test_output
touch .test_output/network.md
export NETWORK_DUMP_FILE=.test_output/network.md

set -eo pipefail
API_URL=http://localhost:3000 mocha 2>&1 | tee .test_output/test.log
set +e
sleep 5

showdown makehtml -i $NETWORK_DUMP_FILE -o .test_output/network.html
cat >> .test_output/network.html << EOF
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { box-sizing: border-box; min-width: 200px; max-width: 980px; margin: 0 auto; padding: 45px; }
  @media (max-width: 767px) { body { padding: 15px; } }
  * { color: #24292e; }
  h2 { font-family: Arial; }
  pre { background-color: #f6f8fa; padding: 1em; }
</style>
EOF

./stop-server.sh
