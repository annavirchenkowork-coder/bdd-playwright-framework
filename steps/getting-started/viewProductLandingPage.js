import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { startApplicationPage } from "../../globalPagesSetup.js";
import { qaData } from "../../utilities/qa-data-reader.js";
import { LeftMainPage } from "../../pages/LeftMainPage.js";

// prefer a single instance per scenario
function left(ctx) {
  if (!ctx._leftMain) ctx._leftMain = new LeftMainPage(ctx.page);
  return ctx._leftMain;
}

/* @sep07-1: Secure checkout title */
Then(
  'The "Cydeo Secure checkout" title should be visible on the left panel',
  async function () {

  }
);

/* @sep07-2: Program name present and correct */
Then("The Program name should be visible on the left panel", async function () {

});

Then("The Program name should match the expected value", async function () {

});

/* @sep07-3: Left footer order */
Then(
  "The left footer should contain the items in order:",
  async function (dataTable) {

  }
);

/* @sep07-4: Right footer help line */
Then("The right footer help text should be visible", async function () {
 
});

Then(
  'The help text should contain {string}',
  async function (string) {
    
  }
);
