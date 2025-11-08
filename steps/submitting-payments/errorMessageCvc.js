import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { reviewPaymentPage } from "../../globalPagesSetup.js";
import { BrowserUtility } from "../../utilities/BrowserUtility.js";

/* === Typing invalid / short CVC === */
When(
  "User types {string} into the Security Code field",
  async function (value) {
    await BrowserUtility.fillStripeInput(reviewPaymentPage.cvcInput, value);
  }
);

/* === Assertions on CVC error === */
Then("The Security Code field error should be visible", async function () {
  await expect(reviewPaymentPage.cardCVCErrorMessage).toBeVisible();
});

Then(
  "The Security Code field error should contain {string}",
  async function (msg) {
    await expect(reviewPaymentPage.cardCVCErrorMessage).toContainText(msg, {
      ignoreCase: true,
    });
  }
);
