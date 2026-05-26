import { test, expect } from '@playwright/test';

test.describe('Login Tests - SauceDemo', () => {

  // 2.1 Successful login with standard_user
  test('Successful login with standard_user', async ({ page }) => {
    await page.goto('/');

    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');
    await page.screenshot({path: 'screenshots/title.png'});
  });

  // 2.2 Locked-out user sees error message
  test('Locked-out user sees error message', async ({ page }) => {
    await page.goto('/');

    await page.fill('#user-name', 'locked_out_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    const error = page.locator('[data-test="error"]');

    await expect(error).toBeVisible();
    await expect(error).toContainText('locked out');
    await expect(page).toHaveURL('/');
    await page.screenshot({path: 'screenshots/url.png'});
  });

  // 2.3 Login fails with wrong password
  test('Login fails with wrong password', async ({ page }) => {
    await page.goto('/');

    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');

    const error = page.locator('[data-test="error"]');

    await expect(error).toBeVisible();
    await expect(error).toContainText('Username and password do not match');
    await page.screenshot({path: 'screenshots/wrongpass.png'});
  });

  // 2.4 Login fails with empty fields
  test('Login fails with empty fields', async ({ page }) => {
    await page.goto('/');

    await page.click('#login-button');

    const error = page.locator('[data-test="error"]');

    await expect(error).toContainText('Username is required');
    await page.screenshot({path: 'screenshots/emptyfield.png'});

  });

 // 2.5 User can log out
  test('User can log out using standard_user', async ({ page }) => {
    await page.goto('/');

    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');

    await expect(page).toHaveURL('/');
    await expect(page.locator('#login-button')).toBeVisible(); 
    await page.screenshot({path: 'screenshots/logout.png'});
  });
});
