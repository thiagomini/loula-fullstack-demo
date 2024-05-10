import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { configureApplication } from '../src/app.config';
import { AppModule } from '../src/app.module';
import { DSL, createDSL } from './dsl/dsl.factory';
import { randomUUID } from 'crypto';
import { RequestWageAccessParams } from './dsl/wage.dsl';

describe('Request Wage Access (e2e)', () => {
  let app: INestApplication;
  let dsl: DSL;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApplication(app);
    await app.init();
    dsl = createDSL(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('success cases', () => {
    test.todo('user request wage access when it has one currency');
    test.todo('user request wage access when it has both currencies');
  });

  describe('error cases', () => {
    test('Returns 403 when user is not authenticated', async () => {
      await dsl.wage
        .requestAccess({ currency: 'USD' } as RequestWageAccessParams, {
          userId: undefined,
        })
        .expect(403);
    });

    test('Returns 400 when currency is not provided', async () => {
      const employeeId = randomUUID();
      await dsl.wage
        .requestAccess({ currency: undefined } as RequestWageAccessParams, {
          userId: employeeId,
        })
        .expect(400);
    });

    test('Returns 400 when amount is not provided', async () => {
      const employeeId = randomUUID();
      await dsl.wage
        .requestAccess(
          { currency: 'USD', amount: undefined },
          { userId: employeeId },
        )
        .expect(400);
    });

    test('Returns 400 when amount is 0', async () => {
      const employeeId = randomUUID();
      await dsl.wage
        .requestAccess({ currency: 'USD', amount: 0 }, { userId: employeeId })
        .expect(400);
    });
  });
});
