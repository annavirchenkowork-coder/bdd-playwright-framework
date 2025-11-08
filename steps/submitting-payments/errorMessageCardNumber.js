import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { reviewPaymentPage } from "../../globalPagesSetup.js";
import { BrowserUtility } from "../../utilities/BrowserUtility.js";

/* === Typing card number & triggering validation === */
When("User types {string} into the Card Number field", async function (value) {
  await BrowserUtility.fillStripeInput(
    reviewPaymentPage.cardNumberInput,
    value
  );
});

When("User checks the Terms and Conditions checkbox", async function () {
  await reviewPaymentPage.clickTermsAndConditionsCheckbox();
});

/* === Assertions on the error below the card number === */
Then("The Card Number field error should be visible", async function () {
  await expect(reviewPaymentPage.cardNumberErrorMessage).toBeVisible();
});

Then(
  "The Card Number field error should contain {string}",
  async function (text) {
    await expect(reviewPaymentPage.cardNumberErrorMessage).toContainText(text, {
      ignoreCase: true,
    });
  }
);
