# Description.md — SIS 2 Playwright Automation

## Goal

Создать полный набор end-to-end тестов для интернет-магазина инструментов **Toolshop** (https://practicesoftwaretesting.com) с использованием Playwright и TypeScript.

## Scope

Тестирование основных потоков пользователя:
- Регистрация и вход
- Покупка товара
- Сравнение товаров
- Восстановление пароля

## Test Cases

| # | Test Case | File | What it checks |
|---|---|---|---|
| 1 | Register new customer | `tests/register.spec.ts` | Account creation with unique email (then login works), duplicate email rejection, empty form validation |
| 2 | Login | `tests/login.spec.ts` | Valid login → account page, wrong password → error, empty form → validation |
| 3 | Buy product | `tests/buy-product.spec.ts` | Add 2×Claw Hammer → cart: name and quantity → billing address → Cash on Delivery → invoice |
| 4 | Compare products | `tests/compare-products.spec.ts` | Read name and price of 2 products, assert one costs more than the other |
| 5 | Reset password | `tests/reset-password.spec.ts` | Registered email → success, unknown email → error |

## Test Structure

```
tests/              — spec files, one per test case (assertions only, no locators)
pages/              — page objects (locators + business actions, no assertions)
fixtures/           — pages.fixture.ts (extends base test: page objects + test users)
data/               — user factory, API seeding helpers, products, env config
playwright.config.ts — parallel execution, testIdAttribute='data-test'
```

## Key Decisions

1. **Page Object Model**: каждая страница — отдельный класс с локаторами и методами (login, addToCart, pay…)
2. **Fixtures**: все page objects передаются через фикстуры, нет new PageObject() в тестах
3. **Unique data**: каждый пользователь уникален (Date.now() + случайный UUID-суффикс)
4. **Parallel execution**: fullyParallel = true, все тесты независимы
5. **No hardcoded waits**: только web-first assertions (`expect`) и автоожидание действий Playwright

## Test Accounts

Общий аккаунт `customer@practicesoftwaretesting.com` / `welcome01` **не используется**: его регулярно
блокируют чужие неудачные попытки входа. Фикстура `registeredUser` регистрирует свежего клиента через API
перед каждым тестом, которому нужен существующий аккаунт.
