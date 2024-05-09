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
});
