import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('wage_access_request')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('employee_id', 'uuid', (col) => col.notNull())
    .addColumn('requested_amount', 'float8', (col) => col.notNull())
    .addColumn('requested_currency', 'varchar', (col) => col.notNull())
    .addForeignKeyConstraint(
      'employee_id_fk',
      ['employee_id'],
      'employee',
      ['id'],
      (cb) => cb.onDelete('cascade'),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('wage_access_request').execute();
}
