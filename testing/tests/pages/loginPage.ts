import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { User } from '../types';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.getByTestId('username');
    this.passwordInput = this.getByTestId('password');
    this.loginButton = this.getByTestId('login-button');
    this.errorMessage = this.getByTestId('error');
  }

  async navigate() {
    await this.goto('/');
  }

  async login(user: User) {
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
  }

  async loginWithCredentials(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async expectErrorMessage(expectedText: string) {
    await expect(this.errorMessage).toContainText(expectedText);
  }

  async expectLoginButtonVisible() {
    await expect(this.loginButton).toBeVisible();
  }
}

