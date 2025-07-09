// lib/db.ts
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg'
import { DB } from '../generated'

// Create a single pool instance with proper configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Connection pool configuration to prevent exhaustion
  max: 10, // Maximum number of connections in the pool
  min: 2,  // Minimum number of connections in the pool
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit process in production, just log the error
  if (process.env.NODE_ENV === 'development') {
    process.exit(-1);
  }
});

// Log connection events in development
if (process.env.NODE_ENV === 'development') {
  pool.on('connect', () => {
    console.log('New connection to database');
  });

  pool.on('remove', () => {
    console.log('Connection removed from pool');
  });
}

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool,
  }),
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down database pool...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down database pool...');
  await pool.end();
  process.exit(0);
});

// Export pool for manual cleanup if needed
export { pool };