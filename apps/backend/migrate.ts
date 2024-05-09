import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from 'kysely';
import path from 'path';
import { Pool } from 'pg';
import { promises as fs } from 'fs';

async function migrateToLatest() {
  console.log('Initializing migration...');

  const db = new Kysely({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: 'localhost',
        database: 'loula',
        user: 'postgres',
        password: 'password',
      }),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(
        `✅ migration "${it.migrationName}" was executed successfully`,
      );
    } else if (it.status === 'Error') {
      console.error(`⛔failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
  console.log('Migration Finished!');
}

migrateToLatest();
