import { Currency } from './currency';
import { Ratio } from './ratio';

export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: Currency,
  ) {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
  }

  to(targetCurrency: Currency, ratio: Ratio): Money {
    const newAmount =
      this.currency === ratio.from
        ? this.amount * ratio.value
        : this.amount / ratio.value;
    return new Money(newAmount, targetCurrency);
  }

  static dollar(amount: number): Money {
    return new Money(amount, 'USD');
  }

  static peso(amount: number): Money {
    return new Money(amount, 'ARS');
  }
}
