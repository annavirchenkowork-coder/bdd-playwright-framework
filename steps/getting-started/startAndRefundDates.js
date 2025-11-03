import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { startApplicationPage } from "../../globalPagesSetup.js";
import { productInfo } from "../../utilities/qa-data-reader.js";

/* ---------- tiny helpers (keep comparisons stable) ---------- */
// normalize text: trim, collapse spaces, remove non-breaking spaces
async function cleanText(locator) {
  const raw = (await locator.textContent()) ?? "";
  return raw
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ========== AC1: elements visible ========== */
Then("The Program Start Date is visible", async function () {
  await expect(startApplicationPage.programStartDate).toBeVisible();
});

Then("The Refund End Date is visible", async function () {
  await expect(startApplicationPage.refundEndDate).toBeVisible();
});

/* ========== AC2: values match expected test data ========== */
Then("The Program Start Date matches the expected value", async function () {
  const actual = await cleanText(startApplicationPage.programStartDate);
  const expected = String(productInfo.startDate).trim();
  expect(actual).toBe(expected);
});

Then("The Refund End Date matches the expected value", async function () {
  const actual = await cleanText(startApplicationPage.refundEndDate);
  const expected = String(productInfo.refundDate).trim();
  expect(actual).toBe(expected);
});
