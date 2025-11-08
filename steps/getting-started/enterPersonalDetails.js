import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import {
  startApplicationPage,
  paymentPlanPage,
} from "../../globalPagesSetup.js";
import { BrowserUtility } from "../../utilities/BrowserUtility.js";

/* ========== AC1: fields present & required ========== */
Then("The First Name field should be present and required", async function () {
  await expect(startApplicationPage.firstNameInputBox).toBeVisible();
  expect(
    await BrowserUtility.isRequired(startApplicationPage.firstNameInputBox)
  ).toBe(true);
});

Then("The Last Name field should be present and required", async function () {
  await expect(startApplicationPage.lastNameInputBox).toBeVisible();
  expect(
    await BrowserUtility.isRequired(startApplicationPage.lastNameInputBox)
  ).toBe(true);
});

Then(
  "The Email Address field should be present and required",
  async function () {
    await expect(startApplicationPage.emailInputBox).toBeVisible();
    expect(
      await BrowserUtility.isRequired(startApplicationPage.emailInputBox)
    ).toBe(true);
  }
);

Then("The Phone field should be present and required", async function () {
  await expect(startApplicationPage.phoneNumberInputBox).toBeVisible();
  expect(
    await BrowserUtility.isRequired(startApplicationPage.phoneNumberInputBox)
  ).toBe(true);
});

/* ========== AC1c: Email format validity (Scenario Outline) ========== */
When('I type "{word}" into the Email Address field', async function (value) {
  await BrowserUtility.typeAndBlur(startApplicationPage.emailInputBox, value);
});

Then(
  "The Email Address field validity should be {word}",
  async function (word) {
    const expected = word === "true";
    await BrowserUtility.expectControlValidity(
      startApplicationPage.emailInputBox,
      expected
    );
  }
);

/* ========== AC1d: Phone numeric only (Scenario Outline) ========== */
When('I type "{word}" into the Phone field', async function (value) {
  this.lastPhoneRaw = value;

  const phone = startApplicationPage.phoneNumberInputBox;
  await phone.fill("");
  await phone.type(value);
  await phone.blur(); // trigger Angular validation/filters
  await this.page.waitForTimeout(50);

  this.lastPhoneActual = await phone.inputValue();
});

Then("The Phone field validity should be {word}", async function (word) {
  const expected = word === "true";
  const allDigits =
    /^\d+$/.test(this.lastPhoneActual) && this.lastPhoneActual.length > 0;
  const unchanged = this.lastPhoneActual === this.lastPhoneRaw;

  const computedValid = allDigits && unchanged;

  expect(computedValid).toBe(expected);
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
  await expect
    .poll(async () => await BrowserUtility.ngFormValid(this.page), {
      timeout: 2000,
    })
    .toBe(false);
});

Then("The form should be valid", async function () {
  await expect
    .poll(async () => await BrowserUtility.ngFormValid(this.page), {
      timeout: 2000,
    })
    .toBe(true);
});

When("I enter a valid First Name and Last Name", async function () {
  await startApplicationPage.firstNameInputBox.fill("Anna");
  await startApplicationPage.lastNameInputBox.fill("Virchenko");
  await startApplicationPage.lastNameInputBox.blur();
});

When("I enter a valid Email Address", async function () {
  await BrowserUtility.typeAndBlur(
    startApplicationPage.emailInputBox,
    "anna.virchenko@example.com"
  );
});

When("I enter a valid Phone", async function () {
  await BrowserUtility.typeAndBlur(
    startApplicationPage.phoneNumberInputBox,
    "2025550188"
  );
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

// Invalid form: clicking Next should keep us on Step 1
Then(
  "Clicking Next should keep me on Step {int}",
  async function (_stepNumber) {
    await expect(paymentPlanPage.chooseAPaymentPlanText).toBeHidden({
      timeout: 300,
    });

    await startApplicationPage.clickNextButton();

    await expect(startApplicationPage.firstNameInputBox).toBeVisible();
    await expect(paymentPlanPage.chooseAPaymentPlanText).toBeHidden({
      timeout: 300,
    });
  }
);

// Valid form: clicking Next should reveal Step 2
Then(
  "Clicking Next should take me to Step {int}",
  async function (_stepNumber) {
    await expect(paymentPlanPage.chooseAPaymentPlanText).toBeHidden({
      timeout: 300,
    });

    await startApplicationPage.clickNextButton();

    await expect(paymentPlanPage.chooseAPaymentPlanText).toBeVisible();
  }
);
