Feature: Request Wage Access

  Each employee can request early access to their wages. The request is approved
  if the employee has enough balance to afford for it - that is, the sum of earned
  wages multiplied by their respective convertion ratio. Wage access request data 
  looks like the following:

  | id | employee_id | requestedAmount | requestedCurrency | 
  |----|-------------|-----------------|-------------------|
  | 1  | 1           | 100             | 'USD'             |
  | 2  | 2           | 100             | 'ARS'             |
  | 3  | 1           | 1000            | 'USD'             |

  Background: 
    Given USD_ARS ratio is 100

  Scenario Outline: User Request Wage Access when it has one currency
    Given the employee has <amount> in <currency>
    When they request <amountRequested> in <currencyRequested>
    Then it should approve: <approved>

    Examples:
      | amount | currency | amountRequested | currencyRequested | approved |
      | 1      | "USD"    | 1               | "USD"             | true     |
      | 1      | "USD"    | 100             | "ARS"             | true     |
      | 1      | "USD"    | 101             | "ARS"             | false    |
      | 0      | "USD"    | 1               | "USD"             | false    |
      | 0      | "USD"    | 1               | "ARS"             | false    |
      | 100    | "ARS"    | 100             | "ARS"             | true     |
      | 100    | "ARS"    | 1               | "USD"             | true     |
      | 100    | "ARS"    | 2               | "USD"             | false    |
      | 0      | "ARS"    | 1               | "ARS"             | false    |
      | 0      | "ARS"    | 1               | "USD"             | false    |

  Scenario Outline: User Request Wage Access when it has both currencies
    Given the employee has <amountUSD>
    And the employee has <amountARS>
    When they request <amountRequested> in <currencyRequested>
    Then it should approve: <approved>

    Examples:
      | amountUSD | amountARS | amountRequested | currencyRequested | approved |
      | 1         | 1         | 1               | "USD"             | true     |
      | 1         | 1         | 1               | "ARS"             | true     |
      | 1         | 1         | 2               | "USD"             | false    |
      | 1         | 1         | 2               | "ARS"             | true     |
      | 1         | 1         | 2               | "USD"             | false    |
      | 0         | 0         | 1               | "USD"             | false    |
      | 0         | 0         | 1               | "ARS"             | false    |
      | 0         | 1         | 1               | "USD"             | false    |
      | 0         | 1         | 1               | "ARS"             | true     |
      | 0         | 100       | 1               | "USD"             | true     |

      
     

