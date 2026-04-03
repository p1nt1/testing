# 🎭 Sauce Demo Test Automation - Setup & Run Guide

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** 

---

## ⚡ Quick Setup

```bash
# 1. Clone/navigate to project
cd testing

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. You're ready! 🎉
```

---

## 🚀 Running Tests

### Basic Commands:

```bash
# Run all tests
npm test

# Run tests in UI mode (recommended for debugging)
npm run test:ui

# Run tests with visible browser
npm run test:headed
```

### Run Specific Tests:

```bash
# Run specific test file
npm run test specs/login.spec.ts

# Run specific test by name
npm run test -- -g "should login successfully"

# Run on specific browser
npm run test specs/cart.spec.ts -- --project=chromium
```

### Visual Testing:

```bash
# Create baseline screenshots (first time only)
npm run test:visual:update

# Run visual regression tests
npm run test:visual
```

### View Results:

```bash
# Show HTML report
npm run report
```
---

## 📊 Project Structure

```
tests/
├── fixtures/          # Test data (users, products, checkout)
├── pages/             # Page Object Model classes
├── specs/             # Test files (.spec.ts)
├── types/             # TypeScript interfaces
└── utils/             # Helper functions
```

---

## 🎯 Example: Run Your First Test

```bash
# 1. Install
npm install
npx playwright install

# 2. Run tests in UI mode (best way to start)
npm run test:ui

# 3. Select a test file and watch it run!
npm run test filename.spec.ts
```


---

## 🐛 Known Issues

The test suite has discovered several bugs (documented with `test.fail()`):
- **CART-001**: Cart persists across users
- **ERROR-USER-001**: error_user can't add Fleece Jacket
- **ERROR-USER-002**: error_user can't add Bolt T-Shirt


