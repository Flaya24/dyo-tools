Feature: Epic 1 - Manager and bunches

  Scenario: Store of bunches
    Given my empty manager
    When I add 5 physical bunches and 2 virtual bunches
    Then I should have 7 bunches in my manager

  Scenario: No duplicated bunches
    Given my solitaire manager
    When I add an already existing bunch
    Then I should see an error

  Scenario: Easy finding of bunch
    Given my bridge manager
    Then I should find my current hand
    And I should find 4 bunches with key "hand"
    And I should find 1 bunch which have "Priam" as owner
    And I should find 2 bunches which have meta
      | role | dummy,declarer |

  Scenario: Bunch removal
    Given my bridge manager
    When I removed hands and win stack from team 1
    Then I shouldn't find my current hand
    And I should find 2 bunches with key "hand"
    And I should have 5 bunches in my manager

