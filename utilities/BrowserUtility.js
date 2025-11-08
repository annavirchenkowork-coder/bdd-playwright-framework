import { expect } from "@playwright/test";
import { LeftMainPage } from "../pages/LeftMainPage.js";

export class BrowserUtility {
  /** Return one LeftMainPage per scenario (per World)*/
  static getLeftMain(ctx) {
    if (!ctx._leftMain) {
      ctx._leftMain = new LeftMainPage(ctx.page);
    }
    return ctx._leftMain;
  }

  /** Checks a checkbox and verifies it is checked. */
  static async check(locator) {
    await locator.check();
    await expect(locator).toBeChecked();
  }

  /** Unchecks a checkbox and verifies it is unchecked. */
  static async uncheck(locator) {
    await locator.uncheck();
    await expect(locator).not.toBeChecked();
  }

  /** Verifies page title. */
  static async verify_title(page, expected) {
    const actual = await page.title();
    expect(actual).toBe(expected);
    // or: await expect(page).toHaveTitle(expected);
  }

  /** Fill an input if visible, else throw. */
  static async enter_input(locator, input) {
    if (await locator.isVisible()) {
      await locator.fill(input);
    } else {
      throw new Error(`Element is not visible: ${locator}`);
    }
  }
}

/**
 * Waits a short time for UI/DOM transitions to settle.
 * Useful after expanding accordions, switching plans, etc.
 *
 * @param {import('playwright').Page} page
 * @param {number} [ms=250]
 */
export async function microSettle(page, ms = 250) {
  await page.waitForTimeout(ms);
}
