import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import {
  startApplicationPage,
  paymentPlanPage,
} from "../../globalPagesSetup.js";

/* ---------- tiny helpers ---------- */
// Returns native validity if available; falls back to Angular/Mat hints.
async function controlIsValid(locator) {
  return await locator.evaluate((el) => {
    if (typeof el.checkValidity === "function") return el.checkValidity();

    // fallback – look at common Angular/Mat markers
    const field =
      el.closest(".mat-mdc-form-field") || el.closest("mat-form-field");
    const take = (n) => n === true || n === "true";
    if (el.hasAttribute("aria-invalid"))
      return !take(el.getAttribute("aria-invalid"));
    if (field && field.hasAttribute("aria-invalid"))
      return !take(field.getAttribute("aria-invalid"));

    const cl = (node) => (node && node.classList) || { contains: () => false };
    if (cl(el).contains("ng-invalid") || cl(field).contains("ng-invalid"))
      return false;
    if (cl(el).contains("ng-valid") || cl(field).contains("ng-valid"))
      return true;

    return true; // safest default
  });
}
// Angular form validity
async function ngFormValid(page) {
  const formEl = await page.$("form");
  if (!formEl) return true;
  return await formEl.evaluate((f) => {
    if (f.hasAttribute("aria-invalid")) {
      const v = f.getAttribute("aria-invalid");
      if (v === "true") return false;
      if (v === "false") return true;
    }
    const cl = f.classList || { contains: () => false };
    if (cl.contains("ng-invalid")) return false;
    if (cl.contains("ng-valid")) return true;
    return f.checkValidity ? f.checkValidity() : true;
  });
}

// small expectation helper to wait for Angular to flip state
async function expectNgValidity(locator, expected) {
  await expect
    .poll(async () => await ngControlValid(locator), {
      timeout: 4000, // a bit more generous
      intervals: [150, 250, 400, 600, 1000, 1600],
    })
    .toBe(expected);
}

// type + blur + tiny settle
async function typeAndBlur(locator, value) {
  await locator.fill("");
  if (value) await locator.type(value);
  await locator.blur();
  // small settle so input/blur handlers run
  await locator.page().waitForTimeout(120);
}

async function expectControlValidity(locator, expected) {
  await expect
    .poll(async () => await controlIsValid(locator), {
      timeout: 4000,
      intervals: [120, 200, 300, 500, 900, 1200],
    })
    .toBe(expected);
}

// Returns true when the control is VALID according to Angular/Mat
async function ngControlValid(locator) {
  // read on the element, then bubble to mat form-field if needed
  return await locator.evaluate((el) => {
    const hasTrue = (v) => v === true || v === "true";
    const hasFalse = (v) => v === false || v === "false";

    // 1) aria-invalid on the input itself
    if (el.hasAttribute("aria-invalid")) {
      const v = el.getAttribute("aria-invalid");
      if (hasTrue(v)) return false;
      if (hasFalse(v)) return true;
    }

    // 2) nearest Material container often carries the state
    const field =
      el.closest(".mat-mdc-form-field") ||
      el.closest("mat-form-field") ||
      el.parentElement;

    if (field) {
      if (field.hasAttribute("aria-invalid")) {
        const v = field.getAttribute("aria-invalid");
        if (hasTrue(v)) return false;
        if (hasFalse(v)) return true;
      }
      const cl = field.classList || { contains: () => false };
      if (cl.contains("ng-invalid") || cl.contains("mdc-text-field--invalid")) {
        return false;
      }
      if (cl.contains("ng-valid")) return true;
    }

    // 3) fall back to class markers on the input
    const cls = el.classList || { contains: () => false };
    if (cls.contains("ng-invalid") || cls.contains("mdc-text-field--invalid")) {
      return false;
    }
    if (cls.contains("ng-valid")) return true;

    // 4) final fallback to native validity if exposed
    return el.checkValidity ? el.checkValidity() : true;
  });
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
  await typeAndBlur(startApplicationPage.emailInputBox, value);
});

Then(
  "The Email Address field validity should be {word}",
  async function (word) {
    const expected = word === "true";
    await expectControlValidity(startApplicationPage.emailInputBox, expected);
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
    .poll(async () => await ngFormValid(this.page), { timeout: 2000 })
    .toBe(false);
});

Then("The form should be valid", async function () {
  await expect
    .poll(async () => await ngFormValid(this.page), { timeout: 2000 })
    .toBe(true);
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

    // now Step 2 is visible; Step 1 control can be hidden
    await expect(paymentPlanPage.chooseAPaymentPlanText).toBeVisible();
  }
);
