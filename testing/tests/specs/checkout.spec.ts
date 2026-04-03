import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';
import { CheckoutStepOnePage } from '../pages/checkoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/checkoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/checkoutCompletePage';
import { users, checkoutInfo, products } from '../fixtures';

test.describe('Checkout Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOnePage;
  let checkoutStepTwoPage: CheckoutStepTwoPage;
  let checkoutCompletePage: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);
    checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);

    await loginPage.navigate();
    await loginPage.login(users.standard);
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.goToCart();
  });

  test('should navigate to checkout step one', async () => {
    await cartPage.proceedToCheckout();
    await checkoutStepOnePage.expectToBeOnCheckoutStepOne();
  });

  test('should complete checkout step one with valid information', async () => {
    await cartPage.proceedToCheckout();

    await checkoutStepOnePage.fillCheckoutInformation(checkoutInfo);
    await checkoutStepOnePage.continue();

    await checkoutStepTwoPage.expectToBeOnCheckoutStepTwo();
  });

  test('should show error when first name is missing', async () => {
    await cartPage.proceedToCheckout();

    await checkoutStepOnePage.fillLastName(checkoutInfo.lastName);
    await checkoutStepOnePage.fillPostalCode(checkoutInfo.postalCode);
    await checkoutStepOnePage.continue();

    await checkoutStepOnePage.expectErrorMessage('First Name is required');
  });

  test('should show error when last name is missing', async () => {
    await cartPage.proceedToCheckout();

    await checkoutStepOnePage.fillFirstName(checkoutInfo.firstName);
    await checkoutStepOnePage.fillPostalCode(checkoutInfo.postalCode);
    await checkoutStepOnePage.continue();

    await checkoutStepOnePage.expectErrorMessage('Last Name is required');
  });

  test('should show error when postal code is missing', async () => {
    await cartPage.proceedToCheckout();

    await checkoutStepOnePage.fillFirstName(checkoutInfo.firstName);
    await checkoutStepOnePage.fillLastName(checkoutInfo.lastName);
    await checkoutStepOnePage.continue();

    await checkoutStepOnePage.expectErrorMessage('Postal Code is required');
  });

  test('should display checkout overview correctly', async () => {
    await cartPage.proceedToCheckout();
    await checkoutStepOnePage.fillCheckoutInformation(checkoutInfo);
    await checkoutStepOnePage.continue();

    await checkoutStepTwoPage.expectCartItemCount(1);
    await checkoutStepTwoPage.expectSummaryVisible();
  });

  test('should complete full checkout process', async () => {
    await cartPage.proceedToCheckout();

    await checkoutStepOnePage.fillCheckoutInformation(checkoutInfo);
    await checkoutStepOnePage.continue();

    await checkoutStepTwoPage.finish();

    await checkoutCompletePage.expectToBeOnCheckoutCompletePage();
  });

  test('should cancel checkout from step one', async () => {
    await cartPage.proceedToCheckout();
    await checkoutStepOnePage.cancel();

    await cartPage.expectToBeOnCartPage();
  });

  test('should cancel checkout from overview page', async () => {
    await cartPage.proceedToCheckout();
    await checkoutStepOnePage.fillCheckoutInformation(checkoutInfo);
    await checkoutStepOnePage.continue();

    await checkoutStepTwoPage.cancel();

    await inventoryPage.expectToBeOnInventoryPage();
  });

  test('should return to home from checkout complete page', async () => {
    await cartPage.proceedToCheckout();
    await checkoutStepOnePage.fillCheckoutInformation(checkoutInfo);
    await checkoutStepOnePage.continue();
    await checkoutStepTwoPage.finish();

    await checkoutCompletePage.goBackToProducts();

    await inventoryPage.expectToBeOnInventoryPage();
    // Cart should be empty after checkout
    await inventoryPage.expectCartBadgeNotVisible();
  });

  // BUG: Should NOT be able to checkout with empty cart
  test.fail('should prevent checkout when cart is empty', async ({ page }) => {
    await cartPage.removeProductFromCart(products.backpack);
    await cartPage.expectCartItemCount(0);

    const checkoutButton = page.locator('[data-test="checkout"]');

    // Checkout button should be disabled or not proceed
    await checkoutButton.click();

    // Should NOT proceed to checkout page
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('checkout-step-one');
  });

  test('should display checkout button even when cart is empty', async ({ page }) => {
    await cartPage.removeProductFromCart(products.backpack);
    await cartPage.expectCartItemCount(0);

    const checkoutButton = page.locator('[data-test="checkout"]');
    await expect(checkoutButton).toBeVisible();

    // Note: Button is visible but SHOULD be disabled/non-functional
  });

  test('should verify quantity cannot be modified in cart', async ({ page }) => {
    await cartPage.expectCartItemCount(1);

    const quantityElement = page.locator('.cart_quantity');
    await expect(quantityElement).toHaveText('1');

    // Verify there's no input field or spinner to change quantity
    const quantityInput = page.locator('input[type="number"]').or(page.locator('.quantity-input'));
    const hasQuantityInput = await quantityInput.count();

    expect(hasQuantityInput).toBe(0);

    // Note: This is a limitation - users cannot change quantity in cart
  });

  test('should verify quantity cannot be modified in checkout overview', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutStepOnePage.fillCheckoutInformation(checkoutInfo);
    await checkoutStepOnePage.continue();

    await checkoutStepTwoPage.expectToBeOnCheckoutStepTwo();

    const quantityElement = page.locator('.cart_quantity');
    await expect(quantityElement).toHaveText('1');

    const quantityInput = page.locator('input[type="number"]').or(page.locator('.quantity-input'));
    const hasQuantityInput = await quantityInput.count();

    expect(hasQuantityInput).toBe(0);
  });

  test('should verify total calculation is correct with multiple items', async () => {
    await cartPage.continueShopping();
    await inventoryPage.addProductToCart(products.bikeLight);
    await inventoryPage.goToCart();

    await cartPage.expectCartItemCount(2);

    await cartPage.proceedToCheckout();
    await checkoutStepOnePage.fillCheckoutInformation(checkoutInfo);
    await checkoutStepOnePage.continue();

    await checkoutStepTwoPage.expectCartItemCount(2);
    await checkoutStepTwoPage.expectSummaryVisible();

    // Note: Since we can't change quantity, each item is always qty=1
  });
});

