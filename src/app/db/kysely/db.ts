// lib/db.ts
import { Kysely, type Generated, type ColumnType, PostgresDialect } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js'
import { Pool } from 'pg'
import postgres from 'postgres'
import { DB } from 'kysely-codegen/dist'

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});

// export { sql } from 'kysely'