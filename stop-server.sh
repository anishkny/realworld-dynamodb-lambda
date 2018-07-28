#!/usr/bin/env bash
set -x
lsof -ti:3000 -ti:8000 | xargs -n1 kill || true
