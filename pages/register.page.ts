import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { User } from '../data/user.factory';

export type RegisterField =
  | 'first-name'
  | 'last-name'
  | 'dob'
  | 'country'
  | 'postal_code'
  | 'house_number'
  | 'street'
  | 'city'
  | 'state'
  | 'phone'
  | 'email'
  | 'password';

export class RegisterPage extends BasePage {
  readonly submitButton: Locator;
  /* Server-side error, e.g. "A customer with this email address already exists." */
  readonly registerError: Locator;

  constructor(page: Page) {
    super(page);
    this.submitButton = page.getByTestId('register-submit');
    this.registerError = page.getByTestId('register-error');
  }

  async goto(): Promise<void> {
    await this.navigate('/auth/register');
  }

  field(name: RegisterField): Locator {
    return this.page.getByTestId(name);
  }

  /* Client-side validation message under a field. */
  fieldError(name: RegisterField): Locator {
    return this.page.getByTestId(`${name}-error`);
  }

  async register(user: User): Promise<void> {
    await this.field('first-name').fill(user.firstName);
    await this.field('last-name').fill(user.lastName);
    await this.field('dob').fill(user.dob);
    /* Country, postcode and house number first: they trigger the address lookup. */
    await this.field('country').selectOption(user.address.country);
    await this.field('postal_code').fill(user.address.postalCode);
    await this.field('house_number').fill(user.address.houseNumber);
    await this.field('street').fill(user.address.street);
    await this.field('city').fill(user.address.city);
    await this.field('state').fill(user.address.state);
    await this.field('phone').fill(user.phone);
    await this.field('email').fill(user.email);
    await this.field('password').fill(user.password);
    await this.submitButton.click();
  }

  async submitEmpty(): Promise<void> {
    await this.submitButton.click();
  }
}
