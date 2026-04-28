/**
 * navigation.spec.ts
 * Tests sidebar links, mobile nav, and back-button behaviour.
 * Runs after auth.setup so session is available via storageState.
 */
import { test, expect } from '@playwright/test'

const SIDEBAR_ROUTES = [
  { name: 'Partner',        url: '/partner' },
  { name: 'Online Lessons', url: '/online-lessons' },
  { name: 'Mock Exam',      url: '/mock-exam' },
  { name: 'Progress',       url: '/progress' },
  { name: 'Messages',       url: '/messages' },
  { name: 'Vocabulary',     url: '/vocabulary' },
  { name: 'Settings',       url: '/settings' },
]

test.describe('Sidebar navigation (desktop)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for dashboard to load
    await expect(page.getByRole('main')).toBeVisible()
  })

  for (const { name, url } of SIDEBAR_ROUTES) {
    test(`"${name}" link navigates to ${url}`, async ({ page }) => {
      // Sidebar is a <nav aria-label="Site pages">
      const nav  = page.getByRole('navigation', { name: 'Site pages' })
      const link = nav.getByRole('link', { name })

      await link.click()
      await expect(page).toHaveURL(url)

      // Page should NOT redirect to /login (auth still valid)
      await expect(page).not.toHaveURL('/login')

      // Main content must be visible
      await expect(page.getByRole('main')).toBeVisible()
    })
  }

  test('Home link navigates to /', async ({ page }) => {
    await page.goto('/settings')
    const nav  = page.getByRole('navigation', { name: 'Site pages' })
    await nav.getByRole('link', { name: 'Home' }).click()
    await expect(page).toHaveURL('/')
  })

  test('active link has aria-current="page"', async ({ page }) => {
    await page.goto('/progress')
    const progressLink = page
      .getByRole('navigation', { name: 'Site pages' })
      .getByRole('link', { name: 'Progress' })

    await expect(progressLink).toHaveAttribute('aria-current', 'page')
  })
})

test.describe('Mobile bottom navigation (390 × 844)', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  const MOBILE_NAV_ITEMS = [
    { label: 'Partner',  url: '/partner' },
    { label: 'Lessons',  url: '/online-lessons' },
    { label: 'Mock',     url: '/mock-exam' },
    { label: 'Profile',  url: '/settings' },
  ]

  for (const { label, url } of MOBILE_NAV_ITEMS) {
    test(`"${label}" tab navigates to ${url}`, async ({ page }) => {
      const mobileNav = page.getByRole('navigation', { name: 'Mobile navigation' })
      await expect(mobileNav).toBeVisible()

      await mobileNav.getByRole('link', { name: label }).click()
      await expect(page).toHaveURL(url)
    })
  }

  test('Home tab navigates to /', async ({ page }) => {
    await page.goto('/settings')
    const mobileNav = page.getByRole('navigation', { name: 'Mobile navigation' })
    await mobileNav.getByRole('link', { name: 'Home' }).click()
    await expect(page).toHaveURL('/')
  })
})

test.describe('Browser back button', () => {
  test('back from /partner returns to /', async ({ page }) => {
    await page.goto('/')
    await page.goto('/partner')
    await page.goBack()
    await expect(page).toHaveURL('/')
  })

  test('back from /settings returns to previous page', async ({ page }) => {
    await page.goto('/progress')
    await page.goto('/settings')
    await page.goBack()
    await expect(page).toHaveURL('/progress')
  })

  test('ComingSoon back button returns to previous page', async ({ page }) => {
    await page.goto('/vocabulary')
    await page.getByRole('link', { name: 'View All Words' }).click()
    await expect(page).toHaveURL('/vocabulary/words')

    await page.getByRole('button', { name: 'Go back' }).click()
    await expect(page).toHaveURL('/vocabulary')
  })
})
