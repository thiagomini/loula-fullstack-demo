import { BadRequestException, Injectable } from '@nestjs/common';
import { reduceWagesToCurrency } from '../domain/convert-currency';
import { Currency } from '../domain/currency';
import { Money } from '../domain/money';
import { Ratio } from '../domain/ratio';
import { Balance, withdraw } from '../domain/withdraw';
import { EmployeeWagesRepository } from '../infra/employee-wages.repository';
import { RequestWageAccessDTO } from '../presentation/request-wage-access.dto';

@Injectable()
export class WageService {
  constructor(
    private readonly employeeWagesRepository: EmployeeWagesRepository,
  ) {}

  public async getEmployeeWagesInCurrency(
    employeeId: string,
    requestedCurrency: Currency,
  ): Promise<Money> {
    const employeeWages =
      await this.employeeWagesRepository.findAllForEmployee(employeeId);

    return reduceWagesToCurrency(employeeWages, requestedCurrency);
  }

  public async requestWageAccess(
    employeeId: string,
    { currency, amount }: RequestWageAccessDTO,
  ) {
    const employeeWages =
      await this.employeeWagesRepository.findAllForEmployee(employeeId);

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

    await this.employeeWagesRepository.updateEmployeeBalance(
      employeeId,
      newBalance,
    );
  }
}
