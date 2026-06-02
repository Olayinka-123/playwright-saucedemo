// Checkout Test : full checkout flow from cart through to order confirmation

// Using a beforeEach hook to log in and add a product to the cart
const { test, expect } = require('@playwright/test');
test.beforeEach(async ({ page }) => { 
// Log in 
    await page.goto('/'); 
    await page.getByPlaceholder('Username').fill('standard_user'); 
    await page.getByPlaceholder('Password').fill('secret_sauce'); 
    await page.getByRole('button', { name:'Login' }).click(); 
    await expect(page).toHaveURL(/inventory\.html/);

// Add one product to cart 
    await page
    .locator('.inventory_item')
    .first()
    .getByRole('button', { name: /add to cart/i })
    .click(); 
// Go to cart 
    await page.locator('.shopping_cart_link').click();
});

//4.1 Proceed from cart to checkout step one

// Click 'Checkout' button in the cart
test('Checkout', async ({ page }) => {
    await page.click('#checkout');

// Assert the URL is /checkout-step-one.html 
    await expect (page).toHaveURL(/checkout-step-one\.html/);

// Assert the form contains fields for First Name, Last Name, and Postal Code
    await expect (page.locator('#first-name')).toBeVisible();
    await expect (page.locator('#last-name')).toBeVisible();
    await expect (page.locator('#postal-code')).toBeVisible();
    
});

// Checkout fails with empty form
test('Checkout with empty form', async ({ page }) => {
    await page.click('#checkout');
    await expect (page).toHaveURL(/checkout-step-one\.html/);

// Continue Checkout by clicking 'Continue' without filling the form
    await page.click('#continue');

// Assert an error message is visible
const error = page.locator('.error-message-container')
//const error = page.locator('[data-test="error"]');

// Assert the error mentions 'First Name is required'
    await expect(error).toContainText(/first name is required/i);

});

// 4.3 Complete checkout successfully
test('Complete checkout', async ({ page }) => {
    await page.click('#checkout');
    await expect (page).toHaveURL(/checkout-step-one\.html/);

// Click 'Checkout', fill in First Name, Last Name, and Postal Code
    await page.fill('#first-name', 'Olayinka');
    await page.fill('#last-name', 'Christie');
    await page.fill('#postal-code', '1234');

// Click 'Continue'
     await page.click('#continue');
// Assert the URL is /checkout-step-two.html
    await expect (page).toHaveURL(/checkout-step-two\.html/);

// Assert the order summary is visible with at least one item
    await expect (page.locator('.cart_item')).toBeVisible();

});

// 4.4 Order summary shows correct information

// Complete step one, then on step two:
test('Correct info on order', async ({ page }) => {
    await page.click('#checkout');
    await expect (page).toHaveURL(/checkout-step-one\.html/);
    await page.fill('#first-name', 'Olayinka');
    await page.fill('#last-name', 'Christie');
    await page.fill('#postal-code', '1234');
    await page.click('#continue');
    await expect (page).toHaveURL(/checkout-step-two\.html/);

// Assert the item name matches what was added to the cart
    await expect (page.locator('.cart_item')).toHaveText(/sauce labs backpack/i);

// Assert a price total is visible
    await expect (page.locator('.summary_total_label')).toBeVisible();
// Assert 'Payment Information' and 'Shipping Information' sections are visible
    await expect (page.locator('[data-test="payment-info-value"]')).toBeVisible();
    await expect (page.locator('[data-test="shipping-info-label"]')).toBeVisible();

});

// 4.5 Complete full checkout and confirm order
// n Complete steps one and two, then click 'Finish'

test('Complete full checkout', async ({ page }) => {
    await page.click('#checkout');
    await expect (page).toHaveURL(/checkout-step-one\.html/);
    await page.fill('#first-name', 'Olayinka');
    await page.fill('#last-name', 'Christie');
    await page.fill('#postal-code', '1234');
    await page.click('#continue');
    await expect (page).toHaveURL(/checkout-step-two\.html/);
    await page.click("#finish");

// Assert the URL is /checkout-complete.html
    await expect (page).toHaveURL(/checkout-complete\.html/);

// Assert the confirmation heading 'Thank you for your order!' is visible
    await expect (page.locator('[data-test="checkout-complete-container"]')).toHaveText(/thank you for your order/i);
// Assert a 'Back Home' button is present
    await expect (page.locator('#back-to-products')).toHaveText(/back home/i);

// Click 'Back Home' and assert the URL returns to /inventory.html

    await page.click("#back-to-products");
    await expect (page).toHaveURL(/inventory\.html/);

});