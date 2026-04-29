import { useCallback, useEffect, useState } from 'react'

const DARK_KEY = 'lingify_dark_mode'

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem(DARK_KEY)
    if (saved !== null) return saved === 'true'
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem(DARK_KEY, String(dark))
  }, [dark])

  const toggle = useCallback(() => setDark((v) => !v), [])

  return { dark, toggle, setDark }
}
