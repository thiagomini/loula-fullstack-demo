import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import { DATABASE } from './constants';
import { DatabaseModule } from './database.module';
import { Database } from './database.type';

describe('Database Module', () => {
  let testingModule: TestingModule;
  beforeEach(async () => {
    testingModule = await createModule();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  test('provides a DB instance', async () => {
    const db = testingModule.get(DATABASE);
    expect(db).toBeTruthy();
    expect(db).toBeInstanceOf(Kysely);
  });

  test('Initializes DB connection', async () => {
    // Arrange
    const newModule = await createModule();
    const db = testingModule.get<Database>(DATABASE);

    // Act
    await newModule.close();

    // Assert
    await expect(db.selectFrom('employee').execute()).resolves.toEqual(
      expect.any(Array),
    );
  });
});

async function createModule() {
  return await Test.createTestingModule({
    imports: [DatabaseModule],
  }).compile();
}
