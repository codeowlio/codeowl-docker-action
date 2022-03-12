#!/bin/bash

set -e

echo "Executing CodeOwl..."

# Some debugging stuff
echo "Path: ${PWD}"
ls -la
env

npx ts-node /action/src/main.ts
