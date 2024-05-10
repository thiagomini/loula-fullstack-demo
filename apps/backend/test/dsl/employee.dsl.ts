import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Insertable } from 'kysely';
import { Employee } from 'kysely-codegen';
import { DATABASE } from '../../src/database/constants';
import { Database } from '../../src/database/database.type';

export function employee(app: INestApplication) {
  return Object.freeze({
    createEmployee(data: Partial<Insertable<Employee>>) {
      const db = app.get<Database>(DATABASE);
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
