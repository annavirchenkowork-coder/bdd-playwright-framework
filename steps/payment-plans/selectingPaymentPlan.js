import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { paymentPlanPage, page } from "../../globalPagesSetup.js";

// Helpers to pick the right header + "summary" probe by plan name
function panelFor(name) {
  const k = name.toLowerCase();
  if (k.includes("upfront")) {
    return {
      header: paymentPlanPage.upfrontPaymentFrame,
      summaryProbe: paymentPlanPage.basePriceAmountUnderUpfront, // visible when expanded
    };
  }
  if (k.includes("installments")) {
    return {
      header: paymentPlanPage.installmentsPaymentFrame,
      summaryProbe: paymentPlanPage.basePriceAmountUnderInstallments,
    };
  }
  throw new Error(`Unknown plan: ${name}`);
}

/* ---------- Panel state checks ---------- */
// Prefer aria-expanded when present; otherwise fall back to summary visibility.

Then("The {string} plan panel should be expanded", async function (planName) {
  const { header, summaryProbe } = panelFor(planName);
  await expect(header).toBeVisible();

  const aria = await header.getAttribute("aria-expanded");
  if (aria !== null) {
    expect(aria).toBe("true");
  } else {
    await expect(summaryProbe).toBeVisible();
  }
});

Then("The {string} plan panel should be collapsed", async function (planName) {
  const { header, summaryProbe } = panelFor(planName);
  await expect(header).toBeVisible();

  const aria = await header.getAttribute("aria-expanded");
  if (aria !== null) {
    expect(aria).toBe("false");
  } else {
    await expect(summaryProbe).toBeHidden();
  }
});