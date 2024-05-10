import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from 'kysely-codegen';
import { DATABASE } from '../../database/constants';
import { Currency } from '../domain/currency';
import { Money } from '../domain/money';
import { Ratio } from '../domain/ratio';

@Injectable()
export class WageService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Kysely<DB>,
  ) {}

  public async getEmployeeWagesInCurrency(
    employeeId: string,
    requestedCurrency: Currency,
  ): Promise<Money> {
    const employeeWages = await this.db
      .selectFrom('employee_wages')
      .select(['currency', 'total_earned_wages'])
      .where('employee_id', '=', employeeId)
      .execute();

    return employeeWages.reduce(
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
  }
}
