#!/bin/bash

# Forces the database migration to a specific version

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "Error: Version is required"
    echo "Usage: ./scripts/migrate-down.sh [l|local|d|dev] <version>"
    exit 1
fi

ENV_FILE=".env"
export $(cat $ENV_FILE | grep -v '^#' | xargs)

echo ""
echo "Forcing migration to version ${VERSION}..."
migrate -database "${DATABASE_URL}" -path src/lib/db/migrations force ${VERSION}