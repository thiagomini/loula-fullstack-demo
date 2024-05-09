import { Money } from './money';
import { Ratio } from './ratio';

describe('Money', () => {
  test('has amount and currency', () => {
    const tenDollars = new Money(10, 'USD');
    expect(tenDollars.amount).toBe(10);
    expect(tenDollars.currency).toBe('USD');
  });
  test('cannot be negative', () => {
    expect(() => new Money(-10, 'USD')).toThrow('Amount cannot be negative');
  });
  test('transforms from USD to ARS', () => {
    const tenDollars = new Money(10, 'USD');
    const dollarToPesoRatio = Ratio.dollarToPeso();

    const argentinianPesos = tenDollars.to('ARS', dollarToPesoRatio);

    expect(argentinianPesos).toEqual(Money.peso(1000));
  });
  test('transforms from ARS to USD', () => {
    const tenPesos = new Money(10, 'ARS');
    const dollarToPesoRatio = Ratio.dollarToPeso();

    const dollars = tenPesos.to('USD', dollarToPesoRatio);

    expect(dollars).toEqual(Money.dollar(0.1));
  });
  test('sums two amounts in the same currency', () => {
    const fiveDollars = Money.dollar(5);
    const tenDollars = Money.dollar(10);

    expect(fiveDollars.plus(tenDollars)).toEqual(Money.dollar(15));
  });
  test('cannot sum two amounts in different currencies', () => {
    const fiveDollars = Money.dollar(5);
    const tenPesos = Money.peso(10);

    expect(() => fiveDollars.plus(tenPesos)).toThrow(
      'Cannot sum different currencies',
    );
  });
  test('sum two floating point numbers', () => {
    const fiveDollars = Money.dollar(0.1);
    const tenDollars = Money.dollar(0.2);

    expect(fiveDollars.plus(tenDollars)).toStrictEqual(Money.dollar(0.3));
  });
});
