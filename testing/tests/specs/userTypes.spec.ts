import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';
import { users, products } from '../fixtures';

test.describe('User Types & Behavior Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    await loginPage.navigate();
  });

  test.describe('Error User Tests', () => {
    test('should login successfully as error_user', async () => {
      await loginPage.login(users.error);
      await inventoryPage.expectToBeOnInventoryPage();
    });

    // BUG: error_user cannot add Fleece Jacket to cart (known issue)
    test.fail('should be able to add Fleece Jacket as error_user', async () => {
      await loginPage.login(users.error);
      await inventoryPage.expectToBeOnInventoryPage();

      // This SHOULD work but doesn't due to a bug with error_user
      await inventoryPage.addProductToCart(products.fleeceJacket);
      await inventoryPage.expectCartBadgeCount(1);

      // Once this bug is fixed, remove test.fail() and this test will pass
    });

    // BUG: error_user cannot add Bolt T-Shirt to cart (known issue)
    test.fail('should be able to add Bolt T-Shirt as error_user', async () => {
      await loginPage.login(users.error);
      await inventoryPage.expectToBeOnInventoryPage();

      // This SHOULD work but doesn't due to a bug with error_user
      await inventoryPage.addProductToCart(products.boltTShirt);
      await inventoryPage.expectCartBadgeCount(1);

      // Once this bug is fixed, remove test.fail() and this test will pass
    });

    test('should verify which products error_user CAN add to cart', async () => {
      await loginPage.login(users.error);
      await inventoryPage.expectToBeOnInventoryPage();

      // Backpack - works
      await inventoryPage.addProductToCart(products.backpack);
      await inventoryPage.expectCartBadgeCount(1);

      // Bike Light - works
      await inventoryPage.addProductToCart(products.bikeLight);
      await inventoryPage.expectCartBadgeCount(2);
    });

    test('should navigate through checkout with working products as error_user', async () => {
      await loginPage.login(users.error);
      await inventoryPage.expectToBeOnInventoryPage();

      // Use a product that works for error_user
      await inventoryPage.addProductToCart(products.backpack);
      await inventoryPage.goToCart();
      await cartPage.expectToBeOnCartPage();
      await cartPage.expectCartItemCount(1);
    });
  });

  test.describe('Visual User Tests', () => {
    test('should login successfully as visual_user', async () => {
      await loginPage.login(users.visual);
      await inventoryPage.expectToBeOnInventoryPage();
    });

    test('should display products with potential visual differences', async ({ page }) => {
      await loginPage.login(users.visual);
      await inventoryPage.expectToBeOnInventoryPage();

      // visual_user sees products but might have visual inconsistencies
      const productCount = await inventoryPage.getProductCount();
      expect(productCount).toBe(6);

      // Check that product images exist (even if they might be different)
      const productImages = page.locator('.inventory_item_img img');
      await expect(productImages).toHaveCount(6);
    });

    test('should add products to cart as visual_user', async () => {
      await loginPage.login(users.visual);
      await inventoryPage.expectToBeOnInventoryPage();

      await inventoryPage.addProductToCart(products.backpack);
      await inventoryPage.expectCartBadgeCount(1);
    });

    test('should complete checkout flow as visual_user', async () => {
      await loginPage.login(users.visual);
      await inventoryPage.expectToBeOnInventoryPage();

      await inventoryPage.addProductToCart(products.backpack);
      await inventoryPage.goToCart();

      await cartPage.expectToBeOnCartPage();
      await cartPage.expectCartItemCount(1);
    });
  });

  test.describe('Problem User Tests', () => {
    test('should login successfully as problem_user', async () => {
      await loginPage.login(users.problem);
      await inventoryPage.expectToBeOnInventoryPage();
    });

    test('should experience issues with product images as problem_user', async ({ page }) => {
      await loginPage.login(users.problem);
      await inventoryPage.expectToBeOnInventoryPage();

      // Images might all be the same (dog image) for problem_user
      const productImages = page.locator('.inventory_item_img img');
      await expect(productImages).toHaveCount(6);

    });

    test('should have cart functionality working as problem_user', async () => {
      await loginPage.login(users.problem);
      await inventoryPage.expectToBeOnInventoryPage();

      await inventoryPage.addProductToCart(products.backpack);
      await inventoryPage.expectCartBadgeCount(1);

      await inventoryPage.goToCart();
      await cartPage.expectCartItemCount(1);
    });
  });

  test.describe('Performance User Tests', () => {
    test('should login successfully as performance_glitch_user', async () => {
      await loginPage.login(users.performance);
      // Note: This user experiences performance delays
      await inventoryPage.expectToBeOnInventoryPage();
    });

    test('should handle slow page loads as performance_glitch_user', async () => {
      await loginPage.login(users.performance);
      await inventoryPage.expectToBeOnInventoryPage();

      // All operations work but may be slower
      await inventoryPage.addProductToCart(products.backpack);
      await inventoryPage.expectCartBadgeCount(1);
    });
  });
});

