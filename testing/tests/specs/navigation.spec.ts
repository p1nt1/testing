import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { users, products } from '../fixtures';

test.describe('Navigation Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.navigate();
    await loginPage.login(users.standard);
  });

  test('should open and close menu', async () => {
    await inventoryPage.openMenu();
    await inventoryPage.expectMenuVisible();

    await inventoryPage.closeMenu();
    await inventoryPage.expectMenuNotVisible();
  });

  test('should logout successfully', async () => {
    await inventoryPage.logout();

    await loginPage.expectLoginButtonVisible();
  });

  test('should reset app state', async () => {
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.resetAppState();

    await inventoryPage.expectCartBadgeNotVisible();
  });

  test('should navigate to About page', async () => {
    await inventoryPage.openMenu();

    await inventoryPage.expectAboutLinkVisible();
  });
});

