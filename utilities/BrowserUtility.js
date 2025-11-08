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

  /**
   * Returns native validity when available, otherwise falls back
   * to common Angular / Mat markers on the element or its field container.
   *
   * @param {import('playwright').Locator} locator
   * @returns {Promise<boolean>}
   */
  static async controlIsValid(locator) {
    return await locator.evaluate((el) => {
      if (typeof el.checkValidity === "function") return el.checkValidity();

      const field =
        el.closest(".mat-mdc-form-field") || el.closest("mat-form-field");
      const take = (n) => n === true || n === "true";

      if (el.hasAttribute("aria-invalid"))
        return !take(el.getAttribute("aria-invalid"));
      if (field && field.hasAttribute("aria-invalid"))
        return !take(field.getAttribute("aria-invalid"));

      const cl = (node) =>
        (node && node.classList) || { contains: () => false };

      if (cl(el).contains("ng-invalid") || cl(field).contains("ng-invalid"))
        return false;
      if (cl(el).contains("ng-valid") || cl(field).contains("ng-valid"))
        return true;

      return true; // safest default
    });
  }

  /**
   * Angular form-level validity helper.
   *
   * @param {import('playwright').Page} page
   * @returns {Promise<boolean>}
   */
  static async ngFormValid(page) {
    const formEl = await page.$("form");
    if (!formEl) return true;
    return await formEl.evaluate((f) => {
      if (f.hasAttribute("aria-invalid")) {
        const v = f.getAttribute("aria-invalid");
        if (v === "true") return false;
        if (v === "false") return true;
      }
      const cl = f.classList || { contains: () => false };
      if (cl.contains("ng-invalid")) return false;
      if (cl.contains("ng-valid")) return true;
      return f.checkValidity ? f.checkValidity() : true;
    });
  }

  /**
   * Type value into a field, blur it, and wait briefly for validators.
   *
   * @param {import('playwright').Locator} locator
   * @param {string} value
   */
  static async typeAndBlur(locator, value) {
    await locator.fill("");
    if (value) await locator.type(value);
    await locator.blur();
    await locator.page().waitForTimeout(120);
  }

  /**
   * Poll-based assertion for control validity.
   *
   * @param {import('playwright').Locator} locator
   * @param {boolean} expected
   */
  static async expectControlValidity(locator, expected) {
    await expect
      .poll(async () => await BrowserUtility.controlIsValid(locator), {
        timeout: 4000,
        intervals: [120, 200, 300, 500, 900, 1200],
      })
      .toBe(expected);
  }

  /**
   * Checks if an input element has the "required" attribute.
   *
   * @param {import('playwright').Locator} locator
   * @returns {Promise<boolean>}
   */
  static async isRequired(locator) {
    return await locator.evaluate((el) => !!el.required);
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
