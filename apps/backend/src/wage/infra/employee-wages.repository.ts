import { Inject, Injectable } from '@nestjs/common';
import { DATABASE } from '../../database/constants';
import { Database } from '../../database/database.type';
import { Balance } from '../domain/withdraw';

@Injectable()
export class EmployeeWagesRepository {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,
  ) {}

  public async findAllForEmployee(employeeId: string) {
    return await this.db
      .selectFrom('employee_wages')
      .selectAll()
      .where('employee_id', '=', employeeId)
      .execute();
  }

  public async updateEmployeeBalance(employeeId: string, newBalance: Balance) {
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
