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
  
});

Then(
  "The original price should be shown with strikethrough",
  async function () {
    
  }
);

Then(
  "The discounted price should equal the original price minus the upfront discount",
  async function () {
    
  }
);

// AC4
Then(
  "The flexible payments plan availability text should be visible",
  async function () {
   
  }
);

// AC5
Then(
  "The program start date should be visible and match test data",
  async function () {
    
  }
);

// AC6
Then("The refund policy text should be visible", async function () {
  
});

Then(
  "The refund end date should be visible and match test data",
  async function () {
    
  }
);
