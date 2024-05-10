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
    test.each`
      amount | currency | amountRequested | currencyRequested | approved
      ${1}   | ${'USD'} | ${1}            | ${'USD'}          | ${true}
      ${1}   | ${'USD'} | ${100}          | ${'ARS'}          | ${true}
      ${1}   | ${'USD'} | ${101}          | ${'ARS'}          | ${false}
    `(
      'requested is approved: $approved when user has $amount $currency and requests $amountRequested $currencyRequested',
      async ({
        amount,
        currency,
        amountRequested,
        currencyRequested,
        approved,
      }) => {
        // Arrange
        const employeeId = randomUUID();
        await dsl.employee.createEmployee({ id: employeeId });
        await dsl.wage.createEmployeeWage({
          employeeId,
          amount,
          currency,
        });

        // Act
        await dsl.wage
          .requestAccess(
            { currency: currencyRequested, amount: amountRequested },
            { userId: employeeId },
          )
          // Assert
          .expect(approved ? 201 : 400);
      },
    );
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
