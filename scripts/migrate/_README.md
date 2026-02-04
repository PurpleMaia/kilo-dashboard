# Database Migration Scripts

## Overview

The migration scripts manage your database schema changes using [golang-migrate](https://github.com/golang-migrate/migrate). These scripts provide a safe, version-controlled way to evolve your database schema across development and production environments.

## Why These Scripts Exist

Database schema changes need to be:
- **Versioned**: Track what changes were made and when
- **Reversible**: Roll back changes if something goes wrong
- **Testable**: Verify migrations work before deploying to production
- **Consistent**: Apply the same changes across all environments

These scripts wrap golang-migrate with environment-specific logic, automatic rollback testing in development, and safety checks for production deployments.

## Scripts

### `create.sh`

Creates a new pair of migration files (up and down) with sequential numbering.

**What it does:**
1. Validates that a migration name is provided
2. Creates two files in `src/lib/db/migrations/`:
   - `{number}_{name}.up.sql` - Forward migration
   - `{number}_{name}.down.sql` - Rollback migration

**Usage:**
```bash
./scripts/migrate/create.sh <migration_name>
```

**Example:**
```bash
./scripts/migrate/create.sh create_products_table
# Creates:
# - 000003_create_products_table.up.sql
# - 000003_create_products_table.down.sql
```

**NPM script:**
```bash
pnpm migrate:create <migration_name>
```

**Best practices:**
- Use descriptive names: `add_email_to_users`, `create_orders_table`
- Use snake_case for migration names
- One logical change per migration

### `up.sh`

Runs forward migrations with environment-specific behavior.

**What it does:**

**In Development (`d` or `dev`):**
1. Runs migration up (all or specified count)
2. Tests rollback by running down 1
3. Runs migration up again (validates both directions work)

**In Production (`p` or `prod`):**
1. Runs migration up (all or specified count)
2. No rollback testing (safer for production)

**Usage:**
```bash
# Development - all migrations
./scripts/migrate/up.sh dev

# Development - specific number of migrations
./scripts/migrate/up.sh dev 2

# Production - all migrations (from local)
./scripts/migrate/up.sh prod

# Production - specific number
./scripts/migrate/up.sh prod 1
```

**Short forms:**
```bash
./scripts/migrate/up.sh d     # dev
./scripts/migrate/up.sh p     # prod
```

**NPM scripts:**
```bash
pnpm migrate:up d        # development, all migrations
pnpm migrate:up d 2      # development, 2 migrations
pnpm migrate:up p        # production, all migrations
```

**Environment handling:**
- **Dev:** Uses `DEV_URL` from `.env`
- **Prod (local run):** Uses `PROD_URL` from `.env`
- **Prod (Dokku predeploy):** Uses environment variables from Dokku

### `down.sh`

Rolls back database migrations.

**What it does:**
1. Loads `DATABASE_URL` from `.env`
2. Rolls back specified number of migrations (or all if not specified)

**Usage:**
```bash
# Roll back all migrations
./scripts/migrate/down.sh

# Roll back specific number
./scripts/migrate/down.sh 2
```

**NPM scripts:**
```bash
pnpm migrate:down        # all
pnpm migrate:down 1      # specific count
```

**Warning:** This is destructive. Rolling back migrations may result in data loss.

### `force.sh`

Forces the migration version to a specific number without running migrations.

**What it does:**
1. Manually sets the migration version in the schema_migrations table
2. Useful for fixing migration state issues

**Usage:**
```bash
./scripts/migrate/force.sh <version>
```

**Example:**
```bash
# Force to version 3
./scripts/migrate/force.sh 3
```

**NPM scripts:**
```bash
pnpm migrate:force <version>
```

**When to use:**
- Migration state is corrupted
- Need to skip a problematic migration
- Recovering from failed migration

**Warning:** This doesn't actually run migrations. It only updates the version number. Use with caution and understand what you're doing.

### `version.sh`

Displays the current migration version.

**What it does:**
1. Queries the database for the current migration version
2. Shows which migration was last applied

**Usage:**
```bash
./scripts/migrate/version.sh
```

**NPM scripts:**
```bash
pnpm migrate:version
```

**Example output:**
```
Current migration version:
2
```

## Migration Workflow

### Creating a New Migration

1. **Create migration files:**
   ```bash
   pnpm migrate:create add_stripe_customer_id
   ```

2. **Edit the up migration** (`src/lib/db/migrations/{number}_add_stripe_customer_id.up.sql`):
   ```sql
   ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255);
   CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);
   ```

3. **Edit the down migration** (`{number}_add_stripe_customer_id.down.sql`):
   ```sql
   DROP INDEX idx_users_stripe_customer_id;
   ALTER TABLE users DROP COLUMN stripe_customer_id;
   ```

4. **Test in development:**
   ```bash
   pnpm migrate:up d 1
   ```
   This will:
   - Run your migration up
   - Test rolling it back (down)
   - Run it up again

5. **Verify the changes:**
   ```bash
   pnpm migrate:version
   # Check your database schema
   ```

6. **Commit the migration files:**
   ```bash
   git add src/lib/db/migrations/
   git commit -m "Add stripe_customer_id to users table"
   ```

### Applying Migrations

**Development:**
```bash
# Apply all pending migrations
pnpm migrate:up d

# Apply next 2 migrations
pnpm migrate:up d 2
```

**Production (from local machine):**
```bash
# Apply all pending migrations
pnpm migrate:up p

# Apply specific number
pnpm migrate:up p 1
```

**Production (automatic via Dokku):**
- Migrations run automatically during deployment via the predeploy task
- Defined in `app.json`
- Uses the production environment variables from Dokku

### Rolling Back Migrations

**Rollback last migration:**
```bash
pnpm migrate:down 1
```

**Rollback last 3 migrations:**
```bash
pnpm migrate:down 3
```

**Rollback all migrations:**
```bash
pnpm migrate:down
```

**Note:** Always test rollbacks in development first!

## Environment Configuration

Migrations use these environment variables:

**From `.env` file:**
- `DATABASE_URL` - Default database (used by down.sh, force.sh, version.sh)
- `DEV_URL` - Development database (used by up.sh for dev)
- `PROD_URL` - Production database (used by up.sh for prod when run locally)

**From Dokku (during deployment):**
- Database URL is automatically injected via the Postgres link
- Used during predeploy task in production

## NPM Script Reference

```bash
# Create new migration
pnpm migrate:create <name>

# Run migrations (dev)
pnpm migrate:up d [count]

# Run migrations (prod)
pnpm migrate:up p [count]

# Rollback migrations
pnpm migrate:down [count]

# Force version
pnpm migrate:force <version>

# Check version
pnpm migrate:version
```

## Troubleshooting

### "Dirty database version"

**Problem:** Migration failed halfway through

**Solution:**
1. Check what went wrong: `pnpm migrate:version`
2. Manually fix the database if needed
3. Force clean state: `pnpm migrate:force <last_good_version>`
4. Try migration again

### "No change" when running migration

**Problem:** Migration already applied

**Solution:**
- Check current version: `pnpm migrate:version`
- View migration files to see what's pending
- Migrations are sequential; can't skip versions

### Migration fails in production

**Problem:** Migration works in dev but fails in prod

**Common causes:**
1. **Data differences:** Production has data that breaks the migration
2. **Permissions:** Postgres user lacks necessary permissions
3. **Resources:** Migration too large for available memory/disk

**Solutions:**
1. Test with production-like data in dev
2. Check Postgres logs on Dokku
3. Break large migrations into smaller chunks
4. Consider maintenance window for complex changes

### Can't connect to database

**Problem:** "Connection refused" or "Cannot connect"

**Solutions:**
1. Check `.env` has correct database URLs
2. Verify network access to Dokku host
3. Check Postgres container is running:
   ```bash
   ssh dokku@$PMF_DOKKU_HOST postgres:info <app-name>-dev-db
   ```
4. Verify exposed ports are correct

### Wrong database being used

**Problem:** Migration applied to wrong environment

**Prevention:**
- Always specify environment: `d` or `p`
- Double-check `DATABASE_URL` in `.env`
- Use version control to track which migrations went where

**Solution:**
- If needed, manually fix the database
- Force the version to correct state
- Re-run migrations on correct database

## Advanced Usage

### Running migrations in CI/CD

```bash
# In your CI pipeline
export DATABASE_URL=$CI_DATABASE_URL
./scripts/migrate/up.sh d
```

### Manual migration with golang-migrate

```bash
# Direct usage
migrate -database "${DATABASE_URL}" -path src/lib/db/migrations up
migrate -database "${DATABASE_URL}" -path src/lib/db/migrations down 1
migrate -database "${DATABASE_URL}" -path src/lib/db/migrations version
```

## Migration File Structure

```
src/lib/db/migrations/
├── 000001_initial_schema.up.sql
├── 000001_initial_schema.down.sql
├── 000002_add_organizations.up.sql
├── 000002_add_organizations.down.sql
├── 000003_add_stripe_fields.up.sql
└── 000003_add_stripe_fields.down.sql
```

**Naming convention:**
- Sequential numbering: `000001`, `000002`, etc.
- Descriptive names: `create_users_table`, `add_email_column`
- `.up.sql` for forward migration
- `.down.sql` for rollback

## Additional Resources

- golang-migrate documentation: https://github.com/golang-migrate/migrate
- SQL migration best practices: https://www.postgresql.org/docs/current/ddl.html
- Database versioning: https://martinfowler.com/articles/evodb.html
