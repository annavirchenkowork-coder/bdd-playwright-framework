import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { startApplicationPage } from "../../globalPagesSetup.js";
import { qaData } from "../../utilities/qa-data-reader.js";
import { BrowserUtility } from "../../utilities/BrowserUtility.js";

/* @sep07-1: Secure checkout title */
Then(
  'The "Cydeo Secure checkout" title should be visible on the left panel',
  async function () {
    await expect(BrowserUtility.getLeftMain(this).secureCheckout).toBeVisible();
  }
);

/* @sep07-2: Program name present and correct */
Then("The Program name should be visible on the left panel", async function () {
  await expect(BrowserUtility.getLeftMain(this).programName).toBeVisible();
});

Then("The Program name should match the expected value", async function () {
  const actual = (
    await BrowserUtility.getLeftMain(this).programName.innerText()
  ).trim();
  expect(actual).toBe(qaData.programName);
});

/* @sep07-3: Left footer order */
Then(
  "The left footer should contain the items in order:",
  async function (dataTable) {
    const expected = dataTable
      .raw()
      .flat()
      .map((s) => s.trim());

    const actual = [];

    if (
      await BrowserUtility.getLeftMain(this).cydeoImageAtLeftWindow.isVisible()
    ) {
      actual.push("CYDEO logo");
    }

    const linkTexts = await BrowserUtility.getLeftMain(
      this
    ).footerElements.allInnerTexts();

    actual.push(...linkTexts.map((t) => t.trim().replace(/\s+/g, " ")));

    expect(actual).toEqual(expected);
  }
);

/* @sep07-4: Right footer help line */
Then("The right footer help text should be visible", async function () {
  await expect(startApplicationPage.footer.first()).toBeVisible();
});

Then("The help text should contain {string}", async function (string) {
  await expect(startApplicationPage.footer.first()).toContainText(string);
});
