# Review.md — Code Review and Changes

## What AI Provided vs What Was Expected

| Aspect | AI Provided | Expected | After review |
|---|---|---|---|
| Page Object Model | BasePage + 5 page objects, but specs still used `page.getByTestId` | No locators in specs | ✅ 8 page objects, specs have zero locators |
| Fixtures | pages.fixture.ts | Inject page objects + user | ✅ plus `newUser` / `registeredUser` |
| Data Factory | `createTestUser()` with `.local` domain | Unique email per run | ✅ `Date.now()` + UUID suffix, `example.com` |
| Waits | `waitForTimeout`, `waitForNavigation`, `waitForLoadState('networkidle')` | Web-first only | ✅ removed |
| Locators | CSS `[data-test=…]:has-text()`, many wrong test ids | `getByTestId` / `getByRole` | ✅ checked against the live DOM |
| Auth | setup project with the shared, locked account | Independent tests | ✅ setup removed, own accounts |

## How it was reviewed

Every locator was checked against the live site with a throw-away Playwright script that dumped all
`data-test` attributes per page, and every flow (registration, login, cart, checkout, reset password)
was walked through once in a script before the specs were rewritten. Then the suite was run
three times in parallel (`--repeat-each=3`) — 30 / 30 passed.

## Main changes

| # | Where | Problem | Fix |
|---|---|---|---|
| 1 | `data/user.factory.ts` | Email built from `Date.now()` only — two parallel workers can start in the same millisecond and get the same email | Timestamp + random UUID suffix |
| 2 | `tests/auth.setup.ts` + config | All tests logged in as the shared `customer@practicesoftwaretesting.com`, which other people regularly lock with failed logins | Setup project removed; a `registeredUser` fixture registers a fresh customer through the API for each test |
| 3 | `pages/product.page.ts` | Products opened as `/product/3`, but ids on the site are ULIDs that change when the demo database is reset | Product is found by name through the catalogue search |
| 4 | `pages/product.page.ts` | `waitForTimeout(500)` after "Add to cart" | Wait for the "Product added to shopping cart" toast instead |
| 5 | `pages/register.page.ts` | After registration the test expected `/dashboard`; the app actually redirects to `/auth/login` | Assert the login page, then log in with the new account to prove it was created |
| 6 | `tests/login.spec.ts` | `expect(page.url()).toContain(...)` reads the URL once and does not wait for the redirect | `await expect(page).toHaveURL(...)` — a web-first assertion that retries |

## Known site behaviour the tests account for

- Forgot-password success shows the untranslated key `page.forgot-password.confirm`. The test accepts it
  and also a future human-readable text, and asserts it is not the "invalid" error.
- The demo database is reset periodically; during the reset the API returns `500`. CI retries cover it.
