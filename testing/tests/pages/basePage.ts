import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly baseURL = 'https://www.saucedemo.com';

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = '') {
    await this.page.goto(`${this.baseURL}${path}`);
  }

  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  public getByTestId(testId: string): Locator {
    return this.page.locator(`[data-test="${testId}"]`);
  }
}

