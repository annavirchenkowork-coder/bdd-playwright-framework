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
  /**
   * Cleans text content by trimming and collapsing whitespace.
   * @param {import('playwright').Locator} locator - Locator whose text to clean
   * @returns {Promise<string>} - Cleaned text content
   */
  static async cleanText(locator) {
    const raw = (await locator.textContent()) ?? "";
    return raw
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Converts a formatted money string like "$400" or "$1,200.50"
   * into a numeric value.
   *
   * @param {string} text
   * @returns {number}
   */
  static moneyToNumber(text) {
    const n = Number(String(text).replace(/[^\d.]/g, ""));
    if (Number.isNaN(n)) {
      throw new Error(`Cannot parse money from: ${text}`);
    }
    return n;
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
