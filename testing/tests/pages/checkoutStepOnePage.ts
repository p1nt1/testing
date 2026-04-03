import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { CheckoutInfo } from '../types';

export class CheckoutStepOnePage extends BasePage {
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.locator('.title');
    this.firstNameInput = this.getByTestId('firstName');
    this.lastNameInput = this.getByTestId('lastName');
    this.postalCodeInput = this.getByTestId('postalCode');
    this.continueButton = this.getByTestId('continue');
    this.cancelButton = this.getByTestId('cancel');
    this.errorMessage = this.getByTestId('error');
  }

  async expectToBeOnCheckoutStepOne() {
    await expect(this.page).toHaveURL(/.*checkout-step-one.html/);
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
  }

  async fillCheckoutInformation(info: CheckoutInfo) {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  async fillPostalCode(postalCode: string) {
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async expectErrorMessage(expectedText: string) {
    await expect(this.errorMessage).toContainText(expectedText);
  }
}

