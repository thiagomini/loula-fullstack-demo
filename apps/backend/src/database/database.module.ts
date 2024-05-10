import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { DATABASE } from './constants';
import { databaseProvider } from './database.provider';
import { Database } from './database.type';

@Module({
  providers: [databaseProvider],
  exports: [DATABASE],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,
  ) {}
  async onModuleDestroy() {
    return await this.db.destroy();
  }
}
