# AI_CI.md — AI Assistance Documentation (SIS 3, CI pipeline)

## Tool and Model Used

**Tool**: Claude Code (VS Code extension)  
**Model**: `[fill in the exact model you used for SIS 3]`

## How I used it

For the CI part of this assignment I used the AI as an engineering and documentation assistant. I made the decisions and checked every result myself.

- **Moving CI from GitHub Actions to GitLab CI.** The GitHub Actions workflow was written first (branch `ci/github-actions`). Every job was then refused before it started with *"The job was not started because your account is locked due to a billing issue"*, on the Free plan with nothing to pay. The AI helped me port the pipeline to `.gitlab-ci.yml` and check the stages, the artefacts and the rules.
- **Explaining CI settings.** The AI explained what each Playwright setting does in CI and why: `forbidOnly`, `retries: 2`, `trace: 'on-first-retry'`, and the `blob` / `junit` / `list` reporters.
- **Sharding and the merged report.** The AI helped design `parallel: 4` with `--shard=i/4`, the `merge-report` job (`when: always`), and the `merge.config.ts` that merges the blob reports into one HTML report.
- **Timing comparison.** I ran one job without sharding and four shards, three times each, through the GitLab API. The AI helped me structure the results table and the conclusion (sharding halved the test time, but the whole pipeline got 18 s slower because setup dominates on a 10-test suite).
- **Documentation.** The AI helped draft the CI section of the README and this file, and translate my notes into clear professional English.

## Prompts I used

Replace each placeholder with the exact text you sent to the AI.

### Prompt 1 — switching CI to GitLab

```
У меня проект на Playwright + TypeScript (тесты для https://practicesoftwaretesting.com). GitHub Actions на аккаунте заблокирован из-за биллинга, поэтому нужен GitLab CI. Напиши .gitlab-ci.yml: стадия test с npm ci и кешем по package-lock.json, установка браузеров через playwright install --with-deps chromium, запуск npx playwright test, артефакты test-results и playwright-report с when: always, JUnit-отчёт для вкладки Tests. Образ — mcr.microsoft.com/playwright с конкретным тегом, совпадающим с версией @playwright/test из package-lock.json, без плавающих тегов.
```

### Prompt 2 — sharding and the merged HTML report

```
Добавь в пайплайн parallel: 4 с запуском npx playwright test --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL. Каждый шард пишет blob-report. Добавь job merge-report в стадии report с when: always, который через merge.config.ts собирает blob-отчёты всех шардов в один HTML. Объясни, зачем нужен отдельный merge.config.ts и почему merge-report не должен решать, пройдёт ли merge request.
```

### Prompt 3 — explaining the retry / forbidOnly / trace settings

```
Объясни, что делают forbidOnly, retries, trace: 'on-first-retry' и reporter list/blob/junit в playwright.config.ts при CI=true и чем они отличаются от локального запуска. Как сделать так, чтобы тест, прошедший на retry, помечался flaky, а не падал, и чтобы merge блокировался только если тест падает во всех трёх попытках?
```

### Prompt 4 — README and report wording

```
Помоги переписать раздел CI в README и этот документ понятным профессиональным английским.  Не меняй цифры и ссылки на пайплайны — только формулировки, и отметь, если что-то в тексте не совпадает с замерами.
```

## What I checked and changed

- Every pipeline in the README was run by me; the links in the table point to real pipelines on GitLab.
- The timing numbers are medians of three runs per configuration, measured on GitLab shared runners, not taken from the AI.
- The gating rules were decided by me: a test has to fail all three attempts to block a merge, because the target is a shared public demo site that is reset periodically and answers `500` for a few seconds. The AI's first suggestion was not used as is.
- `merge-report` is `when: always` and only builds artefacts, so it never decides whether a merge is allowed.
- `[add any other AI suggestion you rejected or changed, and why]`
