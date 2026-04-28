/**
 * vocabulary.spec.ts
 * Tests for /vocabulary page: word list, audio, favourites, View-all link.
 */
import { test, expect, Page } from '@playwright/test'

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Mock the Web Speech API so tests don't actually call TTS */
async function mockSpeechSynthesis(page: Page) {
  await page.addInitScript(() => {
    const spoken: string[] = []
    Object.defineProperty(window, '_spokenWords', { get: () => spoken })

    const mockSynth = {
      speak: (utt: { text: string }) => spoken.push(utt.text),
      cancel: () => {},
      getVoices: () => [],
      speaking: false,
      pending: false,
      paused: false,
    }
    Object.defineProperty(window, 'speechSynthesis', { value: mockSynth, writable: true })

    class MockUtterance {
      text: string
      lang: string
      constructor(text: string) { this.text = text; this.lang = 'en-US' }
    }
    // @ts-ignore
    window.SpeechSynthesisUtterance = MockUtterance
  })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('Vocabulary page', () => {
  test.beforeEach(async ({ page }) => {
    await mockSpeechSynthesis(page)
    await page.goto('/vocabulary')
    await expect(page.getByRole('main')).toBeVisible()
  })

  // ── Word list ──────────────────────────────────────────────────────────────
  test('renders vocabulary stats cards', async ({ page }) => {
    await expect(page.getByText('Words Learned')).toBeVisible()
    await expect(page.getByText('Mastery Rate')).toBeVisible()
  })

  test('renders word list with term and meaning', async ({ page }) => {
    // At least one word card should be visible
    await expect(page.getByText('Comprehensive')).toBeVisible()
    await expect(page.getByText('Including or dealing with all or nearly all elements.')).toBeVisible()
  })

  test('renders categories section', async ({ page }) => {
    await expect(page.getByText('Categories')).toBeVisible()
    await expect(page.getByText('Academic Words')).toBeVisible()
  })

  // ── Audio ──────────────────────────────────────────────────────────────────
  test('pronounce button triggers speechSynthesis.speak', async ({ page }) => {
    const pronounceBtn = page.getByRole('button', { name: 'Pronounce Comprehensive' })
    await expect(pronounceBtn).toBeVisible()

    await pronounceBtn.click()

    // Check that our mock recorded the call
    const spoken = await page.evaluate(() => (window as any)._spokenWords)
    expect(spoken).toContain('Comprehensive')
  })

  test('all pronounce buttons have descriptive aria-label', async ({ page }) => {
    const pronounceBtns = page.getByRole('button', { name: /Pronounce/i })
    const count = await pronounceBtns.count()
    expect(count).toBeGreaterThan(0)

    // Each button label must include the word being pronounced
    for (let i = 0; i < count; i++) {
      const label = await pronounceBtns.nth(i).getAttribute('aria-label')
      expect(label).toMatch(/Pronounce \w+/i)
    }
  })

  // ── Favourites ────────────────────────────────────────────────────────────
  test('favourite button has correct aria-pressed state', async ({ page }) => {
    // "Meticulous" has favorite: true in static data
    const favBtn = page.getByRole('button', { name: 'Remove Meticulous from favourites' })
    await expect(favBtn).toBeVisible()
    await expect(favBtn).toHaveAttribute('aria-pressed', 'true')
  })

  test('non-favourite word button shows Add label', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: 'Add Comprehensive to favourites' })
    await expect(addBtn).toBeVisible()
    await expect(addBtn).toHaveAttribute('aria-pressed', 'false')
  })

  // ── View All ──────────────────────────────────────────────────────────────
  test('"View All Words" link navigates to /vocabulary/words', async ({ page }) => {
    await page.getByRole('link', { name: 'View All Words' }).click()
    await expect(page).toHaveURL('/vocabulary/words')
    await expect(page.getByRole('heading', { name: 'All Vocabulary Words' })).toBeVisible()
  })

  test('"View all" categories link navigates to /vocabulary/categories', async ({ page }) => {
    await page.getByRole('link', { name: 'View all' }).click()
    await expect(page).toHaveURL('/vocabulary/categories')
  })

  // ── Today's Goal banner ──────────────────────────────────────────────────
  test('Today\'s Goal banner shows progress', async ({ page }) => {
    await expect(page.getByText("Today's Goal")).toBeVisible()
    await expect(page.getByText('Learn 20 new words')).toBeVisible()
    await expect(page.getByText('Continue Learning')).toBeVisible()
  })
})
