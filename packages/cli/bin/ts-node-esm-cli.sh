#!/usr/bin/env bash

# Apparently you can not pass flags directly as part of the hashbang statement
# so this is a workaround for that.
/usr/bin/env node --experimental-specifier-resolution=node --loader ts-node/esm ../dist/cli.js "$@"
