Feature: List mixins and their usage
  In order to see how many mixins my Sass files have
  As a developer
  I want to run a command that logs out my mixins and how many times they are used

  Scenario: Log out mixins and the number of times they are used.
    Given I have a Sass file
      And the file has "mixins"
     When I run the program
     Then I should see how many times the "mixins" are used
  