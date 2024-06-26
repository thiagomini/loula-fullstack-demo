import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { configureApplication } from '../src/app.config';
import { AppModule } from '../src/app.module';
import { DSL, createDSL } from './dsl/dsl.factory';
import { randomUUID } from 'crypto';

describe('Employee Available Balance (e2e)', () => {
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
      amount | currency | currencyRequested | balance
      ${1}   | ${'USD'} | ${'USD'}          | ${1}
      ${1}   | ${'USD'} | ${'ARS'}          | ${100}
      ${0}   | ${'USD'} | ${'USD'}          | ${0}
      ${0}   | ${'USD'} | ${'ARS'}          | ${0}
      ${100} | ${'ARS'} | ${'ARS'}          | ${100}
      ${100} | ${'ARS'} | ${'USD'}          | ${1}
      ${0}   | ${'ARS'} | ${'ARS'}          | ${0}
      ${0}   | ${'ARS'} | ${'USD'}          | ${0}
    `(
      'Returns $balance when user has $amount $currency and requests $currencyRequested',
      async ({ amount, currency, currencyRequested, balance }) => {
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
          .availableBalance(
            { currency: currencyRequested },
            { userId: employeeId },
          )
          // Assert
          .expect(200, {
            amount: balance,
            currency: currencyRequested,
          });
      },
    );

    test.each`
      amountUSD | amountARS | currencyRequested | balance
      ${1}      | ${100}    | ${'USD'}          | ${2}
      ${1}      | ${1}      | ${'USD'}          | ${1.01}
      ${1}      | ${0}      | ${'USD'}          | ${1}
      ${0}      | ${0}      | ${'USD'}          | ${0}
      ${1}      | ${100}    | ${'ARS'}          | ${200}
      ${1}      | ${1}      | ${'ARS'}          | ${101}
      ${1}      | ${0}      | ${'ARS'}          | ${100}
      ${0}      | ${1}      | ${'ARS'}          | ${1}
      ${0}      | ${0}      | ${'ARS'}          | ${0}
    `(
      'Returns $balance when user has $amountUSD USD and $amountARS ARS and requests $currencyRequested',
      async ({ amountUSD, amountARS, currencyRequested, balance }) => {
        // Arrange
        const employeeId = randomUUID();
        await dsl.employee.createEmployee({ id: employeeId });
        await dsl.wage.createEmployeeWages([
          {
            employeeId,
            amount: amountUSD,
            currency: 'USD',
          },
          {
            employeeId,
            amount: amountARS,
            currency: 'ARS',
          },
        ]);

        // Act
        await dsl.wage
          .availableBalance(
            { currency: currencyRequested },
            { userId: employeeId },
          )
          // Assert
          .expect(200, {
            amount: balance,
            currency: currencyRequested,
          });
      },
    );
  });

  describe('error cases', () => {
    test('Returns 403 when user is not authenticated', async () => {
      await dsl.wage
        .availableBalance({ currency: 'USD' }, { userId: undefined })
        .expect(403);
    });

    test('Returns 400 when currency is not provided', async () => {
      const employeeId = randomUUID();
      await dsl.wage
        .availableBalance({ currency: undefined }, { userId: employeeId })
        .expect(400);
    });
  });
});
