import { test, expect } from '@playwright/test'

// The app asks the browser for the visitor's real location on load. Grant a mocked one (Sanur,
// Bali) so that resolves deterministically instead of falling back to the manual address search.
test.use({
  geolocation: { latitude: -6.175456973926256, longitude: 106.82712256908418 },
  permissions: ['geolocation']
})

test('clicking through the wizard reaches the investment step', async ({ page }) => {
  await page.goto('/?me=1000000&lng=en')

  // Wait for the debounced geocode/irradiance lookup to resolve so the screenshot shows a real
  // address and sunlight intensity instead of the "finding your location..." placeholder.
  await expect(page.locator('.map-picker-address')).not.toContainText('Finding your location', { timeout: 15_000 })

  await page.getByRole('button', { name: 'Calculate', exact: true }).click()
  // This button's accessible name also includes its icon's label ("Next dollar"), so match loosely.
  await page.getByRole('button', { name: 'Next' }).click()

  await expect(page.getByText('Return on Investment')).toBeVisible()
  // The vendor list resolves its own location lookup independently of the map above, so give it
  // a moment to populate before capturing the full page.
  await expect(page.getByText('Smart Energy Tech')).toBeVisible({ timeout: 15_000 })

  await page.screenshot({ path: 'e2e/screenshots/wizard.png', fullPage: true })
})
