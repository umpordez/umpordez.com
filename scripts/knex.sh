#!/bin/bash
root=$( cd "$(dirname "$0")/.."; pwd -P)
$root/node_modules/knex/bin/cli.js \
    --knexfile $root/knexfile.js \
    --cwd $root \
    $@
