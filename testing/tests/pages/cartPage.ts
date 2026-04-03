import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.locator('.title');
    this.cartItems = this.locator('.cart_item');
    this.continueShoppingButton = this.getByTestId('continue-shopping');
    this.checkoutButton = this.getByTestId('checkout');
  }

  async expectToBeOnCartPage() {
    await expect(this.page).toHaveURL(/.*cart.html/);
  }

  async expectCartItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async removeProductFromCart(productName: string) {
    const testId = this.convertProductNameToTestId(productName);
    await this.getByTestId(`remove-${testId}`).click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async expectItemName(expectedName: string) {
    await expect(this.cartItems.locator('.inventory_item_name')).toHaveText(expectedName);
  }

  async expectItemPriceVisible() {
    await expect(this.cartItems.locator('.inventory_item_price')).toBeVisible();
  }

  async expectItemQuantity(quantity: string) {
    await expect(this.cartItems.locator('.cart_quantity')).toHaveText(quantity);
  }

  private convertProductNameToTestId(productName: string): string {
    return productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  }
}

