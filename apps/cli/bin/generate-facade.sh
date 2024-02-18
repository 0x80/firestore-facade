#!/bin/bash

# Get the directory of the Bash script
bin_dir="$(dirname "$0")"

# Set the path to the Node.js script (relative to the script's directory)
script_path="$bin_dir/../src/index.ts"

# Pass the extra argument as a command-line argument
configuration_path="$1"

# Call Node.js with the script and the extra argument
node --import tsx "$script_path" "$configuration_path"

