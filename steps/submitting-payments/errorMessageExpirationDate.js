import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { reviewPaymentPage } from "../../globalPagesSetup.js";
import { microSettle } from "../../utilities/BrowserUtility.js";

/* ---- Expiration Date input ---- */
When(
  "User types {string} into the Expiration Date field",
  async function (string) {}
);
/* ---- Expiration Date error visibility ---- */
Then("The Expiration Date field error should be visible", async function () {
  
});
/* ---- Expiration Date error text ---- */
Then(
  "The Expiration Date field error should contain {string}",
  async function (string) {
   
  }
);