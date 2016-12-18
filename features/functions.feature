Feature: List functions and their usage
  In order to see how many functions my Sass files have
  As a developer
  I want to run a command that logs out my functions and how many times they are used

  Scenario: Log out functions and the number of times they are used.
    Given I have a Sass file
      And the file has "functions"
     When I run the program
     Then I should see how many times the "functions" are used
  