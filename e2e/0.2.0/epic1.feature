Feature: Epic 1 - Manager and bunches

  Scenario: Store of bunches
    Given my empty manager
    When I add 5 physical bunches and 2 virtual bunches
    Then I should have 7 bunches in my manager

  Scenario: No duplicated bunches
    Given my basic manager
    When I add an already existing bunch
    Then I should see an error

  Scenario: Easy finding of bunch
    Given my extended manager
    Then I should find a bunch by its id
    And I should find 3 bunch with key "deck"
    And I should find 2 bunches which have "Priam" as owner
    And I should find 2 bunches which have meta
      | visible | true |

