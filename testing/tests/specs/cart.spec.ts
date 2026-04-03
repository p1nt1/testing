import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';
import { users, products } from '../fixtures';

test.describe('Shopping Cart Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.navigate();
    await loginPage.login(users.standard);
    await inventoryPage.expectToBeOnInventoryPage();
  });

  test('should add item to cart', async () => {
    await inventoryPage.addProductToCart(products.backpack);

    await inventoryPage.expectCartBadgeCount(1);

    // Verify Remove button is visible
    const removeButton = inventoryPage.getByTestId('remove-sauce-labs-backpack');
    await removeButton.isVisible();
  });

  test('should add multiple items to cart', async () => {
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    await inventoryPage.addProductToCart(products.boltTShirt);

    await inventoryPage.expectCartBadgeCount(3);
  });

  test('should remove item from cart on inventory page', async () => {
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.removeProductFromCart(products.backpack);
    await inventoryPage.expectCartBadgeNotVisible();
  });

  test('should view cart contents', async () => {
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.goToCart();

    await cartPage.expectToBeOnCartPage();
    await cartPage.expectCartItemCount(1);
  });

  test('should remove item from cart page', async () => {
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.goToCart();

    await cartPage.removeProductFromCart(products.backpack);
    await cartPage.expectCartItemCount(0);
  });

  test('should continue shopping from cart', async () => {
    await inventoryPage.goToCart();
    await cartPage.continueShopping();

    await inventoryPage.expectToBeOnInventoryPage();
  });

  test('should display correct cart item details', async () => {
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.goToCart();

    await cartPage.expectItemName(products.backpack);
    await cartPage.expectItemPriceVisible();
    await cartPage.expectItemQuantity('1');
  });
});

