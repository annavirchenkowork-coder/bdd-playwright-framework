import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { reviewPaymentPage } from "../../globalPagesSetup.js";
import { microSettle } from "../../utilities/BrowserUtility.js";

/* ---- Expiration Date input ---- */
When(
  "User types {string} into the Expiration Date field",
  async function (value) {
    // Work directly inside the Stripe iframe via ReviewPaymentPage locators
    await reviewPaymentPage.expiryDateInput.fill("");
    await reviewPaymentPage.expiryDateInput.type(value);
    await microSettle(this.page, 150);
  }
);
/* ---- Expiration Date error visibility ---- */
Then("The Expiration Date field error should be visible", async function () {
  await expect(reviewPaymentPage.cardExpiryErrorMessage).toBeVisible();
});
/* ---- Expiration Date error text ---- */
Then(
  "The Expiration Date field error should contain {string}",
  async function (message) {
    await expect(reviewPaymentPage.cardExpiryErrorMessage).toContainText(
      message
    );
  }
);
