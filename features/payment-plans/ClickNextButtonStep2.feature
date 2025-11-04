@sep16
Feature: Click on the Next button on the Payment Plans page

    As a customer, I should be able to click the Next button on Step 2 after selecting a plan.

    # AC1: Clicking any plan should activate the Next button.
    # AC2: Clicking Next should display Step 3.
    # AC3: In the stepper, Steps 1 & 2 are green, Step 3 is blue on Step 3.
    # AC4: The payment component should be displayed.
    # AC5: A price summary should be displayed.
    # AC6: The Back button should be displayed.

    # Colors used by the stepper:
    #   Green: rgb(172, 245, 138)
    #   Blue : rgb(1, 201, 255)

    Background:
        Given User is on the enrollment page
        And user completed the start application step

    @sep16-1
    Scenario: Next button activates after selecting a plan
        Then the next button on step two should be disabled by default
        When user selects upfront payment plan
        Then the next button on step two should be enabled

    @sep16-2
    Scenario: Stepper colors update when proceeding to Step 3
        Then step one stepper should be green
        And step two stepper should be blue
        When user selects upfront payment plan
        And user clicks the next button on payment plan page
        Then step one stepper should be green
        And step two stepper should be green
        And step three stepper should be blue

    @sep16-3
    Scenario: Price summary is shown for each plan selection
        When user selects upfront payment plan
        Then the upfront payment summary should be displayed
        When user selects installments payment plan
        Then the installment payment summary should be displayed

    @sep16-4
    Scenario: Back button is present and navigates back to Step 1
        Then the back button is displayed on the payment plan page
        And the back button is enabled on the payment plan page
        When user clicks the back button on payment plan page
        Then step one stepper should be blue