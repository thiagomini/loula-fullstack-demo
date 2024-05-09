import { Currency } from './currency';

export class Ratio {
  constructor(
    public readonly from: Currency,
    public readonly to: Currency,
    public readonly value: number,
  ) {}

  static dollarToPeso(): Ratio {
    return new Ratio('USD', 'ARS', 100);
  }
}
