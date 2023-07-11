Feature: Epic 2 - Manager and Library

  Scenario: Store of all elements
    Given my dominion manager
    Then I should have 104 elements in my library

  Scenario: Autodetect already existing element
    Given my dominion manager
    When I add a new trash pile with 2 already existing elements into the scope "default"
    Then I should have 107 elements in my library

  Scenario: Library isn't a manager bunch
    Given my dominion manager
    Then I shouldn't find my library id into bunches

  Scenario: Auto adding new element in bunch
    Given my dominion manager
    When I add a new external card in my current hand
    Then I should have 105 elements in my library



