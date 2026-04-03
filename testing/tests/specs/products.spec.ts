import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { ProductDetailsPage } from '../pages/productDetailsPage';
import { users, products, prices } from '../fixtures';

test.describe('Product Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let productDetailsPage: ProductDetailsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    productDetailsPage = new ProductDetailsPage(page);

    await loginPage.navigate();
    await loginPage.login(users.standard);
    await inventoryPage.expectToBeOnInventoryPage();
  });

  test('should display all products', async () => {
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBe(6);
  });

  test('should display product details correctly', async ({ page: _page }) => {
    const firstProduct = inventoryPage.productItems.first();
    await expect(firstProduct.locator('.inventory_item_name')).toBeVisible();
    await expect(firstProduct.locator('.inventory_item_desc')).toBeVisible();
    await expect(firstProduct.locator('.inventory_item_price')).toBeVisible();
    await expect(firstProduct.locator('button')).toBeVisible();
  });

  test('should sort products by name A to Z', async () => {
    await inventoryPage.sortBy('az');
    const firstProductName = await inventoryPage.getFirstProductName();
    expect(firstProductName).toBe(products.backpack);
  });

  test('should sort products by name Z to A', async () => {
    await inventoryPage.sortBy('za');
    const firstProductName = await inventoryPage.getFirstProductName();
    expect(firstProductName).toBe(products.redTShirt);
  });

  test('should sort products by price low to high', async () => {
    await inventoryPage.sortBy('lohi');
    const firstProductPrice = await inventoryPage.getFirstProductPrice();
    expect(firstProductPrice).toBe(prices.lowest);
  });

  test('should sort products by price high to low', async () => {
    await inventoryPage.sortBy('hilo');
    const firstProductPrice = await inventoryPage.getFirstProductPrice();
    expect(firstProductPrice).toBe(prices.highest);
  });

  test('should navigate to product details page', async () => {
    await inventoryPage.clickFirstProductName();
    await productDetailsPage.expectToBeOnProductDetailsPage();
  });

  test('should return to products page from product details', async () => {
    await inventoryPage.clickFirstProductName();
    await productDetailsPage.goBackToProducts();
    await inventoryPage.expectToBeOnInventoryPage();
  });
});

