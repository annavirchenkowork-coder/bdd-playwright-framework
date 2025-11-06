import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { reviewPaymentPage } from "../../globalPagesSetup.js";

When(
  "User types {string} into the Security Code field",
  async function (string) {
    
  }
);

Then("The Security Code field error should be visible", async function () {
  
});

Then(
  "The Security Code field error should contain {string}",
  async function (string) {
   
  }
);
