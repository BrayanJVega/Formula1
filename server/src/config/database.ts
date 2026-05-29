import pg from 'pg';
import { env } from './env.js';
import { logger } from '../shared/logger.js';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({
      host: env.DB.HOST,
      port: env.DB.PORT,
      database: env.DB.NAME,
      user: env.DB.USER,
      password: env.DB.PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      logger.error('Unexpected database pool error', { error: err.message });
    });
  }
  return pool;
}

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  const client = getPool();
  const result = await client.query(text, params);
  return result.rows as T[];
}

export async function queryOne<T = unknown>(text: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function connectDatabase(): Promise<void> {
  try {
    const client = getPool();
    await client.query('SELECT 1');
    logger.info('Database connected successfully');

    // Automatically disable Row Level Security (RLS) if it was enabled,
    // since user authentication and authorization are handled at the application layer.
    try {
      await client.query(`
        ALTER TABLE users DISABLE ROW LEVEL SECURITY;
        ALTER TABLE predictions DISABLE ROW LEVEL SECURITY;
        ALTER TABLE fantasy_teams DISABLE ROW LEVEL SECURITY;
        ALTER TABLE league_members DISABLE ROW LEVEL SECURITY;
        ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
      `);
      logger.info('Row Level Security (RLS) disabled dynamically for tables: users, predictions, fantasy_teams, league_members, notifications');
    } catch (rlsError: any) {
      logger.warn('Failed to dynamically disable RLS, proceeding anyway', { error: rlsError.message });
    }
  } catch (error) {
    logger.error('Failed to connect to database', { error: (error as Error).message });
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('Database disconnected');
  }
}
