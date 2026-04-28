import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, IS_DEMO } from '../lib/supabase'
import { getProfile } from '../services/profileService'

export const UserContext = createContext(null)

// ── Demo user shown when Supabase is not configured ──────────────────────────
const DEMO_USER = {
  id:              'demo-user-id',
  name:            'Asadbek',
  email:           'asadbek@lingify.uz',
  username:        'asadbek_01',
  avatar:          null,
  avatar_url:      null,
  level:           'B1',
  streak:          12,
  streak_count:    12,
  isAuthenticated: true,
}

export function UserProvider({ children }) {
  const [user,    setUserState] = useState(IS_DEMO ? DEMO_USER : null)
  const [session, setSession]   = useState(null)
  const [loading, setLoading]   = useState(!IS_DEMO)  // demo: no loading

  // ── Demo mode: skip all Supabase calls ──────────────────────────────────
  useEffect(() => {
    if (IS_DEMO) return

    async function loadProfile(sbUser) {
      try {
        const profile = await getProfile(sbUser.id)
        setUserState({
          id:            profile.id,
          name:          profile.name          ?? sbUser.user_metadata?.name ?? 'User',
          email:         profile.email         ?? sbUser.email,
          username:      profile.username      ?? profile.email?.split('@')[0],
          avatar:        profile.avatar_url    ?? null,
          avatar_url:    profile.avatar_url    ?? null,
          level:         profile.level         ?? 'B1',
          streak:        profile.streak_count  ?? 0,
          streak_count:  profile.streak_count  ?? 0,
          isAuthenticated: true,
        })
      } catch {
        setUserState({
          id:            sbUser.id,
          name:          sbUser.user_metadata?.name ?? 'User',
          email:         sbUser.email,
          username:      sbUser.email?.split('@')[0],
          avatar:        null,
          avatar_url:    null,
          level:         'B1',
          streak:        0,
          streak_count:  0,
          isAuthenticated: true,
        })
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        loadProfile(session.user).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        if (session?.user) {
          await loadProfile(session.user)
        } else {
          setUserState(null)
        }
        setLoading(false)
      },
    )

    return () => subscription.unsubscribe()
  }, [])

  async function logout() {
    if (IS_DEMO) { console.info('[Demo] Logout is disabled in demo mode.'); return }
    await supabase.auth.signOut()
    setUserState(null)
    setSession(null)
  }

  function patchUser(updates) {
    setUserState((prev) => (prev ? { ...prev, ...updates } : prev))
  }

  return (
    <UserContext.Provider value={{ user, session, loading, setUser: patchUser, logout, isDemo: IS_DEMO }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within <UserProvider>')
  return ctx
}
