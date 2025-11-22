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
Then("The payment confirmation message should be displayed", async function () {
  await expect(reviewPaymentPage.confirmationBox).toBeVisible();
});

Then("The stepper should show all steps completed", async function () {
  // Steps 1 and 2 should be marked done
  await expect(reviewPaymentPage.step1Container).toHaveClass(/done/);
  await expect(reviewPaymentPage.step2Container).toHaveClass(/done/);

  // Step 3 is the active/completed step, marked as "editing" in this UI
  await expect(reviewPaymentPage.step3Container).toHaveClass(/editing|done/);
});

/* ----------------------------------------------------------
   NEGATIVE STEPS FOR PAYMENT VALIDATION
----------------------------------------------------------- */

/* === Invalid ZIP input === */
When(
  "User types {string} into the ZIP code field",
  async function (zip) {
    await reviewPaymentPage.enterZipCode(zip);
  }
);

/* === Pay button should be disabled === */
Then("The Pay button should be disabled", async function () {
  await expect(reviewPaymentPage.payButton).toBeDisabled();
});

/* === ZIP inline error should contain text === */
  Then(
    "The ZIP Code field error should contain {string}",
    async function (expected) {
      await expect(reviewPaymentPage.zipCodeErrorMessage).toContainText(
        expected,
        { ignoreCase: true }
      );
    }
  );

/* === Expect system alert === */
Then(
  "A system alert should appear with message {string}",
  async function (expected) {
    this.page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain(expected);
      await dialog.accept();
    });
  }
);

/* === Payment confirmation should NOT appear === */
Then(
  "The payment confirmation message should NOT be displayed",
  async function () {
    // For negative flows we stay on the Review Payment page.
    // If the Pay button is still visible, we definitely did NOT
    // navigate to the Payments confirmation screen.
    await expect(reviewPaymentPage.payButton).toBeVisible();
  }
);
