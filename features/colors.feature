Feature: List colors and their usage
  In order to see how many colors my Sass files have
  As a developer
  I want to run a command that logs out my colors and how many times they are used

  Scenario: Log out colors and the number of times they are used.
    Given I have a Sass file
      And the file has "colors"
     When I run the program
     Then I should see how many times the "colors" are used
  