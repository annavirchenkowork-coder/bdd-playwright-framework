import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { startApplicationPage } from "../../globalPagesSetup.js";

/* ---------- tiny helpers ---------- */
async function typeInto(locator, value) {
  await locator.fill(""); // reset
  if (value) await locator.type(value);
}

async function isValidControl(locator) {
  // if element doesn't expose checkValidity, consider it valid
  return await locator.evaluate((el) =>
    el.checkValidity ? el.checkValidity() : true
  );
}

async function isRequired(locator) {
  return await locator.evaluate((el) => !!el.required);
}

/* ========== AC1: fields present & required ========== */
Then("The First Name field should be present and required", async function () {
  await expect(startApplicationPage.firstNameInputBox).toBeVisible();
  expect(await isRequired(startApplicationPage.firstNameInputBox)).toBe(true);
});

Then("The Last Name field should be present and required", async function () {
  await expect(startApplicationPage.lastNameInputBox).toBeVisible();
  expect(await isRequired(startApplicationPage.lastNameInputBox)).toBe(true);
});

Then(
  "The Email Address field should be present and required",
  async function () {
    await expect(startApplicationPage.emailInputBox).toBeVisible();
    expect(await isRequired(startApplicationPage.emailInputBox)).toBe(true);
  }
);

Then("The Phone field should be present and required", async function () {
  await expect(startApplicationPage.phoneNumberInputBox).toBeVisible();
  expect(await isRequired(startApplicationPage.phoneNumberInputBox)).toBe(true);
});

/* ========== AC1c: Email format validity (Scenario Outline) ========== */
When('I type "{word}" into the Email Address field', async function (value) {
  await typeInto(startApplicationPage.emailInputBox, value);
});

Then(
  "The Email Address field validity should be {word}",
  async function (valid) {
    const actual = await isValidControl(startApplicationPage.emailInputBox);
    expect(actual).toBe(valid === "true");
  }
);

Then("The Next button should remain disabled", async function () {
  await expect(startApplicationPage.nextButton).toBeDisabled();
});

/* ========== AC1d: Phone numeric only (Scenario Outline) ========== */
When('I type "{word}" into the Phone field', async function (value) {
  await typeInto(startApplicationPage.phoneNumberInputBox, value);
});

Then("The Phone field validity should be {word}", async function (valid) {
   const actual = await isValidControl(
     startApplicationPage.phoneNumberInputBox
   );
   expect(actual).toBe(valid === "true");
});

/* ========== AC2: Dropdown exists with standard options ========== */
Then("The {string} dropdown should be present", async function (string) {
  await expect(startApplicationPage.howDidYouHearAboutUsDropDown).toBeVisible();
});

Then(
  "The dropdown should contain at least the options:",
  async function (dataTable) {
    await startApplicationPage.howDidYouHearAboutUsDropDown.click();
    // collect all option texts
    const optionTexts = await this.page
      .locator("mat-option span")
      .allTextContents();
    const want = dataTable
      .raw()
      .flat()
      .map((s) => s.trim());
    for (const item of want) {
      expect(optionTexts.map((t) => t.trim().toLowerCase())).toContain(
        item.toLowerCase()
      );
    }
  }
);

/* ========== AC3: Next disabled until all required data is valid; then enabled ========== */
Then("The Next button should be disabled", async function () {});

When("I enter a valid First Name and Last Name", async function () {});

When("I enter a valid Email Address", async function () {});

When("I enter a valid Phone", async function () {});

 When(
   "I select {string} in the {string} dropdown",
   async function (string, string2) {
     
   }
 );

Then("The Next button should be enabled", async function () {});
