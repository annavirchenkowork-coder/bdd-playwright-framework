import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { paymentPlanPage } from "../../globalPagesSetup.js";

/* small helper: normalize plan label */
const normPlan = (s) =>
  s.toLowerCase().includes("install") ? "installments" : "upfront";

/* ----- panel visible ----- */
Then("The {string} plan panel should be visible", async function (plan) {
  switch (normPlan(plan)) {
    case "upfront":
      await expect(paymentPlanPage.upfrontPaymentFrame).toBeVisible();
      break;
    case "installments":
      await expect(paymentPlanPage.installmentsPaymentFrame).toBeVisible();
      break;
  }
});

/* ----- first row text (title line) ----- */
Then(
  "The first row of the {string} plan should display {string}",
  async function (plan, expected) {
    switch (normPlan(plan)) {
      case "upfront": {
        const txt = (
          await paymentPlanPage.upfrontPaymentOption.innerText()
        ).trim();
        expect(txt).toBe(expected);
        break;
      }
      case "installments": {
        const txt = (
          await paymentPlanPage.installmentsPaymentOption.innerText()
        ).trim();
        expect(txt).toBe(expected);
        break;
      }
    }
  }
);

/* ----- second row text (price line) ----- */
Then(
  "The second row of the {string} plan should display {string}",
  async function (plan, expected) {
    switch (normPlan(plan)) {
      case "upfront": {
        // discount-price node renders: "$400 pay once"
        const txt = (
          await paymentPlanPage.upfrontPaymentAmount.innerText()
        ).trim();
        expect(txt).toBe(expected);
        break;
      }
      case "installments": {
        // discount-price node renders: "$100 per month"
        const txt = (
          await paymentPlanPage.installmentsPaymentAmount.innerText()
        ).trim();
        expect(txt).toBe(expected);
        break;
      }
    }
  }
);

/* ----- exact count of plan options (should be 1 each) ----- */
Then(
  "There should be exactly {int} {string} plan option",
  async function (count, plan) {
    const which = normPlan(plan);
    const actual =
      which === "upfront"
        ? await paymentPlanPage.upfrontPaymentOption.count()
        : await paymentPlanPage.installmentsPaymentOption.count();
    expect(actual).toBe(count);
  }
);

/* ----- coupons badge visible on each plan ----- */
Then(
  "The {string} plan should show a {string} control",
  async function (plan, controlText) {
    const which = normPlan(plan);
    const panel =
      which === "upfront"
        ? paymentPlanPage.upfrontPaymentFrame
        : paymentPlanPage.installmentsPaymentFrame;

    // scope inside the specific plan panel to avoid strict-mode conflicts
    const chip = panel.locator(".coupon-badge");

    await expect(chip).toHaveCount(1);
    await expect(chip.first()).toBeVisible();
    await expect(chip.first()).toHaveText(new RegExp(controlText, "i"));
  }
);
