Feature: Epic 3 - Manager and Scopes

  Scenario: Scope configuration
    Given my dominion manager
    Then I should have 7 scopes in my manager
    And I should have 9 bunches in my scope "supply"

  Scenario: Adding bunch into a scope
    Given my dominion manager
    When I add a new trash pile with 2 already existing elements into the scope "supply"
    Then I should have 10 bunches in my scope "supply"

  Scenario: No adding in non-declared scope
    Given my dominion manager
    When I add a new trash pile with 2 already existing elements into the scope "trash"
    Then I should see an error "invalid_scope"

  Scenario: Moving bunch through scopes
    Given my dominion manager
    When I move my current hand to the scope "supply"
    Then I should have 10 bunches in my scope "supply"
    And I should have 1 bunches in my scope "hand"



