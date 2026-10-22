# Prompt.md — AI Instructions

## Tool and Model Used

**Tool**: Claude Code (VS Code extension)  
**Model**: Claude Opus 5.5, effort: medium

## Prompt 1 — the test framework

```
Выступай в роли Senior QA Automation Engineer. Твоя задача — написать тестовый фреймворк на TypeScript с использованием Playwright для сайта https://practicesoftwaretesting.com.

Конфигурация и архитектура:

В playwright.config.ts установи baseURL: '[https://practicesoftwaretesting.com](https://practicesoftwaretesting.com)' и обязательно настрой testIdAttribute: 'data-test'.

Реализуй строгий Page Object Model. Создай папку pages/. В файлах тестов (.spec.ts) не должно быть ни одного локатора.

Локаторы должны использовать методы getByTestId(), getByRole() или другие семантические методы. Категорически запрещено использовать CSS-классы и позиционный XPath.

Создай папку fixtures/ и настрой передачу инициализированных Page Objects в тесты через фикстуры (переопредели базовый test).

Создай папку data/ с фабрикой данных (например, с использованием @faker-js/faker или Date.now()) для генерации уникальных email-адресов при регистрации.

Категорически запрещено использовать page.waitForTimeout(). Используй только web-first проверки (assertions) из expect.
```

## Prompt 2 — screenshots for the submission

```
Создай папку screenshots/ и положи туда:

ответ AI (переписку, где он выдал первую версию кода). Его можешь снять только ты;
результат прогона в терминале (npx playwright test со строкой «10 passed»);
HTML-отчёт (npx playwright show-report);
по желанию: UI mode или trace viewer на одном из тестов.
Потом вставь их ссылками в README или Review.md, чтобы проверяющий видел их прямо на странице GitHub.
```
