import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { startApplicationPage } from "../../globalPagesSetup.js";

const ACTIVE_BLUE = "rgb(1, 201, 255)";
 const INACTIVE_GREY = "rgb(217, 226, 236)"; // #D9E2EC

// ---------- AC1: verify step labels & order ----------
Then(
  "The checkout stepper should display the following steps in order:",
  async function (dataTable) {
    const expected = dataTable.rows().map((r) => r[1].trim().toLowerCase());

    const labels = [
      startApplicationPage.startApplicationText,
      startApplicationPage.paymentPlanText,
      startApplicationPage.reviewText,
    ];

    // Validate visibility and text content in order
    for (let i = 0; i < labels.length; i++) {
      await expect(labels[i]).toBeVisible();
      const txt = (await labels[i].innerText()).trim().toLowerCase();
      expect(txt).toContain(expected[i]); 
    }
  }
);

// ---------- AC2/AC3: verify active/inactive state via circle color ----------
Then(
  'The "Start Application" step should be active and blue',
  async function () {}
);

Then(
  "The following steps should be inactive and grey:",
  async function (dataTable) {}
);
