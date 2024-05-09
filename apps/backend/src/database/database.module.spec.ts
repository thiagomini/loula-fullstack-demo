import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from './database.module';
import { DB } from 'kysely-codegen';
import { Kysely } from 'kysely';
import { DATABASE } from './constants';

describe('Database Module', () => {
  let testingModule: TestingModule;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  test('provides a DB instance', async () => {
    const db = testingModule.get<DB>(DATABASE);
    expect(db).toBeTruthy();
    expect(db).toBeInstanceOf(Kysely);
  });
});
