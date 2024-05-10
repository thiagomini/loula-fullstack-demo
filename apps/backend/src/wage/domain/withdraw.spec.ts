import { Money } from './money';
import { Ratio } from './ratio';
import { Balance, withdraw } from './withdraw';

describe('withdraw', () => {
  test('withdraws the requested amount in the same currency', () => {
    // Arrange
    const availableBalances: Balance = {
      USD: Money.dollar(10),
      ARS: Money.peso(0),
    };

    // Act
    const newBalances = withdraw(
      availableBalances,
      Money.dollar(5),
      Ratio.dollarToPeso(),
    );

    // Assert
    expect(newBalances).toEqual({
      USD: Money.dollar(5),
      ARS: Money.peso(0),
    });
  });
  test('withdraws the requested amount from a different currency', () => {
    // Arrange
    const availableBalances: Balance = {
      USD: Money.dollar(10),
      ARS: Money.peso(0),
    };

    // Act
    const newBalances = withdraw(
      availableBalances,
      Money.peso(100),
      Ratio.dollarToPeso(),
    );

    // Assert
    expect(newBalances).toEqual({
      USD: Money.dollar(9),
      ARS: Money.peso(0),
    });
  });
  test('withdraws the requested amount using both currencies', () => {
    // Arrange
    const availableBalances: Balance = {
      USD: Money.dollar(1),
      ARS: Money.peso(100),
    };

    // Act
    const newBalances = withdraw(
      availableBalances,
      Money.peso(200),
      Ratio.dollarToPeso(),
    );

    // Assert
    expect(newBalances).toEqual({
      USD: Money.dollar(0),
      ARS: Money.peso(0),
    });
  });
});
