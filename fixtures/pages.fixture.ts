import { test as base } from '@playwright/test';
import { AccountPage } from '../pages/account.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { ForgotPasswordPage } from '../pages/forgot-password.page';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/product.page';
import { RegisterPage } from '../pages/register.page';
import { lookUpAddress, registerUser } from '../data/toolshop.api';
import { createUser, User } from '../data/user.factory';

export interface PageFixtures {
  loginPage: LoginPage;
  accountPage: AccountPage;
  registerPage: RegisterPage;
  forgotPasswordPage: ForgotPasswordPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  /** Unique customer data that does NOT exist on the server yet. */
  newUser: User;
  /** Unique customer already registered through the API — ready to log in. */
  registeredUser: User;
}

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  newUser: async ({}, use) => {
    await use(createUser());
  },

  /*
   * The seeded customer@practicesoftwaretesting.com account is shared by everyone who
   * practises on this site and is regularly locked by failed logins, so each test gets
   * its own account instead. The API is used because it is fast and not under test here.
   */
  registeredUser: async ({ request }, use) => {
    const user = createUser();
    user.address = await lookUpAddress(request, user.address);
    await registerUser(request, user);
    await use(user);
  },
});

export { expect } from '@playwright/test';
