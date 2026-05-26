//Shopping Tests - SauceDemo
// BeforeEach Hook
const { test, expect } = require('@playwright/test'); test.beforeEach(async ({ page }) => {
await page.goto('/'); 
await page.getByPlaceholder('Username').fill('standard_user'); 
await page.getByPlaceholder('Password').fill('secret_sauce'); 
await page.click('#login-button') 
await expect(page).toHaveURL(/inventory/); });



// 3.1 Assertion: Products page loads with items
test('Products page loads with items', async ({ page }) => {

// Assert at least 1 product is visible
    await expect(page.locator('.inventory_item_img').first()).toBeVisible();

// Assert each product has a title
    const productTitles = page.locator('.inventory_item_name');
    await expect(productTitles.first()).toBeVisible();

// Assert each product has a price
    const productPrices = page.locator('.inventory_item_price');
    await expect(productPrices.first()).toBeVisible();

// Assert page title is visible
    await expect(page.locator('.title')).toHaveText('Products')
});

// 3.2 Add a single item to cart
test('Add a single item to cart', async ({ page }) => {

 // Click "Add to cart" on first product
    await page.click('#add-to-cart-sauce-labs-backpack');

// Assert cart badge shows 1
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1')

// Assert the button text changes to 'Remove'
    await expect(page.locator('#remove-sauce-labs-backpack')).toHaveText('Remove');
});


// 3.3 Add multiple items to cart
test('Add multiple items to cart', async ({ page }) => {

// Add at least 3 different products to the cart
    await page.click('#add-to-cart-sauce-labs-backpack');
    await page.click('#add-to-cart-sauce-labs-bike-light');
    await page.click('#add-to-cart-sauce-labs-bolt-t-shirt');

// Assert the cart badge count matches the number of items added
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');

//Remove the 3 items in the cart
    // await page.click('#remove-sauce-labs-backpack');
    // await page.click('#remove-sauce-labs-bike-light');
    // await page.click('#remove-sauce-labs-bolt-t-shirt');
});


// 3.4 Remove an item from the cart
test('Remove an item from the cart', async ({ page }) => {

// Add a product to the cart
    await page.click('#add-to-cart-sauce-labs-backpack');

// Click 'Remove' on the same product
    await page.click('#remove-sauce-labs-backpack');

// Assert the cart badge disappears or shows 0
    await expect(page.locator('.shopping_cart_badge')).toBeHidden();

// Assert the button text reverts to 'Add to cart'
    await expect(page.locator('#add-to-cart-sauce-labs-backpack')).toHaveText('Add to cart');
});


// 3.5 Navigate to cart and verify items
test('Verify items in the cart', async ({ page }) => {

// Add 2 products to the cart
    await page.click('#add-to-cart-sauce-labs-backpack');
    await page.click('#add-to-cart-sauce-labs-bike-light');

// Click the cart icon
    await page.click('.shopping_cart_link');

// Assert the URL is /cart.html
    await expect(page).toHaveURL(/cart\.html/);

// Assert both products appear in the cart
     const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
    
// Assert each cart item shows a name, price, and quantity
    for (const item of await cartItems.all()) {
        await expect(item.locator('.inventory_item_name')).toBeVisible();
        await expect(item.locator('.inventory_item_price')).toBeVisible();
        await expect(item.locator('.cart_quantity')).toHaveText('1');
    }
    });
    





