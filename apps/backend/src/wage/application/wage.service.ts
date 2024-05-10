import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DATABASE } from '../../database/constants';
import { Database } from '../../database/database.type';
import { reduceWagesToCurrency } from '../domain/convert-currency';
import { Currency } from '../domain/currency';
import { Money } from '../domain/money';
import { RequestWageAccessDTO } from '../presentation/request-wage-access.dto';

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
    const employeeWages = await this.getEmployeeWagesInCurrency(
      employeeId,
      currency as Currency,
    );

    const requestedMoney = new Money(amount, currency as Currency);
    if (requestedMoney.isGreaterThan(employeeWages)) {
      throw new BadRequestException('Insufficient funds');
    }
  }
}
