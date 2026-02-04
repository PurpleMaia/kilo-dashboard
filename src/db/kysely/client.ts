import { Kysely, PostgresAdapter, PostgresIntrospector, PostgresQueryCompiler } from 'kysely';
import { Pool } from 'pg';
import { DB } from '../types';
import { RetryDriver } from './driver';
import 'dotenv/config';

const CONNECTION_STRING = process.env.DATABASE_URL; // Default and Local

// In case you want to test Dev and Prod urls (need env vars set)
// const CONNECTION_STRING = process.env.DEV_URL; // DEV
// const CONNECTION_STRING = process.env.PROD_URL; // PROD

declare global {
  var __kysely_singleton: { pool: Pool; db: Kysely<DB> } | undefined;
  var __kysely_instance_count: number | undefined;
}

class KyselySingleton {
  private constructor() {}

  static getInstance() {
    if (globalThis.__kysely_singleton) {
      // console.log('[DB] Reusing existing Kysely instance');
      return globalThis.__kysely_singleton;
    }

    globalThis.__kysely_instance_count = (globalThis.__kysely_instance_count ?? 0) + 1;

    const pool = new Pool({
      connectionString: CONNECTION_STRING,
      max: 5,
      min: 1,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      maxUses: 7500,
      statement_timeout: 10000,
    });

    const db = new Kysely<DB>({
      dialect: {
        createAdapter: () => new PostgresAdapter(),
        createDriver: () => new RetryDriver(pool, {
          maxRetries: 3,
          initialDelayMs: 100,
          maxDelayMs: 2000,
        }),
        createIntrospector: (db) => new PostgresIntrospector(db),
        createQueryCompiler: () => new PostgresQueryCompiler(),
      },
    });

    // ...existing code...
    if (process.env.NODE_ENV === 'development') {
      let active = 0;
      pool.on('connect', () => {
        active++;
        console.log('[DB] connect, active:', active);
      });
      pool.on('remove', () => {
        active = Math.max(0, active - 1);
        console.log('[DB] remove, active:', active);
      });
    }

    globalThis.__kysely_singleton = { pool, db };
    return globalThis.__kysely_singleton;
  }
}

const singleton = KyselySingleton.getInstance();
export const db = singleton.db;
export const pool = singleton.pool;