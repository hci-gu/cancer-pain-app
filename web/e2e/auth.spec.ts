import { expect, test } from '@playwright/test'

test('redirects unauthenticated form visitors to welcome', async ({ page }) => {
  await page.goto('/forms/protected-questionnaire')

  await expect(page).toHaveURL(/\/welcome$/)
  await expect(
    page.getByRole('heading', { name: 'Välkommen till studien' })
  ).toBeVisible()
})
