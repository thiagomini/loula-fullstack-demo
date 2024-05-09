import { FactoryProvider, Scope } from '@nestjs/common';
import { DATABASE } from './constants';
import { Kysely, PostgresDialect } from 'kysely';
import { DB } from 'kysely-codegen';
import { Pool } from 'pg';

export const databaseProvider: FactoryProvider = {
  provide: DATABASE,
  useFactory() {
    return new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString:
            'postgresql://postgres:password@localhost:5432/loula',
        }),
      }),
    });
  },
  scope: Scope.DEFAULT,
};
