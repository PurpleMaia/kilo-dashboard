#!/bin/bash

# Rolls back database migrations
# If no number specified, rolls back all migrations

DOWNS=$1

ENV_FILE=".env"
export $(cat $ENV_FILE | grep -v '^#' | xargs)

echo ""
if [ -z "$DOWNS" ]; then
    echo "Rolling back all migrations..."
    migrate -database "${DATABASE_URL}" -path src/lib/db/migrations down
else
    echo "Rolling back $DOWNS migration(s)..."
    migrate -database "${DATABASE_URL}" -path src/lib/db/migrations down ${DOWNS}
fi