#!/usr/bin/env bash
set -x
lsof -ti:3000 -ti:8000 | xargs kill

# Add JRE to path
export JRE_PATH=`find node_modules/node-jre -type f -name java`
export JRE_PATH=`dirname $JRE_PATH`
export JRE_PATH=`pwd`/$JRE_PATH
export PATH=$JRE_PATH:$PATH

set -e
which java
java -version
serverless dynamodb start --migrate &
sleep 5
nyc serverless offline &
sleep 5
