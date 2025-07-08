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
  idleTimeoutMillis: 10000, // How long a connection can be idle before being closed (10 seconds)
  connectionTimeoutMillis: 30000, // Maximum time to acquire a connection (30 seconds)
  maxUses: 7500, // Maximum number of times a connection can be used before being destroyed
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