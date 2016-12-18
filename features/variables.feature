Feature: List variables and their usage
  In order to see how many variables my Sass files have
  As a developer
  I want to run a command that logs out my variables and how many times they are used

  Scenario: Log out variables and the number of times they are used.
    Given I have a Sass file
      And the file has "variables"
     When I run the program
     Then I should see how many times the "variables" are used
  