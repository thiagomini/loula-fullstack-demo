import { INestApplication } from '@nestjs/common';
import { Insertable, Kysely } from 'kysely';
import { DB, Employee } from 'kysely-codegen';
import { DATABASE } from '../../src/database/constants';
import { faker } from '@faker-js/faker';

export function employee(app: INestApplication) {
  return Object.freeze({
    createEmployee(data: Partial<Insertable<Employee>>) {
      const db = app.get<Kysely<DB>>(DATABASE);
      return db
        .insertInto('employee')
        .values({
          id: data.id,
          email: data.email ?? faker.internet.email(),
        })
        .executeTakeFirst();
    },
  });
}
