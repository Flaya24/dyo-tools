Feature: Epic 1 - Manager and bunches

  Scenario: Store of bunches
    Given my empty manager
    When I add 5 physical bunches and 2 virtual bunches
    Then I should have 7 bunches in my manager

  Scenario: No duplicated bunches
    Given my dominion manager
    When I add an already existing bunch
    Then I should see an error

  Scenario: Easy finding of bunch
    Given my dominion manager
    Then I should find my current hand
    And I should find 2 bunches with
      | key | hand |
    And I should find 5 bunches with
      | owner | PRIAM |
    And I should find 2 bunches with
      | cost | 4 |

  Scenario: Bunch removal
    Given my dominion manager
    When I remove my current hand
    Then I shouldn't find my current hand
    And I should find 1 bunches with
      | key | hand |

