import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { startApplicationPage } from "../../globalPagesSetup.js";

const ACTIVE_BLUE = "rgb(1, 201, 255)";

// ---------- AC1: verify step labels & order ----------
Then(
  "The checkout stepper should display the following steps in order:",
  async function (dataTable) {}
);

// ---------- AC2/AC3: verify active/inactive state via circle color ----------
Then(
  'The "Start Application" step should be active and blue',
  async function () {}
);

Then(
  "The following steps should be inactive and grey:",
  async function (dataTable) {}
);
