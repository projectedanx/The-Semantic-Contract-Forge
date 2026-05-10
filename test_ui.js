import { test, expect } from '@playwright/test';

test('App loads successfully', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Verify main title
  await expect(page.locator('h1')).toContainText('Semantic Contract Forge');

  // Verify tier selector exists
  await expect(page.locator('text=Select Tier & Features')).toBeVisible();
});
