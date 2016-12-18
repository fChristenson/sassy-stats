Feature: List fonts and their usage
  In order to see how many fonts my Sass files have
  As a developer
  I want to run a command that logs out my fonts and how many times they are used

  Scenario: Log out fonts and the number of times they are used.
    Given I have a Sass file
      And the file has "fonts"
     When I run the program
     Then I should see how many times the "fonts" are used
  