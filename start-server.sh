#!/usr/bin/env bash
set -x
./stop-server.sh

# Add JRE to path
export JRE_PATH=`find node_modules/node-jre -type f -name java`
export JRE_PATH=`dirname $JRE_PATH`
export JRE_PATH=`pwd`/$JRE_PATH
export PATH=$JRE_PATH:$PATH
set -e
which java
java -version

# Start local dynamodb and offline plugins
serverless dynamodb start --migrate &
sleep 5
nyc serverless offline &
sleep 5
