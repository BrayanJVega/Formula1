import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPool } from '../../../config/database.js';
import { logger } from '../../../shared/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
  const pool = getPool();
  const schemaPath = path.resolve(__dirname, '../../../../../database/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  try {
    logger.info('Running database migrations...');
    await pool.query(schema);
    logger.info('Migrations completed successfully');
  } catch (error) {
    logger.error('Migration failed', { error: (error as Error).message });
    throw error;
  } finally {
    await pool.end();
  }
}

runMigrations().catch(() => process.exit(1));
