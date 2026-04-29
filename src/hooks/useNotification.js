import { useCallback, useState } from 'react'

export function useNotification() {
  const [notifications, setNotifications] = useState([])

  const push = useCallback((msg, type = 'info') => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, msg, type }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 3000)
  }, [])

  const xp    = useCallback((amount, reason = '') => push(`+${amount} XP${reason ? ` — ${reason}` : ''}`, 'xp'), [push])
  const info  = useCallback((msg) => push(msg, 'info'), [push])
  const success = useCallback((msg) => push(msg, 'success'), [push])
  const streak  = useCallback((days) => push(`🔥 ${days} kunlik streak!`, 'streak'), [push])

  return { notifications, push, xp, info, success, streak }
}
