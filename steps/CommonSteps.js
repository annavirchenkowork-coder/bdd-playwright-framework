import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import {
  startApplicationPage,
  leftMainPage,
  paymentPlanPage,
  reviewPaymentPage,
  page,
} from "../globalPagesSetup.js";
import { productInfo } from "../utilities/qa-data-reader.js";

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
