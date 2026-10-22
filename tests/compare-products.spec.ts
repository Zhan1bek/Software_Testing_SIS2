import { test, expect } from '../fixtures/pages.fixture';
import { PRODUCTS } from '../data/products';

test('bolt cutters cost more than combination pliers', async ({ productPage }) => {
  await productPage.open(PRODUCTS.combinationPliers);
  const pliers = await productPage.getInfo();

  await productPage.open(PRODUCTS.boltCutters);
  const boltCutters = await productPage.getInfo();

  // The values really came from two different product pages.
  expect(pliers.name).toBe(PRODUCTS.combinationPliers);
  expect(boltCutters.name).toBe(PRODUCTS.boltCutters);
  expect(pliers.price).toBeGreaterThan(0);

  expect(boltCutters.price).toBeGreaterThan(pliers.price);
});
