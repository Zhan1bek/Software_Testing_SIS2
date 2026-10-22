import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Step 1 of the checkout wizard at /checkout — the shopping cart.
 * The live site does not always render data-test on cart rows, so the table is read
 * through roles and accessible names instead.
 */
export class CartPage extends BasePage {
  readonly navCart: Locator;
  /* One quantity field per cart line: "Quantity for <product>". */
  readonly lineQuantities: Locator;
  readonly proceedButton: Locator;

  constructor(page: Page) {
    super(page);
    this.navCart = page.getByTestId('nav-cart');
    this.lineQuantities = page.getByRole('spinbutton', { name: /^Quantity for / });
    /* Every wizard step has a "Proceed to checkout" button; the test id tells them apart. */
    this.proceedButton = page.getByTestId('proceed-1');
  }

  /** Opens the cart the way a customer does — through the header icon. */
  async openFromHeader(): Promise<void> {
    await this.navCart.click();
  }

  /** Cell with the product name in the cart line. */
  productCell(productName: string): Locator {
    return this.page.getByRole('cell', { name: productName, exact: true });
  }

  quantity(productName: string): Locator {
    return this.page.getByRole('spinbutton', { name: `Quantity for ${productName}` });
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedButton.click();
  }
}
