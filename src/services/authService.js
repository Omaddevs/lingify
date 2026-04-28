import { supabase, IS_DEMO } from '../lib/supabase'

export async function signUp({ email, password, name }) {
  if (IS_DEMO) throw new Error('Auth is disabled in demo mode. Please configure Supabase.')
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
  if (error) throw error
  return data
}

export async function signIn({ email, password }) {
  if (IS_DEMO) throw new Error('Auth is disabled in demo mode. Please configure Supabase.')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  if (IS_DEMO) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  if (IS_DEMO) return null
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}
