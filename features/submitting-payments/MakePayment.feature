@sep23
Feature: Make a payment with a valid card

    As a user, I want to successfully complete my payment
    so that my enrollment is confirmed.

    Background:
        Given User proceeds to the Review Payment page

    @sep23-1
    Scenario: Successful payment with a valid test card
        When User enters a valid card number
        And User enters a valid expiration date
        And User enters a valid Security Code
        And User enters a valid ZIP code
        And User checks the Terms and Conditions checkbox
        And User clicks the Pay button
        Then The payment confirmation message should be displayed
        And The stepper should show all steps completed

    #As a user, I want to be informed when payment cannot be processed
    #so that I can fix my card info before trying again.

    @sep23-2
    Scenario: Pay button stays disabled when Terms & Conditions are not accepted
        When User enters a valid card number
        And User enters a valid expiration date
        And User enters a valid Security Code
        And User enters a valid ZIP code
        Then The Pay button should be disabled

    @sep23-3
    Scenario: Invalid card number shows error and prevents successful payment
        When User types "4242 4242 4242 4246" into the Card Number field
        And User enters a valid expiration date
        And User enters a valid Security Code
        And User enters a valid ZIP code
        And User checks the Terms and Conditions checkbox
        And User clicks the Pay button
        Then The Card Number field error should contain "Your card number is invalid."
        And A system alert should appear with message "Something went wrong"
        And The payment confirmation message should NOT be displayed

    @sep23-4
    Scenario: Invalid ZIP code shows error and prevents successful payment
        When User enters a valid card number
        And User enters a valid expiration date
        And User enters a valid Security Code
        And User types "000" into the ZIP code field
        And User checks the Terms and Conditions checkbox
        And User clicks the Pay button
        Then The ZIP Code field error should contain "Your ZIP is invalid"
        And A system alert should appear with message "Something went wrong"
        And The payment confirmation message should NOT be displayed



