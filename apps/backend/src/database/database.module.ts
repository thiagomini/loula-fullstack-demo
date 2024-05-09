import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { databaseProvider } from './database.provider';
import { Kysely } from 'kysely';
import { DB } from 'kysely-codegen';
import { DATABASE } from './constants';

@Module({
  providers: [databaseProvider],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(
    @Inject(DATABASE)
    private readonly db: Kysely<DB>,
  ) {}
  async onModuleDestroy() {
    return await this.db.destroy();
  }
}
