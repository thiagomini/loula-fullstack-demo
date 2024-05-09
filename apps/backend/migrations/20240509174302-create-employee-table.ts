import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('employee')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('email', 'varchar', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('employee').execute();
}
