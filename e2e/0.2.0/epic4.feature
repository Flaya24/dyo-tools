Feature: Epic 4 - Action and Events

  Scenario: Configuring action into the manager
    Given my dominion manager
    When I add a new action "trash"
    Then I should have 4 actions in my manager

  Scenario: No duplicated action
    Given my dominion manager
    When I add a new action "shuffle"
    Then I should see an error "action_key_conflict"

  Scenario: Shuffle my current deck
    Given my dominion manager
    And deal is done
    When I shuffle my current "deck"
    Then I should have copper,estate,copper,estate,copper at the top of my current deck

  Scenario: Drawing my first hand
    Given my dominion manager
    And deal is done
    When I draw my 5 cards hand
    Then I should have copper,estate,copper,estate,copper in my current hand

  Scenario: Playing a copper
    Given my dominion manager
    And deal is done
    When I draw my 5 cards hand
    And I play my first card Copper
    Then I should have 1 copper into my play zone
    And my player should have 1 coin for the turn

  Scenario: No triggering of action outside the restricted scope
    Given my dominion manager
    And deal is done
    When I shuffle my current "hand"
    Then I should see an error "invalid_action_scope"


