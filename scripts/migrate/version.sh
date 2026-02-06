#!/bin/bash

# Displays the current database migration version
ENV_FILE=".env"
export $(cat $ENV_FILE | grep -v '^#' | xargs)

echo ""
echo "Current migration version:"
migrate -database "${DATABASE_URL}" -path src/db/migrations version
echo ""