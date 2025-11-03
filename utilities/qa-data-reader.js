import { readFileSync } from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

/**
 * @typedef {Object} PriceData
 * @property {boolean} active
 * @property {number} baseAmount
 * @property {string} type
 * @property {boolean} upfrontDiscount
 * @property {number} upfrontDiscountAmount
 * @property {boolean} allowCoupons
 * @property {number} couponDiscount
 * @property {number} [numberOfInstallments]
 */
class Price {
  /**
   * @param {PriceData} priceData
   */
  constructor({
    active,
    baseAmount,
    type,
    upfrontDiscount,
    upfrontDiscountAmount,
    allowCoupons,
    couponDiscount,
    numberOfInstallments,
  }) {
    this.active = active;
    this.baseAmount = baseAmount;
    this.type = type;
    this.upfrontDiscount = upfrontDiscount;
    this.upfrontDiscountAmount = upfrontDiscountAmount;
    this.allowCoupons = allowCoupons;
    this.couponDiscount = couponDiscount;
    this.numberOfInstallments = numberOfInstallments || null;
  }
}

/**
 * @typedef {Object} ProductData
 * @property {boolean} available
 * @property {string} productName
 * @property {string} productId
 * @property {boolean} teen
 * @property {string} type
 * @property {string} programId
 * @property {string} programCode
 * @property {string} programName
 * @property {string} startDate
 * @property {string} refundDate
 * @property {string} externalUrl
 * @property {string} terms
 * @property {PriceData[]} prices
 */
class Product {
  /** @type {Price[]} */
  prices;

  /**
   * @param {ProductData} productData
   */
  constructor({
    available,
    productName,
    productId,
    teen,
    type,
    programId,
    programCode,
    programName,
    startDate,
    refundDate,
    externalUrl,
    terms,
    prices,
  }) {
    this.available = available;
    this.productName = productName;
    this.productId = productId;
    this.teen = teen;
    this.type = type;
    this.programId = programId;
    this.programCode = programCode;
    this.programName = programName;
    this.startDate = startDate;
    this.refundDate = refundDate;
    this.externalUrl = externalUrl;
    this.terms = terms;
    this.prices = prices.map((price) => new Price(price));
  }
}

// --- Load Program Data from JSON ---
const dataPath = path.resolve("data/qa_data.json");
const rawData = readFileSync(dataPath, "utf-8");
export const qaData = JSON.parse(rawData);

// --- Generate User Test Data Dynamically ---
export function generateTestUser() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email({ provider: "example.com" }),
    phone: faker.string.numeric(10),
    howDidYouHear: "LinkedIn",
  };
}

export const productInfo = {
  firstName: "Anna",
  lastName: "Virchenko",
  email: "anna.virchenko@example.com",
  phone: "5551234567",
  howDidYouHear: "LinkedIn",
  startDate: qaData.startDate,
  refundDate: qaData.refundDate,
};
