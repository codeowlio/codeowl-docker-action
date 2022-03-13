#!/bin/sh

set -e

echo "Executing CodeOwl..."
npx ts-node /action/src/main.ts
