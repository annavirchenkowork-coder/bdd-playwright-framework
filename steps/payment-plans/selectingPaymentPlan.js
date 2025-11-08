import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { paymentPlanPage } from "../../globalPagesSetup.js";
import { BrowserUtility } from "../../utilities/BrowserUtility.js";

/* ---------- Panel state checks ---------- */
Then("The {string} plan panel should be expanded", async function (planName) {
  const { header, summaryProbe } = BrowserUtility.panelFor(
    planName,
    paymentPlanPage
  );
  await expect(header).toBeVisible();

  const aria = await header.getAttribute("aria-expanded");
  if (aria !== null) {
    expect(aria).toBe("true");
  } else {
    await expect(summaryProbe).toBeVisible();
  }
});

Then("The {string} plan panel should be collapsed", async function (planName) {
  const { header, summaryProbe } = BrowserUtility.panelFor(
    planName,
    paymentPlanPage
  );
  await expect(header).toBeVisible();

  const aria = await header.getAttribute("aria-expanded");
  if (aria !== null) {
    expect(aria).toBe("false");
  } else {
    await expect(summaryProbe).toBeHidden();
  }
});