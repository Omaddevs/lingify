import { useCallback, useEffect, useState } from 'react'

const STREAK_KEY    = 'lingify_streak'
const LAST_SEEN_KEY = 'lingify_last_seen'

function todayStr() {
  return new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD'
}

function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function useStreak() {
  const [streak, setStreak] = useState(() => {
    const saved    = Number(localStorage.getItem(STREAK_KEY) || 0)
    const lastSeen = localStorage.getItem(LAST_SEEN_KEY) || ''
    const today    = todayStr()
    const yesterday = yesterdayStr()

    // If last seen was yesterday → streak still valid
    // If last seen was today     → streak still valid
    // Anything older             → reset to 0
    if (lastSeen === today || lastSeen === yesterday) return saved
    return 0
  })

  const [studiedToday, setStudiedToday] = useState(() => {
    return localStorage.getItem(LAST_SEEN_KEY) === todayStr()
  })

  // Mark today as studied — call this when user completes any activity
  const markStudied = useCallback(() => {
    const today     = todayStr()
    const yesterday = yesterdayStr()
    const lastSeen  = localStorage.getItem(LAST_SEEN_KEY) || ''

    if (lastSeen === today) return // already counted today

    setStreak((prev) => {
      const next = lastSeen === yesterday ? prev + 1 : 1
      localStorage.setItem(STREAK_KEY, String(next))
      return next
    })
    localStorage.setItem(LAST_SEEN_KEY, today)
    setStudiedToday(true)
  }, [])

  // Auto-mark on mount if they have any lesson/vocab progress
  useEffect(() => {
    const hasProgress = Object.keys(localStorage).some(
      (k) => k === 'lingify_lesson_progress' || k === 'lingify_vocabulary',
    )
    if (hasProgress) markStudied()
  }, [markStudied])

  return { streak, studiedToday, markStudied }
}
