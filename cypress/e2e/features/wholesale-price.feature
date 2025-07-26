Feature: Wholesale Price Verification

  Scenario: Complete Wholesale Price Verification Flow
    Given user visits the login page
    When Login with credentials
    Then user should be logged in successfully
    When go to shop page
    And Check the wholesale price on product name "Album"
    And Now add a "Album" product to the cart
    When verify cart price
    Then check if the wholesale price match with cart price
    And check if the both the prices matches with the expected wholesale price
