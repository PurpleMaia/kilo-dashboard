#!/bin/bash

# Creates new database migration files (up and down)
if [ -z "$1" ]; then
    echo "Usage: ./scripts/new-migration.sh <migration_name>"
    echo "Example: ./scripts/new-migration.sh create_users_table"
    exit 1
fi

echo "Creating new migration: $1"
migrate create -ext sql -dir src/db/migrations -seq "$1"

echo "Migration created successfully!"