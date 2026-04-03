import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { users } from '../fixtures';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigate();
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Swag Labs/);
  });

  test('should login successfully with valid credentials', async () => {
    await loginPage.login(users.standard);
    await inventoryPage.expectToBeOnInventoryPage();
  });

  test('should show error with invalid username', async () => {
    await loginPage.loginWithCredentials('invalid_user', users.standard.password);
    await loginPage.expectErrorMessage('Username and password do not match');
  });

  test('should show error with invalid password', async () => {
    await loginPage.loginWithCredentials(users.standard.username, 'wrong_password');
    await loginPage.expectErrorMessage('Username and password do not match');
  });

  test('should show error for locked out user', async () => {
    await loginPage.login(users.locked);
    await loginPage.expectErrorMessage('Sorry, this user has been locked out');
  });

  test('should show error when username is empty', async () => {
    await loginPage.fillPassword(users.standard.password);
    await loginPage.clickLogin();
    await loginPage.expectErrorMessage('Username is required');
  });

  test('should show error when password is empty', async () => {
    await loginPage.fillUsername(users.standard.username);
    await loginPage.clickLogin();
    await loginPage.expectErrorMessage('Password is required');
  });

  test('should not allow access to inventory page when logged out', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: You can only access \'/inventory.html\' when you are logged in');
  });

  test('should not allow access to cart page when logged out', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/cart.html');

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: You can only access \'/cart.html\' when you are logged in');
  });

  test('should not allow access to checkout pages when logged out', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/checkout-step-one.html');

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: You can only access \'/checkout-step-one.html\' when you are logged in');
  });
});

