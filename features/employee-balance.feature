Feature: Get Employee Available Balance

  Each employee has a balance for each type of currency (USD or ARS). An employee
  available balance for a given currency is calculated based on the amount of each
  currency they have multiplied by their respective exchange ratios. The employee's
  wage data looks like the following:

  | employeeID | totalEarnedWages | currency |
  | "E01"      | 1200             | "USD"    |
  | "E02"      | 9500             | "ARS"    |
  | "E03"      | 800              | "USD"    |

  Background: 
    Given USD_ARS ratio is 100

  Scenario Outline: Available Balance when the user has a single type of currency
    Given the employee has <amount> in <currency>
    When they request for available balance in <currencyRequested>
    Then it should return <balance>

    Examples:
      | amount | currency | currencyRequested | balance |
      | 1      | "USD"    | "USD"             | 1       |
      | 1      | "USD"    | "ARS"             | 100     |
      | 0      | "USD"    | "ARS"             | 0       |
      | 0      | "USD"    | "USD"             | 0       |
      | 100    | "ARS"    | "ARS"             | 100     |
      | 100    | "ARS"    | "USD"             | 1       |
      | 0      | "ARS"    | "USD"             | 0       |
      | 0      | "ARS"    | "ARS"             | 0       |

  Scenario Outline: Available Balance when the user has a many types of currencies
    Given the employee has <amountUSD> in USD
    And the employee has <amountARS> in ARS
    When they request for available balance in <currencyRequested>
    Then it should return <balance>

    Examples:
      | amountUSD | amountARS | currencyRequested | balance |
      | 1         | 100       | "USD"             | 2       |
      | 1         | 1         | "USD"             | 1.1     |
      | 1         | 0         | "USD"             | 1       |
      | 0         | 0         | "USD"             | 0       |
      | 1         | 100       | "ARS"             | 200     |
      | 1         | 1         | "ARS"             | 101     |
      | 1         | 0         | "ARS"             | 100     |
      | 0         | 1         | "ARS"             | 1       |
      | 0         | 0         | "ARS"             | 0       |