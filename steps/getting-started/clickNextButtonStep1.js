import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { startApplicationPage, leftMainPage } from "../../globalPagesSetup.js";
import { generateTestUser } from "../../utilities/qa-data-reader.js";

// ------------------------
// Step 1: Enter all valid information
// ------------------------
When(
  "User enters valid information in all required and optional fields",
  async function () {
    const user = generateTestUser();
    await startApplicationPage.fillPersonalInformation(user);
  }
);

// ------------------------
// Step 2: Enter only required fields
// ------------------------
When(
  "User enters valid information in only the required fields",
  async function () {
    const user = generateTestUser();
    await startApplicationPage.fillPersonalInformation({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      // intentionally no optional fields
    });
  }
);

// ------------------------
// Step 3: Click Next Button
// ------------------------
When("User clicks the Next button on Step 1", async function () {
  await startApplicationPage.clickNextButton();
});

// ------------------------
// Step 4: Validate Stepper Indicators
// ------------------------
Then(
  "Step 1 stepper indicator should display as completed green",
  async function () {
    await expect(startApplicationPage.startApplicationStepCircle).toHaveCSS(
      "background-color",
      "rgb(172, 245, 138)"
    );
  }
);

Then("Step 2 stepper indicator should be active blue", async function () {
  await expect(startApplicationPage.paymentPlanStepCircle).toHaveCSS(
    "background-color",
    "rgb(1, 201, 255)"
  );
});
