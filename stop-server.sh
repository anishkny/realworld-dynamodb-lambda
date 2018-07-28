#!/usr/bin/env bash
set -x
SERVER_PIDS=`lsof -ti:3000 -ti:8000`
if [ -n "$SERVER_PIDS" ]; then
  kill $SERVER_PIDS
fi
