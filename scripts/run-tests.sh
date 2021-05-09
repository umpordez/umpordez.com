#!/bin/bash
root=$( cd "$(dirname "$0")/.."; pwd -P)
$root/nodejs/node_modules/mocha/bin/mocha \
    $root/nodejs/tests/**/**/*.test.js \
    $root/nodejs/tests/**/*.test.js
