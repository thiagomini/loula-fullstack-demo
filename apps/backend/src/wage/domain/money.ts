import * as ExactCurrency from 'currency.js';
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

  plus(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot sum different currencies');
    }
    return new Money(
      new ExactCurrency(this.amount).add(other.amount).value,
      this.currency,
    );
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract different currencies');
    }
    return new Money(
      new ExactCurrency(this.amount).subtract(other.amount).value,
      this.currency,
    );
  }

  isSameCurrencyOf(other: Money): boolean {
    return this.currency === other.currency;
  }

  isGreaterThan(other: Money): boolean {
    return this.amount > other.amount;
  }

  static dollar(amount: number): Money {
    return new Money(amount, 'USD');
  }

  static peso(amount: number): Money {
    return new Money(amount, 'ARS');
  }
}
