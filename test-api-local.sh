#!/usr/bin/env bash
rm -rf .test_output && mkdir -p .test_output

echo -n 'Starting server (see .test_output/server.log)... '
./start-server.sh > .test_output/server.log 2>&1
echo 'Done!'

touch .test_output/network.md
export NETWORK_DUMP_FILE=.test_output/network.md

set -eo pipefail
API_URL=http://localhost:3000/api mocha
set +e

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
showdown --quiet makehtml --input $NETWORK_DUMP_FILE >> .test_output/network.html

echo -n 'Stopping server (see .test_output/server.log)... '
sleep 5
./stop-server.sh >> .test_output/server.log 2>&1
echo 'Done!'

nyc report
