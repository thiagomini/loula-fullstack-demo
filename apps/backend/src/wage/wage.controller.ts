import { Controller, Get, Headers, Inject, Query } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from 'kysely-codegen';
import { DATABASE } from '../database/constants';
import { USER_HEADER } from '../iam/headers';
import { Money } from './domain/money';
import { Currency } from './domain/currency';
import { Ratio } from './domain/ratio';
import { ZodValidationPipe } from '../utils/zod-validation.pipe';
import { currencySchema } from './currency.validation';

@Controller('wage')
export class WageController {
  constructor(
    @Inject(DATABASE)
    private readonly db: Kysely<DB>,
  ) {}

  @Get('balance')
  public async availableBalance(
    @Query('currency', new ZodValidationPipe(currencySchema))
    requestedCurrency: string,
    @Headers(USER_HEADER) userId?: string,
  ) {
    const employeeId = userId;

    const employeeWages = await this.db
      .selectFrom('employee_wages')
      .select(['currency', 'total_earned_wages'])
      .where('employee_id', '=', employeeId)
      .execute();

    const totalWagesInCurrency = employeeWages.reduce(
      (total, current) => {
        const currentMoney = new Money(
          current.total_earned_wages,
          current.currency as Currency,
        );
        if (currentMoney.isSameCurrencyOf(total)) {
          return total.plus(currentMoney);
        } else {
          return total.plus(
            currentMoney.to(total.currency, Ratio.dollarToPeso()),
          );
        }
      },
      new Money(0, requestedCurrency as Currency),
    );

    return {
      amount: totalWagesInCurrency.amount,
      currency: requestedCurrency,
    };
  }
}
