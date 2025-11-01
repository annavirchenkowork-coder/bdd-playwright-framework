import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import {
  startApplicationPage,
  paymentPlanPage,
} from "../../globalPagesSetup.js";

/* ---------- tiny helpers ---------- */
async function formValid(page) {
  return await page.$eval("form", (f) => f.checkValidity());
}

async function typeAndBlur(locator, value) {
  await locator.fill(""); // reset
  if (value) await locator.type(value);
  await locator.blur(); // trigger validators
  await locator.page().waitForTimeout(50);
}

async function isRequired(locator) {
  return await locator.evaluate((el) => !!el.required);
}

async function controlValid(locator) {
  return await locator.evaluate((el) =>
    el.checkValidity ? el.checkValidity() : true
  );
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
  await typeAndBlur(startApplicationPage.emailInputBox, value);
});

Then(
  "The Email Address field validity should be {word}",
  async function (word) {
    const expected = word === "true";
    const isValid = await controlValid(startApplicationPage.emailInputBox);
    expect(isValid).toBe(expected);
  }
);

/* ========== AC1d: Phone numeric only (Scenario Outline) ========== */
When('I type "{word}" into the Phone field', async function (value) {
  await typeAndBlur(startApplicationPage.phoneNumberInputBox, value);
});

Then("The Phone field validity should be {word}", async function (word) {
  const expected = word === "true";
  const isValid = await controlValid(startApplicationPage.phoneNumberInputBox);
  expect(isValid).toBe(expected);
});

/* ========== AC2: Dropdown exists with standard options ========== */
Then("The {string} dropdown should be present", async function (_label) {
  await expect(startApplicationPage.howDidYouHearAboutUsDropDown).toBeVisible();
});

Then(
  "The dropdown should contain at least the options:",
  async function (dataTable) {
    await startApplicationPage.howDidYouHearAboutUsDropDown.click();
    const optionTexts = (
      await this.page.locator("mat-option span").allTextContents()
    ).map((t) => t.trim().toLowerCase());
    const want = dataTable
      .raw()
      .flat()
      .map((s) => s.trim().toLowerCase());
    for (const item of want) {
      expect(optionTexts).toContain(item);
    }
  }
);

/* ========== AC3: Next blocked until valid; then proceeds ========== */
Then("The form should be invalid", async function () {
  expect(await formValid(this.page)).toBe(false);
});

Then("The form should be valid", async function () {
  expect(await formValid(this.page)).toBe(true);
});

When("I enter a valid First Name and Last Name", async function () {
  await startApplicationPage.firstNameInputBox.fill("Anna");
  await startApplicationPage.lastNameInputBox.fill("Virchenko");
  await startApplicationPage.lastNameInputBox.blur();
});

When("I enter a valid Email Address", async function () {
  await typeAndBlur(
    startApplicationPage.emailInputBox,
    "anna.virchenko@example.com"
  );
});

When("I enter a valid Phone", async function () {
  await typeAndBlur(startApplicationPage.phoneNumberInputBox, "2025550188");
});

When(
  "I select {string} in the {string} dropdown",
  async function (option, dropdownLabel) {
    if (dropdownLabel.toLowerCase().includes("how did you hear")) {
      await startApplicationPage.selectHowDidYouHearAboutUs(option);
    } else {
      throw new Error(`Unknown dropdown: ${dropdownLabel}`);
    }
  }
);

/* --- Navigation outcomes: rely on visibility, not colors or disabled attr --- */

// Invalid form: clicking Next should keep us on Step 1 (Step 2 content remains hidden)
Then(
  "Clicking Next should keep me on Step {int}",
  async function (_stepNumber) {
    // sanity: Step 2 content is hidden first
    await expect(paymentPlanPage.chooseAPaymentPlanText).toBeHidden({
      timeout: 300,
    });

    await startApplicationPage.clickNextButton();

    // still on Step 1:
    await expect(startApplicationPage.firstNameInputBox).toBeVisible();
    await expect(paymentPlanPage.chooseAPaymentPlanText).toBeHidden({
      timeout: 300,
    });
  }
);

// Valid form: clicking Next should reveal Step 2 (Step 2 content becomes visible)
Then(
  "Clicking Next should take me to Step {int}",
  async function (_stepNumber) {
    // precondition: Step 2 unique element is hidden
    await expect(paymentPlanPage.chooseAPaymentPlanText).toBeHidden({
      timeout: 300,
    });

    await startApplicationPage.clickNextButton();

    // now Step 2 is visible; Step 1 control can be hidden (or not focused)
    await expect(paymentPlanPage.chooseAPaymentPlanText).toBeVisible();

  }
);
