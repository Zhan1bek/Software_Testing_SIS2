import { test, expect } from '../fixtures/pages.fixture';

test.describe('Registration', () => {
  test('new customer can register and then log in', async ({
    page,
    registerPage,
    loginPage,
    accountPage,
    newUser,
  }) => {
    await registerPage.goto();
    await registerPage.register(newUser);

    // The app sends a freshly registered customer to the login page.
    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(loginPage.submitButton).toBeVisible();

    // The account really exists: its credentials open the account page.
    await loginPage.login(newUser.email, newUser.password);
    await expect(page).toHaveURL(/\/account$/);
    await expect(accountPage.title).toHaveText('My account');
  });

  test('duplicate email is rejected', async ({ page, registerPage, registeredUser }) => {
    await registerPage.goto();
    await registerPage.register(registeredUser);

    await expect(registerPage.registerError).toHaveText(
      'A customer with this email address already exists.',
    );
    await expect(page).toHaveURL(/\/auth\/register$/);
  });

  test('empty form shows required-field errors', async ({ page, registerPage }) => {
    await registerPage.goto();
    await registerPage.submitEmpty();

    await expect(registerPage.fieldError('first-name')).toHaveText('First name is required');
    await expect(registerPage.fieldError('email')).toHaveText('Email is required');
    await expect(registerPage.fieldError('password')).toContainText('Password is required');
    await expect(page).toHaveURL(/\/auth\/register$/);
  });
});
