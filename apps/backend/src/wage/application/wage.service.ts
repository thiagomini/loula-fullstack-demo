import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from 'kysely-codegen';
import { DATABASE } from '../../database/constants';
import { reduceWagesToCurrency } from '../domain/convert-currency';
import { Currency } from '../domain/currency';
import { Money } from '../domain/money';

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
      .selectAll()
      .where('employee_id', '=', employeeId)
      .execute();

    return reduceWagesToCurrency(employeeWages, requestedCurrency);
  }
}
