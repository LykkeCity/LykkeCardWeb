#!/usr/bin/env bash
set -e
set -x

mkdir -p $ROOT/logs/nginx
nginx -g 'daemon off;' -c $ROOT/lykkecardweb/tools/nginx.conf
nginx -c $ROOT/lykkecardweb/tools/nginx.conf