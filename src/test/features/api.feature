Feature: GET request
  A simple GET request test scenario.

  Scenario: A client makes a GET request for the API.
    Given I have the route <route>
    When I make a GET request
    Then It returns an {<object>}

    Examples:
      | route | result |
      |     / |        |
      
      