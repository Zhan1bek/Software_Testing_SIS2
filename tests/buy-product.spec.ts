import { test, expect } from '../fixtures/pages.fixture';
import { PRODUCTS } from '../data/products';

test('customer buys a product end to end', async ({
  page,
  loginPage,
  productPage,
  cartPage,
  checkoutPage,
  registeredUser,
}) => {
  const quantity = 2;

  await loginPage.goto();
  await loginPage.login(registeredUser.email, registeredUser.password);
  await expect(page).toHaveURL(/\/account$/);

  // Add to cart
  await productPage.open(PRODUCTS.clawHammer);
  await productPage.addToCart(quantity);
  await expect(productPage.cartQuantity).toHaveText(String(quantity));

  // Cart: right product, right quantity
  await cartPage.openFromHeader();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(cartPage.lineQuantities).toHaveCount(1);
  await expect(cartPage.productCell(PRODUCTS.clawHammer)).toBeVisible();
  await expect(cartPage.quantity(PRODUCTS.clawHammer)).toHaveValue(String(quantity));

  // Checkout
  await cartPage.proceedToCheckout();
  await checkoutPage.continueAsSignedIn();
  await checkoutPage.fillBillingAddress(registeredUser.address);
  await checkoutPage.pay('Cash on Delivery');
  await expect(checkoutPage.paymentSuccess).toHaveText('Payment was successful');

  await checkoutPage.confirmOrder();
  await expect(checkoutPage.orderConfirmation).toHaveText(
    /Thanks for your order! Your invoice number is INV-\d+\./,
  );
});
