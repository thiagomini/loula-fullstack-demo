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

  describe('isGreater', () => {
    test('true when amount is greater', () => {
      const fiveDollars = new Money(5, 'USD');
      const tenDollars = new Money(10, 'USD');

      expect(tenDollars.isGreaterThan(fiveDollars)).toBe(true);
    });
    test('false when amount is lower', () => {
      const fiveDollars = new Money(5, 'USD');
      const tenDollars = new Money(10, 'USD');

      expect(fiveDollars.isGreaterThan(tenDollars)).toBe(false);
    });
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
  test('transforms from USD to USD (no-op)', () => {
    const tenDollars = new Money(10, 'USD');
    const dollarToPesoRatio = Ratio.dollarToPeso();

    const argentinianPesos = tenDollars.to('USD', dollarToPesoRatio);

    expect(argentinianPesos).toEqual(Money.dollar(10));
  });
  describe('sum', () => {
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
      const tenCents = Money.dollar(0.1);
      const twentyCents = Money.dollar(0.2);

      expect(tenCents.plus(twentyCents)).toStrictEqual(Money.dollar(0.3));
    });
  });

  describe('subtraction', () => {
    test('subtracts two amounts in the same currency', () => {
      const fiveDollars = Money.dollar(5);
      const tenDollars = Money.dollar(10);

      expect(tenDollars.subtract(fiveDollars)).toEqual(Money.dollar(5));
    });
    test('cannot subtract two amounts in different currencies', () => {
      const fiveDollars = Money.dollar(5);
      const tenPesos = Money.peso(10);

      expect(() => fiveDollars.subtract(tenPesos)).toThrow(
        'Cannot subtract different currencies',
      );
    });
    test('subtracts two floating point numbers', () => {
      const tenCents = Money.dollar(0.1);
      const twentyCents = Money.dollar(0.2);

      expect(twentyCents.subtract(tenCents)).toStrictEqual(Money.dollar(0.1));
    });
  });
  test('is same currency', () => {
    expect(Money.dollar(1).isSameCurrencyOf(Money.dollar(2))).toBe(true);
    expect(Money.dollar(1).isSameCurrencyOf(Money.peso(1))).toBe(false);
  });
});
