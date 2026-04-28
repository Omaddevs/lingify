import { supabase, IS_DEMO } from '../lib/supabase'

function computeNextReview(currentStatus, correct) {
  const now = new Date()
  const add = (days) => new Date(now.getTime() + days * 86_400_000).toISOString()
  if (!correct) return { status: 'learning', interval_days: 1, next_review: add(1) }
  if (currentStatus === 'new' || currentStatus === 'learning') return { status: 'mastered', interval_days: 7, next_review: add(7) }
  return { status: 'mastered', interval_days: 21, next_review: add(21) }
}

const DEMO_WORDS = [
  { id: '1', term: 'Comprehensive', meaning: 'Including or dealing with all or nearly all elements.', level: 'Advanced', category: 'Academic' },
  { id: '2', term: 'Meticulous',    meaning: 'Showing great attention to detail; very careful.',      level: 'Advanced', category: 'Academic' },
  { id: '3', term: 'Evident',       meaning: 'Clearly seen or understood; obvious.',                  level: 'B2',       category: 'Academic' },
  { id: '4', term: 'Collaborate',   meaning: 'To work jointly on an activity or project.',            level: 'B1',       category: 'Business' },
]

export async function getDueWords(userId, limit = 20) {
  if (IS_DEMO) return DEMO_WORDS.slice(0, limit).map((w) => ({ id: `prog-${w.id}`, status: 'new', interval_days: 1, word: w }))
  const now = new Date().toISOString()
  const { data, error } = await supabase.from('vocabulary_progress').select('id,status,interval_days,next_review,last_reviewed,word:words(id,term,meaning,level,category)').eq('user_id', userId).lte('next_review', now).order('next_review', { ascending: true }).limit(limit)
  if (error) throw error
  return data
}

export async function getVocabularyStats(userId) {
  if (IS_DEMO) return { total: 1248, mastered: 974, learning: 187, new: 87 }
  const { data, error } = await supabase.from('vocabulary_progress').select('status').eq('user_id', userId)
  if (error) throw error
  return { total: data.length, mastered: data.filter((d) => d.status === 'mastered').length, learning: data.filter((d) => d.status === 'learning').length, new: data.filter((d) => d.status === 'new').length }
}

export async function reviewWord(userId, wordId, correct) {
  if (IS_DEMO) { console.info('[Demo] reviewWord skipped'); return computeNextReview('new', correct) }
  const { data: existing } = await supabase.from('vocabulary_progress').select('status').eq('user_id', userId).eq('word_id', wordId).single()
  const next = computeNextReview(existing?.status ?? 'new', correct)
  const { error } = await supabase.from('vocabulary_progress').upsert({ user_id: userId, word_id: wordId, ...next, last_reviewed: new Date().toISOString() }, { onConflict: 'user_id,word_id' })
  if (error) throw error
  return next
}
