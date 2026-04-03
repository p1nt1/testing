import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class ProductDetailsPage extends BasePage {
  readonly productName: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = this.locator('.inventory_details_name');
    this.backToProductsButton = this.getByTestId('back-to-products');
  }

  async expectToBeOnProductDetailsPage() {
    await expect(this.page).toHaveURL(/.*inventory-item.html/);
    await expect(this.productName).toBeVisible();
  }

  async goBackToProducts() {
    await this.backToProductsButton.click();
  }
}

