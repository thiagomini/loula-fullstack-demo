import { Selectable } from 'kysely';
import { Currency } from './currency';
import { Money } from './money';
import { Ratio } from './ratio';
import { EmployeeWages } from 'kysely-codegen';

export function reduceWagesToCurrency(
  employeeWages: Selectable<EmployeeWages>[],
  requestedCurrency: Currency,
): Money {
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
    new Money(0, requestedCurrency),
  );
}
