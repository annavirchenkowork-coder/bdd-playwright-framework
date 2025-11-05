import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import {
  paymentPlanPage,
  startApplicationPage,
} from "../../globalPagesSetup.js";

/* ---- tiny helper to give CSS/DOM bindings a beat to settle after click/expand ---- */
async function microSettle(page, ms = 150) {
  await page.waitForTimeout(ms);
}

/* AC1: Next becomes enabled after selecting a plan */
Then(
  "the next button on step two should be disabled by default",
  async function () {}
);

When("user selects upfront payment plan", async function () {});

Then("the next button on step two should be enabled", async function () {});

/* AC3: Stepper colors */
Then("step one stepper should be green", async function () {});

Then("step two stepper should be blue", async function () {});

When("user clicks the next button on payment plan page", async function () {});

Then("step two stepper should be green", async function () {});

Then("step three stepper should be blue", async function () {});

/* AC5: Price summary appears for each plan */
Then("the upfront payment summary should be displayed", async function () {});

When("user selects installments payment plan", async function () {});

Then(
  "the installment payment summary should be displayed",
  async function () {}
);

/* AC6: Back button presence + navigation */
Then(
  "the back button is displayed on the payment plan page",
  async function () {}
);

Then(
  "the back button is enabled on the payment plan page",
  async function () {}
);

When("user clicks the back button on payment plan page", async function () {});

Then("step one stepper should be blue", async function () {});
