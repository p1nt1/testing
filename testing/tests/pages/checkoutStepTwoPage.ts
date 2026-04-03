import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class CheckoutStepTwoPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.locator('.title');
    this.cartItems = this.locator('.cart_item');
    this.subtotalLabel = this.locator('.summary_subtotal_label');
    this.taxLabel = this.locator('.summary_tax_label');
    this.totalLabel = this.locator('.summary_total_label');
    this.finishButton = this.getByTestId('finish');
    this.cancelButton = this.getByTestId('cancel');
  }

  async expectToBeOnCheckoutStepTwo() {
    await expect(this.page).toHaveURL(/.*checkout-step-two.html/);
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
  }

  async expectCartItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async expectSummaryVisible() {
    await expect(this.subtotalLabel).toBeVisible();
    await expect(this.taxLabel).toBeVisible();
    await expect(this.totalLabel).toBeVisible();
  }

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}

