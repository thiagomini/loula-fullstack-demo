import { Money } from './money';
import { Ratio } from './ratio';

export type Balance = {
  USD: Money;
  ARS: Money;
};

export function withdraw(
  fromBalance: Balance,
  withdrawMoney: Money,
  ratio: Ratio,
): Balance {
  const availableDollars = fromBalance.USD;
  const availablePesos = fromBalance.ARS;

  const canPayInDollars = availableDollars.canPay(
    withdrawMoney.to('USD', ratio),
  );
  const canPayInPesos = availablePesos.canPay(withdrawMoney.to('ARS', ratio));
  const canPayUsingBoth = availableDollars
    .plus(availablePesos.to('USD', ratio))
    .canPay(withdrawMoney.to('USD', ratio));

  if (canPayInDollars) {
    return {
      USD: availableDollars.subtract(withdrawMoney.to('USD', ratio)),
      ARS: availablePesos,
    };
  } else if (canPayInPesos) {
    return {
      USD: availableDollars,
      ARS: availablePesos.subtract(withdrawMoney.to('ARS', ratio)),
    };
  } else if (canPayUsingBoth) {
    const newBalance: Balance = {
      USD: Money.dollar(0),
      ARS: Money.peso(0),
    };
    const otherCurrencyMoney = withdrawMoney.is('USD')
      ? availablePesos
      : availableDollars;

    const sameCurrencyMoney = withdrawMoney.is('USD')
      ? availableDollars
      : availablePesos;

    const remainingAfterPayingInSameCurrency =
      withdrawMoney.subtract(sameCurrencyMoney);

    otherCurrencyMoney.currency === 'USD' ? 'dollar' : 'peso';

    return {
      ...newBalance,
      [otherCurrencyMoney.currency]: otherCurrencyMoney.subtract(
        remainingAfterPayingInSameCurrency.to(
          otherCurrencyMoney.currency,
          ratio,
        ),
      ),
    };
  }
}
