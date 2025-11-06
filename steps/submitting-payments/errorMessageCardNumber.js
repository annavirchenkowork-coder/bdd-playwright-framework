import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { reviewPaymentPage } from "../../globalPagesSetup.js";

/* small helper: type value into Stripe field */
async function fillStripeInput(locator, value) {
  await expect(locator).toBeVisible();
  await locator.fill(""); // clear any previous value
  await locator.type(value); // let Stripe auto-format the digits
}

When(
  "User types {string} into the Card Number field",
  async function (string) {}
);

When("User checks the Terms and Conditions checkbox", async function () {});

Then("The Card Number field error should be visible", async function () {});

Then(
  "The Card Number field error should contain {string}",
  async function (string) {}
);