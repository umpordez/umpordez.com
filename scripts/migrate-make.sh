#!/bin/bash
$(dirname "$0")/knex.sh migrate:make $@
