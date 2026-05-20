import { test, expect } from '@playwright/test';

const URL = 'http://localhost:5173/'

test('has title', async ({ page }) => {
  await page.goto(URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/films/i);
});

test('get about link', async ({ page }) => {
  await page.goto(URL);

  // Click the get started link.
  await page.getByRole('link', { name: 'Acerca de' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
});
