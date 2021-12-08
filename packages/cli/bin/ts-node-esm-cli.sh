#!/usr/bin/env bash

# Apparently you can not pass flags directly as part of the hashbang statement
# so this is a workaround for that.
# This is not working yet because ../dist is resolved from the CWD and not this
# script its location.
/usr/bin/env node --experimental-specifier-resolution=node --loader ts-node/esm ../dist/cli.js "$@"
