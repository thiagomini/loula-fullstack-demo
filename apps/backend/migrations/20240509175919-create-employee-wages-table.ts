import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('employee_wages')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('employee_id', 'uuid', (col) => col.notNull())
    .addColumn('total_earned_wages', 'float8', (col) => col.notNull())
    .addColumn('currency', 'varchar', (col) => col.notNull())
    .addForeignKeyConstraint(
      'employee_id_fk',
      ['employee_id'],
      'employee',
      ['id'],
      (cb) => cb.onDelete('cascade'),
    )
    .addUniqueConstraint('employee_currency_unique', [
      'employee_id',
      'currency',
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('wage_access_request').execute();
}
