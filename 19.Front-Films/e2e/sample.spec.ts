import { test, expect } from '@playwright/test';


const URL_TEST_PAGE = 'https://practicesoftwaretesting.com/'

test.describe('Home page with no auth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL_TEST_PAGE);
  });

  test('check sign in', async ({ page }) => {
    await expect(page.getByTestId('nav-sign-in')).toHaveText('Sign in');
  });

  test('validate page title', async ({ page }) => {
    await expect(page).toHaveTitle(
      'Practice Software Testing - Toolshop - v5.0'
    );
  });

  test('grid loads with 9 items', async ({ page }) => {
    const productGrid = page.locator('.col-md-9>.container');
    await expect(productGrid.getByRole('link')).toHaveCount(9);
    // Otra forma de escribirlo
    expect(await productGrid.getByRole('link').count()).toBe(9);
  });

  test('search for Thor Hammer', async ({ page }) => {
    const productGrid = page.locator('.col-md-9>.container');
    await page.getByRole('textbox').fill('Thor Hammer');
    await page.getByRole('button', {name: /search/i}).click();
    await expect(productGrid.getByRole('link')).toHaveCount(1);
    await expect(page.getByAltText('Thor Hammer')).toBeVisible();
  });
});
