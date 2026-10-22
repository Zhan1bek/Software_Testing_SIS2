import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export interface ProductInfo {
  name: string;
  price: number;
}

export class ProductPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly name: Locator;
  /* Price without the currency sign, e.g. "11.48". */
  readonly unitPrice: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly addedToCartToast: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId('search-query');
    this.searchButton = page.getByTestId('search-submit');
    this.name = page.getByRole('heading', { level: 1 });
    this.unitPrice = page.getByTestId('unit-price');
    this.quantityInput = page.getByTestId('quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.addedToCartToast = page.getByRole('alert').filter({ hasText: 'Product added to shopping cart' });
  }

  /** Finds a product through the catalogue search and opens its detail page. */
  async open(productName: string): Promise<void> {
    await this.navigate('/');
    await this.searchInput.fill(productName);
    await this.searchButton.click();
    /* exact: "Claw Hammer" must not match "Claw Hammer with Shock Reduction Grip". */
    await this.page.getByRole('heading', { name: productName, exact: true }).click();
    await this.name.filter({ hasText: productName }).waitFor();
  }

  async getInfo(): Promise<ProductInfo> {
    const name = (await this.name.innerText()).trim();
    const price = Number.parseFloat(await this.unitPrice.innerText());
    return { name, price };
  }

  async addToCart(quantity = 1): Promise<void> {
    await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();
    await this.addedToCartToast.waitFor();
  }
}
