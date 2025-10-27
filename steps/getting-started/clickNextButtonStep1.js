import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { startApplicationPage, leftMainPage } from "../../globalPagesSetup.js";
import { productInfo } from "../../utilities/qa-data-reader.js";

// ------------------------
// Step 1: Enter all valid information
// ------------------------
When(
  "User enters valid information in all required and optional fields",
  async function () {
    
  }
);

// ------------------------
// Step 2: Enter only required fields
// ------------------------
When(
  "User enters valid information in only the required fields",
  async function () {
    
  }
);

// ------------------------
// Step 3: Click Next Button
// ------------------------
When("User clicks the Next button on Step 1", async function () {
  
});

// ------------------------
// Step 4: Validate Stepper Indicators
// ------------------------
Then(
  "Step 1 stepper indicator should display as completed \\(green\\)",
  async function () {
   
  }
);

Then("Step 2 stepper indicator should be active \\(blue\\)", async function () {
    
});
