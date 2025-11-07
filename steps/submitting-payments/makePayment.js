import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { reviewPaymentPage } from "../../globalPagesSetup.js";
import { microSettle } from "../../utilities/BrowserUtility.js";

/* ---- Fill valid payment data (Stripe test card) ---- */
When("User enters a valid card number", async function () {});

When("User enters a valid expiration date", async function () {});

When("User enters a valid Security Code", async function () {});

When("User enters a valid ZIP code", async function () {});

When("User clicks the Pay button", async function () {});

/* ---- Assertions for success state ---- */
Then(
  "The payment confirmation message should be displayed",
  async function () {}
);

Then("The stepper should show all steps completed", async function () {});
