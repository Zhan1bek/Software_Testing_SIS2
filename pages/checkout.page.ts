import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { Address } from '../data/user.factory';

export type PaymentMethod =
  | 'Bank Transfer'
  | 'Cash on Delivery'
  | 'Credit Card'
  | 'Buy Now Pay Later'
  | 'Gift Card';

/** Steps 2–4 of the checkout wizard at /checkout: sign in, billing address, payment. */
export class CheckoutPage extends BasePage {
  readonly signedInContinueButton: Locator;
  readonly addressContinueButton: Locator;
  readonly paymentMethod: Locator;
  /*
   * One data-test="finish" button reads "Check payment" first and "Confirm" after a
   * successful payment. Locating it by its label makes each click wait for the right state.
   */
  readonly checkPaymentButton: Locator;
  readonly confirmButton: Locator;
  readonly paymentSuccess: Locator;
  readonly orderConfirmation: Locator;

  constructor(page: Page) {
    super(page);
    this.signedInContinueButton = page.getByTestId('proceed-2');
    this.addressContinueButton = page.getByTestId('proceed-3');
    this.paymentMethod = page.getByTestId('payment-method');
    this.checkPaymentButton = page.getByRole('button', { name: 'Check payment' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
    this.paymentSuccess = page.getByTestId('payment-success-message');
    this.orderConfirmation = page.getByText(/Thanks for your order!/);
  }

  /** Step 2 for a customer who already logged in. */
  async continueAsSignedIn(): Promise<void> {
    await this.signedInContinueButton.click();
  }

  /** Step 3. The form is pre-filled from the profile; fill it anyway to be explicit. */
  async fillBillingAddress(address: Address): Promise<void> {
    await this.page.getByTestId('country').selectOption(address.country);
    await this.page.getByTestId('postal_code').fill(address.postalCode);
    await this.page.getByTestId('house_number').fill(address.houseNumber);
    await this.page.getByTestId('street').fill(address.street);
    await this.page.getByTestId('city').fill(address.city);
    await this.page.getByTestId('state').fill(address.state);
    /* Auto-waits until the form is valid and the button gets enabled. */
    await this.addressContinueButton.click();
  }

  /** Step 4. */
  async pay(method: PaymentMethod): Promise<void> {
    await this.paymentMethod.selectOption({ label: method });
    await this.checkPaymentButton.click();
    await this.paymentSuccess.waitFor();
  }

  async confirmOrder(): Promise<void> {
    await this.confirmButton.click();
  }
}
