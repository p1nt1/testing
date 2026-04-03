import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { users } from '../fixtures';

test.describe('Visual Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(users.standard);
  });

  // Desktop Visual Tests
  test.describe('Visual Regression Tests', () => {
    test('should match inventory page screenshot', async ({ page }) => {
      await expect(page).toHaveScreenshot('inventory-page-full.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match shopping cart badge with items', async ({ page }) => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

      const cartLink = page.locator('.shopping_cart_link');
      await expect(cartLink).toHaveScreenshot('cart-badge-with-items.png');
    });
  });

  // Mobile viewport visual tests
  test.describe('Mobile Visual Tests', () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

    test('should match mobile inventory page', async ({ page }) => {
      await expect(page).toHaveScreenshot('mobile-inventory-page.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });

  // Tablet viewport visual tests
  test.describe('Tablet Visual Tests', () => {
    test.use({ viewport: { width: 768, height: 1024 } }); // iPad

    test('should match tablet inventory page', async ({ page }) => {
      await expect(page).toHaveScreenshot('tablet-inventory-page.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });
});

