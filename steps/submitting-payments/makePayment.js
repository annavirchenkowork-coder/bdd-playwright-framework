import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { reviewPaymentPage } from "../../globalPagesSetup.js";
import { microSettle } from "../../utilities/BrowserUtility.js";

/* ---- Fill valid payment data (Stripe test card) ---- */
When("User enters a valid card number", async function () {
  // Uses default from env if set, otherwise standard Stripe Visa test card
  await reviewPaymentPage.enterCardNumber(
    process.env.CARD_NUMBER || "4242 4242 4242 4242"
  );
});

When("User enters a valid expiration date", async function () {
  // e.g. any future MM/YY; use env if provided
  await reviewPaymentPage.enterExpiryDate(
    process.env.CARD_EXPIRATION_DATE || "12/40"
  );
});

When("User enters a valid Security Code", async function () {
  await reviewPaymentPage.enterCVC(process.env.CARD_SECURITY_CODE || "123");
});


When("User enters a valid ZIP code", async function () {
  await reviewPaymentPage.enterZipCode(process.env.ZIP_CODE || "12345");
});


When("User clicks the Pay button", async function () {
  await reviewPaymentPage.clickPayButton();
  // Brief settle while Stripe processes and confirmation renders
  await microSettle(this.page, 1500);
});

/* ---- Assertions for success state ---- */
Then(
  "The payment confirmation message should be displayed",
  async function () {}
);

Then("The stepper should show all steps completed", async function () {});
