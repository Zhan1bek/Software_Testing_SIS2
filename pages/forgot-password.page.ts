import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ForgotPasswordPage extends BasePage {
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  /* Both the success and the error message are rendered as role="alert" inside the form. */
  readonly message: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByTestId('email');
    this.submitButton = page.getByTestId('forgot-password-submit');
    this.message = page.getByTestId('forgot-password-form').getByRole('alert');
  }

  async goto(): Promise<void> {
    await this.navigate('/auth/forgot-password');
  }

  async requestReset(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
