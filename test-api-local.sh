#!/usr/bin/env bash
set -x

SERVERLESS_OFFLINE_EXTRA_ARGS="--dontPrintOutput" ./start-server.sh

rm -rf .test_output && mkdir -p .test_output
touch .test_output/network.md
export NETWORK_DUMP_FILE=.test_output/network.md

set -eo pipefail
API_URL=http://localhost:3000/api mocha 2>&1 | tee .test_output/test.log
set +e
sleep 5

cat << EOF > .test_output/network.html
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdn.rawgit.com/sindresorhus/github-markdown-css/gh-pages/github-markdown.css">
<style>
	.markdown-body {
		box-sizing: border-box;
		min-width: 200px;
		max-width: 980px;
		margin: 0 auto;
		padding: 45px;
	}

	@media (max-width: 767px) {
		.markdown-body {
			padding: 15px;
		}
	}
</style>
<article class="markdown-body">
EOF
showdown makehtml --input $NETWORK_DUMP_FILE >> .test_output/network.html

./stop-server.sh
