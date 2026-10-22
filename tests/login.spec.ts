import { test, expect } from '../fixtures/pages.fixture';

test.describe('Login', () => {
  test('valid credentials open the account page', async ({
    page,
    loginPage,
    accountPage,
    registeredUser,
  }) => {
    await loginPage.goto();
    await loginPage.login(registeredUser.email, registeredUser.password);

    await expect(page).toHaveURL(/\/account$/);
    await expect(accountPage.title).toHaveText('My account');
  });

  test('wrong password shows an error', async ({ page, loginPage, registeredUser }) => {
    await loginPage.goto();
    await loginPage.login(registeredUser.email, `${registeredUser.password}-wrong`);

    await expect(loginPage.loginError).toHaveText('Invalid email or password');
    await expect(page).toHaveURL(/\/auth\/login$/);
  });

  test('empty form shows required-field errors', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.submitEmpty();

    await expect(loginPage.emailError).toHaveText('Email is required');
    await expect(loginPage.passwordError).toHaveText('Password is required');
    await expect(page).toHaveURL(/\/auth\/login$/);
  });
});
