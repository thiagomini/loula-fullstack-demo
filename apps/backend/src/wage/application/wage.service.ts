import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DATABASE } from '../../database/constants';
import { Database } from '../../database/database.type';
import { reduceWagesToCurrency } from '../domain/convert-currency';
import { Currency } from '../domain/currency';
import { Money } from '../domain/money';
import { RequestWageAccessDTO } from '../presentation/request-wage-access.dto';
import { Ratio } from '../domain/ratio';
import { Balance, withdraw } from '../domain/withdraw';

@Injectable()
export class WageService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,
  ) {}

  public async getEmployeeWagesInCurrency(
    employeeId: string,
    requestedCurrency: Currency,
  ): Promise<Money> {
    const employeeWages = await this.db
      .selectFrom('employee_wages')
      .selectAll()
      .where('employee_id', '=', employeeId)
      .execute();

    return reduceWagesToCurrency(employeeWages, requestedCurrency);
  }

  public async requestWageAccess(
    employeeId: string,
    { currency, amount }: RequestWageAccessDTO,
  ) {
    const employeeWages = await this.db
      .selectFrom('employee_wages')
      .selectAll()
      .where('employee_id', '=', employeeId)
      .execute();

    const totalEarned = reduceWagesToCurrency(
      employeeWages,
      currency as Currency,
    );

    const requestedMoney = new Money(amount, currency as Currency);

    if (requestedMoney.isGreaterThan(totalEarned)) {
      throw new BadRequestException('Insufficient funds');
    }

    const balance: Balance = {
      USD: Money.dollar(
        employeeWages.find((w) => w.currency === 'USD')?.total_earned_wages,
      ),
      ARS: Money.peso(
        employeeWages.find((w) => w.currency === 'ARS')?.total_earned_wages,
      ),
    };

    const newBalance = withdraw(balance, requestedMoney, Ratio.dollarToPeso());

    await this.db.transaction().execute(async (trx) => {
      await trx
        .updateTable('employee_wages')
        .set('total_earned_wages', newBalance.USD.amount)
        .where('employee_id', '=', employeeId)
        .where('currency', '=', 'USD')
        .execute();

      await trx
        .updateTable('employee_wages')
        .set('total_earned_wages', newBalance.ARS.amount)
        .where('employee_id', '=', employeeId)
        .where('currency', '=', 'ARS')
        .execute();
    });
  }
}
