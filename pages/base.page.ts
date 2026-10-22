import { Locator, Page } from '@playwright/test';

/**
 * Shared parts of every screen: navigation and the header.
 * Page objects expose locators and business actions; assertions live in the specs.
 */
export abstract class BasePage {
  /* Badge with the number of items in the cart, shown in the header. */
  readonly cartQuantity: Locator;

  constructor(protected readonly page: Page) {
    this.cartQuantity = page.getByTestId('cart-quantity');
  }

  protected async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }
}
