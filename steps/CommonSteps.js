import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import {
  startApplicationPage,
  paymentPlanPage,
  reviewPaymentPage,
} from "../globalPagesSetup.js";
import { productInfo } from "../utilities/qa-data-reader.js";
import { microSettle } from "../utilities/BrowserUtility.js";

Given("User is on the enrollment page", async function () {
  await startApplicationPage.login();
});

Given("User completed the start application step", async function () {
  await startApplicationPage.fillPersonalInformation({
    firstName: productInfo.firstName,
    lastName: productInfo.lastName,
    email: productInfo.email,
    phone: productInfo.phone,
    howDidYouHear: productInfo.howDidYouHear,
  });

  await startApplicationPage.clickNextButton();
  await expect(paymentPlanPage.chooseAPaymentPlanText).toBeVisible();
});

/**
 * Reusable path: Step 1 -> Step 2 -> Step 3 (Review)
 * - fills the Start Application form
 * - selects an upfront plan
 * - clicks Next to land on the Review page
 */
Given("User proceeds to the Review Payment page", async function () {
  // Ensure we’re on the enrollment page (if your Background doesn’t already do it)
  await startApplicationPage.login();

  // ---- Step 1: fill the form ----
  await startApplicationPage.firstNameInputBox.fill(productInfo.firstName);
  await startApplicationPage.lastNameInputBox.fill(productInfo.lastName);
  await startApplicationPage.emailInputBox.fill(productInfo.email);
  await startApplicationPage.phoneNumberInputBox.fill(productInfo.phone);
  await startApplicationPage.selectHowDidYouHearAboutUs(productInfo.howDidYouHear);

  // Proceed to Step 2
  await startApplicationPage.clickNextButton();
  await microSettle(this.page);

  // ---- Step 2: pick a plan and go Next ----
  await paymentPlanPage.selectPaymentPlan("upfront");
  await microSettle(this.page);
  await paymentPlanPage.clickNextButton();

  // ---- Step 3: wait for the Review page to be ready ----
  await microSettle(this.page);
  await reviewPaymentPage.paymentForm.waitFor({ state: "visible", timeout: 5000 });
});