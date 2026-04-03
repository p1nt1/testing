import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class CheckoutCompletePage extends BasePage {
  readonly completeHeader: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = this.locator('.complete-header');
    this.backToProductsButton = this.getByTestId('back-to-products');
  }

  async expectToBeOnCheckoutCompletePage() {
    await expect(this.page).toHaveURL(/.*checkout-complete.html/);
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  async goBackToProducts() {
    await this.backToProductsButton.click();
  }
}

