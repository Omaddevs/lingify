/**
 * auth.spec.ts
 * Tests for /login page — does NOT depend on prior auth setup.
 * All tests run without a storageState so they hit the real login UI.
 */
import { test, expect } from '@playwright/test'

// Override the project-level storageState so these tests start unauthenticated
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Authentication — Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 5_000 })
  })

  // ── Form validation ──────────────────────────────────────────────────────
  test('shows email error on empty submit', async ({ page }) => {
    // Make sure we're on the Log In tab
    await page.getByRole('tab', { name: 'Log In' }).click()
    await page.click('button[type="submit"]')

    await expect(page.getByText('Email required')).toBeVisible()
  })

  test('shows password error when only email is filled', async ({ page }) => {
    await page.getByRole('tab', { name: 'Log In' }).click()
    await page.fill('input[type="email"]', 'user@example.com')
    await page.click('button[type="submit"]')

    await expect(page.getByText('Password required')).toBeVisible()
  })

  test('shows register validation errors on empty Sign Up submit', async ({ page }) => {
    await page.getByRole('tab', { name: 'Sign Up' }).click()
    await page.click('button[type="submit"]')

    await expect(page.getByText('Name required')).toBeVisible()
    await expect(page.getByText('Email required')).toBeVisible()
  })

  test('password too short shows minimum-length error', async ({ page }) => {
    await page.getByRole('tab', { name: 'Sign Up' }).click()
    await page.fill('input[placeholder="Asadbek Yusupov"]', 'Test User')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', '123')
    await page.click('button[type="submit"]')

    await expect(page.getByText('Minimum 6 characters')).toBeVisible()
  })

  // ── UI interactions ──────────────────────────────────────────────────────
  test('toggles between Log In and Sign Up tabs', async ({ page }) => {
    const signUpTab = page.getByRole('tab', { name: 'Sign Up' })
    const logInTab  = page.getByRole('tab', { name: 'Log In' })

    await signUpTab.click()
    await expect(page.getByPlaceholder('Asadbek Yusupov')).toBeVisible()

    await logInTab.click()
    await expect(page.getByPlaceholder('Asadbek Yusupov')).not.toBeVisible()
  })

  test('Show/Hide password toggle works', async ({ page }) => {
    await page.getByRole('tab', { name: 'Log In' }).click()
    const pwInput = page.locator('input[type="password"]')
    const toggle  = page.getByRole('button', { name: 'Show password' })

    await expect(pwInput).toHaveAttribute('type', 'password')
    await toggle.click()
    await expect(page.locator('input[type="text"]').last()).toBeVisible()
    await page.getByRole('button', { name: 'Hide password' }).click()
    await expect(pwInput).toHaveAttribute('type', 'password')
  })

  // ── Redirect for authenticated users ────────────────────────────────────
  test('unauthenticated user is redirected to /login from protected route', async ({ page }) => {
    await page.goto('/progress')
    await expect(page).toHaveURL('/login')
  })
})

test.describe('Authentication — Logout', () => {
  // This group needs auth
  test('logout from settings returns to login', async ({ page }) => {
    // Re-authenticate inline (don't rely on storageState)
    await page.goto('/login')
    await page.fill('input[type="email"]',    process.env.E2E_EMAIL    ?? 'test@lingify.uz')
    await page.fill('input[type="password"]', process.env.E2E_PASSWORD ?? 'Test1234!')
    await page.click('button[type="submit"]')
    await page.waitForURL('/', { timeout: 10_000 })

    await page.goto('/settings')
    await page.getByRole('button', { name: 'Log Out' }).click()

    await expect(page).toHaveURL('/login')
  })
})
