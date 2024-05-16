import { test, expect } from '@playwright/test';

const root = 'http://localhost:5173';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Form Mason/);
});

test('creates a form and list updates', async ({ page }) => {
  await page.goto('/');

  // navigate to form editor
  await page.locator('#add-tab').click();
  expect(page.url()).toBe(root + '/form/edit');

  // fill form
  await page.getByPlaceholder('Form Name').fill('Test Form');
  // save and close, navigating to root
  await page.getByRole('button', { name: 'Save and Close' }).click();
  // expect success toast
  expect(await page.waitForSelector('.toast')).toBeTruthy();
  await page.waitForURL(root + '/');
  expect(page.url()).toBe(root + '/');

  // expect list to update
  expect(page.getByText('Test Form')).toBeTruthy();
})
