import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';
import { users, products } from '../fixtures';

test.describe('User Session & Cart Isolation Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  // BUG: Cart items persist across different user sessions
  // This is a CRITICAL security issue - user data is not properly isolated
  test.fail('should NOT persist cart items when switching between users', async () => {
    await loginPage.navigate();
    await loginPage.login(users.standard);
    await inventoryPage.expectToBeOnInventoryPage();

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    await inventoryPage.expectCartBadgeCount(2);

    await inventoryPage.logout();
    await loginPage.expectLoginButtonVisible();

    await loginPage.login(users.problem);
    await inventoryPage.expectToBeOnInventoryPage();

    await inventoryPage.expectCartBadgeNotVisible();

    await inventoryPage.goToCart();
    await cartPage.expectCartItemCount(0);
  });

  test('should maintain cart items for the same user after logout and login', async () => {
    await loginPage.navigate();
    await loginPage.login(users.standard);
    await inventoryPage.expectToBeOnInventoryPage();

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.logout();
    await loginPage.expectLoginButtonVisible();

    await loginPage.login(users.standard);
    await inventoryPage.expectToBeOnInventoryPage();

    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.goToCart();
    await cartPage.expectCartItemCount(1);
    await cartPage.expectItemName(products.backpack);
  });

  // BUG: Cart items persist across different user sessions
  test.fail('should isolate cart between performance and standard users', async () => {
    await loginPage.navigate();
    await loginPage.login(users.performance);
    await inventoryPage.expectToBeOnInventoryPage();

    await inventoryPage.addProductToCart(products.fleeceJacket);
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.logout();

    await loginPage.login(users.standard);
    await inventoryPage.expectToBeOnInventoryPage();

    await inventoryPage.expectCartBadgeNotVisible();
  });

  test('should clear cart when using reset app state', async () => {
    await loginPage.navigate();
    await loginPage.login(users.standard);
    await inventoryPage.expectToBeOnInventoryPage();

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    await inventoryPage.addProductToCart(products.boltTShirt);
    await inventoryPage.expectCartBadgeCount(3);

    await inventoryPage.resetAppState();
    
    await inventoryPage.closeMenu();

    await inventoryPage.expectCartBadgeNotVisible();

    await inventoryPage.goToCart();
    await cartPage.expectCartItemCount(0);
  });

  test('should maintain separate cart sessions in different browser contexts', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    const loginPage1 = new LoginPage(page1);
    const inventoryPage1 = new InventoryPage(page1);
    const cartPage1 = new CartPage(page1);

    const loginPage2 = new LoginPage(page2);
    const inventoryPage2 = new InventoryPage(page2);
    const cartPage2 = new CartPage(page2);

    try {
      await loginPage1.navigate();
      await loginPage1.login(users.standard);
      await inventoryPage1.expectToBeOnInventoryPage();
      await inventoryPage1.addProductToCart(products.backpack);
      await inventoryPage1.expectCartBadgeCount(1);

      await loginPage2.navigate();
      await loginPage2.login(users.problem);
      await inventoryPage2.expectToBeOnInventoryPage();

      await inventoryPage2.expectCartBadgeNotVisible();

      await inventoryPage2.addProductToCart(products.bikeLight);
      await inventoryPage2.expectCartBadgeCount(1);

      await inventoryPage1.goToCart();
      await cartPage1.expectCartItemCount(1);
      await cartPage1.expectItemName(products.backpack);

      await inventoryPage2.goToCart();
      await cartPage2.expectCartItemCount(1);
      await cartPage2.expectItemName(products.bikeLight);

    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should not allow logged out user to access cart with items', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login(users.standard);
    await inventoryPage.expectToBeOnInventoryPage();
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.goToCart();
    await cartPage.expectToBeOnCartPage();
    const cartURL = page.url();

    await cartPage.continueShopping();
    await inventoryPage.logout();
    await loginPage.expectLoginButtonVisible();

    await page.goto(cartURL);

    await loginPage.expectLoginButtonVisible();
  });

  // BUG: Cart items persist across different user sessions
  test.fail('should NOT persist cart items when switching from error_user to visual_user', async () => {
    await loginPage.navigate();
    await loginPage.login(users.error);
    await inventoryPage.expectToBeOnInventoryPage();

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    await inventoryPage.expectCartBadgeCount(2);

    await inventoryPage.logout();
    await loginPage.expectLoginButtonVisible();

    await loginPage.login(users.visual);
    await inventoryPage.expectToBeOnInventoryPage();

    // Should be empty but cart persists
    await inventoryPage.expectCartBadgeNotVisible();

    await inventoryPage.goToCart();
    await cartPage.expectCartItemCount(0);
  });

  test('should maintain cart for same user (error_user) after re-login', async () => {
    await loginPage.navigate();
    await loginPage.login(users.error);
    await inventoryPage.expectToBeOnInventoryPage();

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.logout();
    await loginPage.expectLoginButtonVisible();

    await loginPage.login(users.error);
    await inventoryPage.expectToBeOnInventoryPage();

    // Same user should maintain cart (if that's the desired behavior)
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.goToCart();
    await cartPage.expectCartItemCount(1);
    await cartPage.expectItemName(products.backpack);
  });
});

