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
  isFirstTime: false,
  onboardingCompleted: true,
}

const DEMO_STORAGE_KEY = 'lingify_demo_auth'

function buildDemoUser(overrides = {}) {
  return {
    ...DEMO_USER,
    ...overrides,
    isAuthenticated: true,
  }
}

export function UserProvider({ children }) {
  const [user,    setUserState] = useState(() => {
    if (!IS_DEMO) return null
    const raw = localStorage.getItem(DEMO_STORAGE_KEY)
    if (!raw) return null
    try {
      return buildDemoUser(JSON.parse(raw))
    } catch {
      return null
    }
  })
  const [session, setSession]   = useState(null)
  const [loading, setLoading]   = useState(!IS_DEMO)  // demo: no loading
  const profile = user
    ? {
        name: user.name ?? 'User',
        avatar_url: user.avatar_url ?? user.avatar ?? null,
      }
    : null

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
          onboardingCompleted: profile.onboarding_completed ?? false,
          isFirstTime: !(profile.onboarding_completed ?? false),
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
          onboardingCompleted: false,
          isFirstTime: true,
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
    if (IS_DEMO) {
      localStorage.removeItem(DEMO_STORAGE_KEY)
      setUserState(null)
      return
    }
    await supabase.auth.signOut()
    setUserState(null)
    setSession(null)
  }

  function patchUser(updates) {
    setUserState((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...updates }
      if (IS_DEMO) {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next))
      }
      return next
    })
  }

  function registerDemoUser({ name, contact, role }) {
    const demoUser = buildDemoUser({
      name: name?.trim() || 'Asadbek',
      email: contact?.includes('@') ? contact : `${(name || 'user').toLowerCase().replace(/\s+/g, '')}@lingify.demo`,
      role: role || 'student',
      isFirstTime: true,
      onboardingCompleted: false,
      level: null,
    })
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser))
    setUserState(demoUser)
  }

  function completeOnboarding(payload) {
    patchUser({
      ...payload,
      onboardingCompleted: true,
      isFirstTime: false,
      level: payload?.level || 'B1',
    })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        setUser: patchUser,
        logout,
        isDemo: IS_DEMO,
        registerDemoUser,
        completeOnboarding,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within <UserProvider>')
  return ctx
}
