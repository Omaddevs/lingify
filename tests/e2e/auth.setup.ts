/**
 * Auth setup — runs once before protected-route test suites.
 * Logs in with test credentials and saves the session to a JSON file
 * so Chromium/Mobile projects can reuse it via storageState.
 *
 * Requires environment variables (or a .env.test file):
 *   E2E_EMAIL    – test user email
 *   E2E_PASSWORD – test user password
 */
import { test as setup, expect } from '@playwright/test'
import path from 'path'

const AUTH_FILE = path.join(__dirname, '.auth/user.json')

setup('authenticate', async ({ page }) => {
  const email    = process.env.E2E_EMAIL    ?? 'test@lingify.uz'
  const password = process.env.E2E_PASSWORD ?? 'Test1234!'

  await page.goto('/login')
  await expect(page.getByRole('tab', { name: 'Log In' })).toBeVisible()

  await page.fill('input[type="email"]',    email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')

  // Wait for redirect to dashboard after successful login
  await page.waitForURL('/', { timeout: 10_000 })
  await expect(page).toHaveURL('/')

  // Persist auth cookies/localStorage
  await page.context().storageState({ path: AUTH_FILE })
})
