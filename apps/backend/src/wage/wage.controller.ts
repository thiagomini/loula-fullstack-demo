import { Controller, Get, Headers, Inject, Query } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from 'kysely-codegen';
import { DATABASE } from '../database/constants';
import { USER_HEADER } from '../iam/headers';

@Controller('wage')
export class WageController {
  constructor(
    @Inject(DATABASE)
    private readonly db: Kysely<DB>,
  ) {}

  @Get('balance')
  public async availableBalance(
    @Query('currency') requestedCurrency: string,
    @Headers(USER_HEADER) userId?: string,
  ) {
    const usdToArsRatio = 100;
    const employeeId = userId;

    const employeeWages = await this.db
      .selectFrom('employee_wages')
      .select(['currency', 'total_earned_wages'])
      .where('employee_id', '=', employeeId)
      .execute();

    const totalWagesInCurrency = employeeWages.reduce((total, current) => {
      if (current.currency === requestedCurrency) {
        return total + current.total_earned_wages;
      } else {
        if (requestedCurrency === 'USD' && current.currency === 'ARS') {
          return total + current.total_earned_wages / usdToArsRatio;
        } else {
          return total + current.total_earned_wages * usdToArsRatio;
        }
      }
    }, 0);

    return {
      amount: totalWagesInCurrency,
      currency: requestedCurrency,
    };
  }
}
