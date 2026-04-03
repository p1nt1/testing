import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly productSortContainer: Locator;
  readonly productItems: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly menuButton: Locator;
  readonly menuCloseButton: Locator;
  readonly menu: Locator;
  readonly logoutLink: Locator;
  readonly resetLink: Locator;
  readonly aboutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.locator('.title');
    this.productSortContainer = this.locator('.product_sort_container');
    this.productItems = this.locator('.inventory_item');
    this.shoppingCartLink = this.locator('.shopping_cart_link');
    this.shoppingCartBadge = this.locator('.shopping_cart_badge');
    this.menuButton = this.locator('#react-burger-menu-btn');
    this.menuCloseButton = this.locator('#react-burger-cross-btn');
    this.menu = this.locator('.bm-menu');
    this.logoutLink = this.locator('#logout_sidebar_link');
    this.resetLink = this.locator('#reset_sidebar_link');
    this.aboutLink = this.locator('#about_sidebar_link');
  }

  async expectToBeOnInventoryPage() {
    await expect(this.page).toHaveURL(/.*inventory.html/);
    await expect(this.pageTitle).toHaveText('Products');
  }

  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.productSortContainer.selectOption(option);
  }

  async getFirstProductName(): Promise<string> {
    return await this.productItems.first().locator('.inventory_item_name').textContent() || '';
  }

  async getFirstProductPrice(): Promise<string> {
    return await this.productItems.first().locator('.inventory_item_price').textContent() || '';
  }

  async clickFirstProductName() {
    await this.productItems.first().locator('.inventory_item_name').click();
  }

  async addProductToCart(productName: string) {
    const testId = this.convertProductNameToTestId(productName);
    await this.getByTestId(`add-to-cart-${testId}`).click();
  }

  async removeProductFromCart(productName: string) {
    const testId = this.convertProductNameToTestId(productName);
    await this.getByTestId(`remove-${testId}`).click();
  }

  async expectCartBadgeCount(count: number) {
    await expect(this.shoppingCartBadge).toHaveText(count.toString());
  }

  async expectCartBadgeNotVisible() {
    await expect(this.shoppingCartBadge).toBeHidden();
  }

  async goToCart() {
    await this.shoppingCartLink.waitFor({ state: 'visible' });
    await this.shoppingCartLink.click();
  }

  async openMenu() {
    await this.menuButton.click();
    await expect(this.menu).toBeVisible();
  }

  async closeMenu() {
    await this.menuCloseButton.click();
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async resetAppState() {
    await this.openMenu();
    await this.resetLink.click();
  }

  async expectAboutLinkVisible() {
    await expect(this.aboutLink).toBeVisible();
  }

  async expectMenuVisible() {
    await expect(this.menu).toBeVisible();
  }

  async expectMenuNotVisible() {
    await expect(this.menu).toBeHidden();
  }

  private convertProductNameToTestId(productName: string): string {
    // Convert "Sauce Labs Backpack" to "sauce-labs-backpack"
    return productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  }
}

