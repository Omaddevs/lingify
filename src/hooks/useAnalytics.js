// ─────────────────────────────────────────────────────────────────────────────
//  Lingify Analytics
//  — Logs events to console in DEV
//  — In production: swap with Mixpanel / GA4 / PostHog
// ─────────────────────────────────────────────────────────────────────────────

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

// ── Event queue (for offline / pre-init) ─────────────────────────────────────
const queue = []

function dispatch(eventName, properties = {}) {
  const payload = {
    event:     eventName,
    timestamp: new Date().toISOString(),
    url:       window.location.pathname,
    ...properties,
  }

  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${eventName}`, payload)
    return
  }

  // ── Google Analytics 4 ──────────────────────────────────────────────────
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, properties)
    return
  }

  // ── Queue for when GA loads ─────────────────────────────────────────────
  queue.push(payload)
}

// ─────────────────────────────────────────────────────────────────────────────
//  Pre-defined events
// ─────────────────────────────────────────────────────────────────────────────
export const analytics = {
  // Auth
  signup:           (method = 'email')     => dispatch('sign_up',             { method }),
  login:            (method = 'email')     => dispatch('login',               { method }),
  logout:           ()                     => dispatch('logout'),

  // Onboarding
  onboardingStart:  ()                     => dispatch('onboarding_start'),
  onboardingFinish: (level)                => dispatch('onboarding_finish',   { level }),

  // Lessons
  lessonStart:      (id, level)            => dispatch('lesson_start',        { lesson_id: id, level }),
  lessonComplete:   (id, xp)               => dispatch('lesson_complete',     { lesson_id: id, xp }),
  quizAnswer:       (correct)              => dispatch('quiz_answer',         { correct }),

  // Vocabulary
  wordAdded:        ()                     => dispatch('word_added'),
  flashcardSession: (count)                => dispatch('flashcard_session',   { word_count: count }),

  // Mock tests
  testStart:        (testId, type)         => dispatch('test_start',          { test_id: testId, test_type: type }),
  testComplete:     (testId, band)         => dispatch('test_complete',       { test_id: testId, band }),

  // Speaking
  speakingSession:  (topic, durationSec)   => dispatch('speaking_session',   { topic, duration_sec: durationSec }),

  // Games
  gamePlay:         (gameId)               => dispatch('game_play',           { game_id: gameId }),
  gameComplete:     (gameId, score)        => dispatch('game_complete',       { game_id: gameId, score }),

  // Partner
  partnerConnect:   ()                     => dispatch('partner_connect'),
  partnerMessage:   ()                     => dispatch('partner_message'),

  // Payments
  upgradeClick:     (plan)                 => dispatch('upgrade_click',       { plan }),
  paymentSuccess:   (plan, amount)         => dispatch('purchase',            { plan, value: amount, currency: 'UZS' }),

  // Engagement
  searchQuery:      (query)                => dispatch('search',              { query: query.slice(0, 50) }),
  pageView:         (path)                 => dispatch('page_view',           { page_path: path }),
  shareAction:      (content)              => dispatch('share',               { content_type: content }),

  // Custom
  track: dispatch,
}

// ─────────────────────────────────────────────────────────────────────────────
//  React hook
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export function usePageTracking() {
  const location = useLocation()
  const lastPath = useRef('')

  useEffect(() => {
    if (location.pathname !== lastPath.current) {
      lastPath.current = location.pathname
      analytics.pageView(location.pathname)
    }
  }, [location.pathname])
}

export function useAnalytics() {
  return analytics
}

export default analytics
