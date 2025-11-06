import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { reviewPaymentPage } from "../../globalPagesSetup.js";

// tiny helper to interact with Stripe's iframe input
async function fillStripeInput(locator, value) {
  await expect(locator).toBeVisible();
  await locator.fill("");
  await locator.type(value); // keep typing to allow Stripe formatting
}

When(
  "User types {string} into the Security Code field",
  async function (value) {
    await fillStripeInput(reviewPaymentPage.cvcInput, value);
  }
);

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
