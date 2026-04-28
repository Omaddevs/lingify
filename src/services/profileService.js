import { supabase, IS_DEMO } from '../lib/supabase'

export async function getProfile(userId) {
  if (IS_DEMO) return { id: userId, name: 'Asadbek', email: 'asadbek@lingify.uz', username: 'asadbek_01', avatar_url: null, level: 'B1', streak_count: 12 }
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data
}

export async function updateProfile(userId, updates) {
  if (IS_DEMO) { console.info('[Demo] updateProfile skipped'); return updates }
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single()
  if (error) throw error
  return data
}

export async function uploadAvatar(userId, file) {
  if (IS_DEMO) { console.info('[Demo] uploadAvatar skipped'); return URL.createObjectURL(file) }
  const ext  = file.name.split('.').pop()
  const path = `${userId}/avatar.${ext}`
  const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type })
  if (uploadError) throw uploadError
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  const avatarUrl = `${data.publicUrl}?t=${Date.now()}`
  await updateProfile(userId, { avatar_url: avatarUrl })
  return avatarUrl
}
