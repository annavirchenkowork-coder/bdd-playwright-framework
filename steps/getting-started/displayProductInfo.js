import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { startApplicationPage } from "../../globalPagesSetup.js";
import { qaData } from "../../utilities/qa-data-reader.js";

// Small helper to pull a numeric value from a $-formatted string like "$400"
function moneyToNumber(text) {
  const n = Number(String(text).replace(/[^\d.]/g, ""));
  if (Number.isNaN(n)) throw new Error(`Cannot parse money from: ${text}`);
  return n;
}

// AC1
Then(
  "The product name should be visible on the information card",
  async function () {
   await expect(startApplicationPage.programNameOnInfoCard).toBeVisible();
  }
);

// AC2
Then(
  "The product name on the left header should match the information card title",
  async function () {
     await expect(startApplicationPage.programNameOnInfoCard).toHaveText(
       new RegExp(`^\\s*${qaData.productName}\\s*$`, "i")
     );
  }
);

// AC3
Then("The discounted price should be shown", async function () {
=  await expect(startApplicationPage.discountedPrice).toBeVisible();
});

Then(
  "The original price should be shown with strikethrough",
  async function () {
     const tag = await startApplicationPage.originalPrice.evaluate(
       (el) => el.tagName
     );
     expect(tag).toBe("S");
  }
);

Then(
  "The discounted price should equal the original price minus the upfront discount",
  async function () {
     const oneTime = qaData.prices.find(
       (p) => p.active && p.type === "one-time"
     );
     const expectedOriginal = oneTime.baseAmount;
     const expectedDiscounted = oneTime.upfrontDiscount
       ? oneTime.baseAmount - oneTime.upfrontDiscountAmount
       : oneTime.baseAmount;

     const originalText =
       await startApplicationPage.originalPrice.textContent();
     const discountedText =
       await startApplicationPage.discountedPrice.textContent();

     const original = moneyToNumber(originalText);
     const discounted = moneyToNumber(discountedText);

     expect(original).toBe(expectedOriginal);
     expect(discounted).toBe(expectedDiscounted);
  }
);

// AC4
Then(
  "The flexible payments plan availability text should be visible",
  async function () {
   await expect(
     startApplicationPage.flexiblePaymentsPlanAvailableText
   ).toBeVisible();
   await expect(
     startApplicationPage.flexiblePaymentsPlanAvailableText
   ).toHaveText(/flexible payments plan available/i);
  }
);

// AC5
Then(
  "The program start date should be visible and match test data",
  async function () {
    await expect(startApplicationPage.programStartDate).toBeVisible();
    // Escape any special regex chars in the date string
    const dateEscaped = qaData.startDate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    await expect(startApplicationPage.programStartDate).toHaveText(
      new RegExp(dateEscaped, "i")
    );
  }
);

// AC6
Then("The refund policy text should be visible", async function () {
    await expect(startApplicationPage.refundEndDate).toBeVisible();
});

Then(
  "The refund end date should be visible and match test data",
  async function () {
     const refundEscaped = qaData.refundDate.replace(
       /[.*+?^${}()|[\]\\]/g,
       "\\$&"
     );
     await expect(startApplicationPage.refundEndDate).toHaveText(
       new RegExp(refundEscaped, "i")
     );
  }
);
