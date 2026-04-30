import { useCallback, useEffect, useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
//  usePWAInstall
//  Handles the browser's "Add to Home Screen" / "Install App" prompt
// ─────────────────────────────────────────────────────────────────────────────
export function usePWAInstall() {
  const [prompt,    setPrompt]    = useState(null)
  const [installed, setInstalled] = useState(false)
  const [isIOS,     setIsIOS]     = useState(false)

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    // Detect iOS Safari (no beforeinstallprompt)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream
    setIsIOS(ios)

    // Capture the install prompt
    function onBeforeInstall(e) {
      e.preventDefault()
      setPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setPrompt(null)
    })

    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  const install = useCallback(async () => {
    if (!prompt) return false
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
      setPrompt(null)
    }
    return outcome === 'accepted'
  }, [prompt])

  const canInstall = !!prompt || (isIOS && !installed)

  return { canInstall, install, installed, isIOS }
}
