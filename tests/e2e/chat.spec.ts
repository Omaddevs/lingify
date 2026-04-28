/**
 * chat.spec.ts
 * Tests for /chat page: message input, send, conversation list, modal.
 *
 * NOTE: The /chat route uses ChatPage (Supabase real-time).
 *       Tests that require an active conversation mock the network.
 */
import { test, expect } from '@playwright/test'

test.describe('Chat page — empty state', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept Supabase conversation query to return empty list
    await page.route('**/rest/v1/conversation_participants**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    })

    await page.goto('/chat')
    await expect(page.getByRole('main')).toBeVisible({ timeout: 8_000 })
  })

  test('renders conversation list sidebar', async ({ page }) => {
    await expect(page.getByRole('region', { name: 'Conversations' })).toBeVisible()
  })

  test('empty state shows "No conversations yet" message', async ({ page }) => {
    await expect(page.getByText('No conversations yet')).toBeVisible()
  })

  test('"New Message" button is visible in empty right panel', async ({ page }) => {
    // On desktop, the right panel shows empty state with "New Message" button
    await expect(page.getByRole('button', { name: 'New Message' })).toBeVisible()
  })

  test('conversation search input accepts text', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: /search/i })
    await expect(searchInput).toBeVisible()
    await searchInput.fill('Emma')
    await expect(searchInput).toHaveValue('Emma')
  })

  test('filter tabs render correctly', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'All' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Unread' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Groups' })).toBeVisible()
  })

  test('switching filter tabs changes aria-selected', async ({ page }) => {
    const unreadTab = page.getByRole('tab', { name: 'Unread' })
    await unreadTab.click()
    await expect(unreadTab).toHaveAttribute('aria-selected', 'true')

    const allTab = page.getByRole('tab', { name: 'All' })
    await expect(allTab).toHaveAttribute('aria-selected', 'false')
  })
})

test.describe('Chat page — with mocked conversation', () => {
  const MOCK_CONV = [
    {
      conversation: {
        id: 'conv-1',
        name: 'Emma Johnson',
        is_group: false,
        created_at: new Date().toISOString(),
      },
    },
  ]

  const MOCK_MESSAGES = [
    {
      id: 'msg-1',
      content: 'Hi there! 👋',
      sender_id: 'other-user',
      created_at: new Date(Date.now() - 60_000).toISOString(),
      sender: { name: 'Emma Johnson', avatar_url: null },
      file_url: null,
      file_type: null,
    },
    {
      id: 'msg-2',
      content: 'How is your English practice going?',
      sender_id: 'other-user',
      created_at: new Date().toISOString(),
      sender: { name: 'Emma Johnson', avatar_url: null },
      file_url: null,
      file_type: null,
    },
  ]

  test.beforeEach(async ({ page }) => {
    await page.route('**/rest/v1/conversation_participants**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_CONV) }),
    )
    await page.route('**/rest/v1/messages**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_MESSAGES) }),
    )

    await page.goto('/chat')
    await expect(page.getByRole('region', { name: 'Conversations' })).toBeVisible()
  })

  test('conversation list shows mocked conversation', async ({ page }) => {
    await expect(page.getByText('Emma Johnson')).toBeVisible()
  })

  test('clicking conversation loads message view', async ({ page }) => {
    await page.getByRole('button', { name: /Emma Johnson/i }).click()

    // ChatWindow should appear with the mock messages
    await expect(page.getByText('Hi there! 👋')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByText('How is your English practice going?')).toBeVisible()
  })

  test('message input accepts text', async ({ page }) => {
    await page.getByRole('button', { name: /Emma Johnson/i }).click()

    const input = page.getByRole('textbox', { name: /message/i })
    await expect(input).toBeVisible({ timeout: 5_000 })
    await input.fill('Hello!')
    await expect(input).toHaveValue('Hello!')
  })

  test('Send button is disabled when input is empty', async ({ page }) => {
    await page.getByRole('button', { name: /Emma Johnson/i }).click()

    const sendBtn = page.getByRole('button', { name: 'Send message' })
    await expect(sendBtn).toBeVisible({ timeout: 5_000 })
    await expect(sendBtn).toBeDisabled()
  })

  test('send button submits message and clears input', async ({ page }) => {
    // Mock the POST to insert message
    await page.route('**/rest/v1/messages', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 'msg-new', content: 'Great!', sender_id: 'me', created_at: new Date().toISOString() }]),
        })
      } else {
        route.continue()
      }
    })

    await page.getByRole('button', { name: /Emma Johnson/i }).click()

    const input   = page.getByRole('textbox', { name: /message/i })
    const sendBtn = page.getByRole('button', { name: 'Send message' })

    await input.fill('Great!')
    await expect(sendBtn).toBeEnabled()
    await sendBtn.click()

    // Input should clear after send
    await expect(input).toHaveValue('')
  })

  test('Enter key sends message', async ({ page }) => {
    await page.getByRole('button', { name: /Emma Johnson/i }).click()

    const input = page.getByRole('textbox', { name: /message/i })
    await expect(input).toBeVisible({ timeout: 5_000 })
    await input.fill('Sent via Enter')
    await input.press('Enter')

    await expect(input).toHaveValue('')
  })

  test('emoji picker opens and closes', async ({ page }) => {
    await page.getByRole('button', { name: /Emma Johnson/i }).click()

    const emojiBtn    = page.getByRole('button', { name: 'Open emoji picker' })
    const emojiDialog = page.getByRole('dialog', { name: 'Emoji picker' })

    await expect(emojiBtn).toBeVisible({ timeout: 5_000 })
    await emojiBtn.click()
    await expect(emojiDialog).toBeVisible()

    // Close by clicking again
    await page.getByRole('button', { name: 'Close emoji picker' }).click()
    await expect(emojiDialog).not.toBeVisible()
  })

  test('mobile back button returns to conversation list at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.getByRole('button', { name: /Emma Johnson/i }).click()

    // Back button appears on mobile
    const backBtn = page.getByRole('button', { name: '← Back' })
    await expect(backBtn).toBeVisible({ timeout: 5_000 })
    await backBtn.click()

    // Conversation list should be visible again
    await expect(page.getByRole('region', { name: 'Conversations' })).toBeVisible()
  })
})
