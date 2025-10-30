import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { startApplicationPage } from "../../globalPagesSetup.js";

const ACTIVE_BLUE = "rgb(1, 201, 255)";
 const INACTIVE_GREY = "rgb(217, 226, 236)"; // #D9E2EC

// ---------- AC1: verify step labels & order ----------
Then(
  "The checkout stepper should display the following steps in order:",
  async function (dataTable) {
        const expected = dataTable.rows().map((r) => r[1].trim()); // [Start Application, Payment Plan, Review]

        const titles = page.locator(".step-title");
        await expect(titles).toHaveCount(3);

        await expect(titles.nth(0)).toHaveText(/^\s*Start Application\s*$/i);
        await expect(titles.nth(1)).toHaveText(/^\s*Payment\s*Plan\s*$/i);
        await expect(titles.nth(2)).toHaveText(/^\s*Review\s*$/i);
      }
    );

// ---------- AC2/AC3: verify active/inactive state via circle color ----------
Then(
  'The "Start Application" step should be active and blue',
  async function () {
    await expect(startApplicationPage.startApplicationStepCircle)
  .toHaveCSS("background-color", ACTIVE_BLUE);
  }
);

Then(
  "The following steps should be inactive and grey:",
  async function (dataTable) {
    const map = {
      "payment plan": startApplicationPage.paymentPlanStepCircle,
      "review": startApplicationPage.reviewStepCircle,
    };

    for (const [nameRaw] of dataTable.rows()) {
      const name = nameRaw.trim().toLowerCase();
      const circle = map[name];
      if (!circle) throw new Error(`Unknown step label: ${nameRaw}`);

      await expect(circle).toHaveCSS("border-color", INACTIVE_GREY);
      await expect(circle).toHaveCSS("color", INACTIVE_GREY);
    }
  }
);
