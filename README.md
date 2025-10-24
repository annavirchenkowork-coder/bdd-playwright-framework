# 🧩 BDD Playwright Framework

**The BDD Playwright Framework** is a modular, end-to-end test automation project built to validate a secure and seamless self-enrollment and checkout process for online users.
It covers the complete workflow — from product selection and personal details entry to payment plan configuration, agreement confirmation, and final payment — ensuring consistency and quality across user flows.

## 📚 Table of Contents
1. [Prerequisites](#Prerequisites)
2. [Environment Setup](#environment-setup)
3. [Framework Structure and Usage](#framework-structure-and-usage)
4. [Project and Git Workflow](#project-and-git-workflow)<br>

## ⚙️ Prerequisites

Before you start, make sure the following tools are installed on your machine:
- **Node.js** (v18 or higher)
- **npm** (v6 or higher — included with Node.js)
- **Visual Studio Code** (or any IDE of your choice)
- **Git**

## 💻 Environment Setup
This project is fully set up and ready to run. To explore or test it on your own device:

### 1. Clone the Repository
```sh
git clone https://github.com/<your-username>/bdd-playwright-framework.git
```

### 2. Open the Project in Your IDE
Navigate to the cloned folder and open it in **VS Code** or your preferred IDE.

### 3. Install Dependencies
```sh
npm install
```

### 4. Configure Environment Variables
This framework uses sample credentials to run end-to-end tests on the demo environment.

If you’d like to run the tests locally, create a `.env` file in the project root with the following content:
```
SEP_QA_URL = https://qa.sep.tdtm.cydeo.com/taws
SEP_USERNAME = automation-user
SEP_PASSWORD = 123abc

CARD_NUMBER = 4242424242424242
EXPIRATION_DATE = 12/28
CVC = 368
ZIP_CODE = 22102
```

⚠️ These are demo credentials for the public test environment. No personal or sensitive data is involved.

The framework uses the dotenv package to load these variables securely into your local environment.

### 5. Run the Tests
To execute tests by specific tag or suite:
```sh
npm run test:tag
```
Or to run all available tests:
```sh
npm test
```

### 6. Generate an HTML Report
After the tests finish running, generate a report with:
```sh
npm run report
```
The report will be available under /reports and can be opened directly in your browser.

## 🧩 Framework Structure and Usage

### 🗂️ 1. `features` Folder
Holds all **Gherkin feature files.**
Each file has a unique tag, allowing specific scenarios to be executed via package.json scripts.

### 🪝 2. `hooks` Folder
Contains **Cucumber global** hooks and Playwright utilities for page and browser lifecycle management.

### 📄 3. `pages` Folder
Stores **Page Object Model (POM)** classes and web element locators.
Every page class should inherit from BasePage and be registered inside globalPagesSetup.js to maintain consistent page access across Playwright fixtures.

### 🧭 4. `steps` Folder
Includes all **step definitions** for the corresponding feature files.<br>
Each file’s name should match its feature file for better traceability.<br>

### ⚙️ 5. `cucumber.cjs` File
Configuration file for **CucumberJS**, specifying paths for steps, support files, formatters, and report output — enabling flexible BDD-style test execution.

### 📦 6. `package.json` File
Defines essential project metadata and dependencies:

- **`Project name`**:  bdd-playwright-framework
- **`Version`**: Marks the current version at "1.0.0"
- **`Entry point`**: Points to the main entry file of the project, "index.js"
- **`Scripts`**: Custom npm commands for test execution and report generation
- **`Dependencies`**: Playwright, Cucumber, dotenv, and reporting libraries
- **`Type`**: Specifies the module system, set to "module" for ES Module support

This configuration powers seamless integration between CucumberJS and Playwright, supporting readable BDD test flows and HTML report generation.<br>

## 🌱 Project and Git Workflow
This project follows a clean and collaborative branching model:
### 1. Clone the repo
```sh
git clone https://github.com/<your-username>/bdd-playwright-framework.git
```
### 2. Create a new branch (for enhancements, fixes, or new tests)
```sh
git checkout -b feature/your-feature-name
```
### 3. Commit your changes
```sh
git add .
git commit -m "Add new feature test for payment flow"
```

### 4. Push to GitHub
```sh
git push origin feature/your-feature-name
```

### 5. Open a Pull Request
Submit a PR to the develop branch once your feature or fix is ready for review.

## ✅ Final Note
This repository demonstrates a robust, scalable **BDD testing framework** powered by **Playwright** and **CucumberJS** — designed to showcase best practices in test automation architecture, reusable POM design, and structured Git workflow.

Run it, explore it, and enjoy clean, behavior-driven automation 🚀