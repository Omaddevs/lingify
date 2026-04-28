import { supabase, IS_DEMO } from '../lib/supabase'

function scoreToBand(score) {
  if (score >= 95) return 9.0; if (score >= 88) return 8.5; if (score >= 82) return 8.0
  if (score >= 75) return 7.5; if (score >= 68) return 7.0; if (score >= 60) return 6.5
  if (score >= 52) return 6.0; if (score >= 44) return 5.5; if (score >= 36) return 5.0
  return 4.5
}

const DEMO_HISTORY = [
  { id: '1', exam_type: 'IELTS', score: 72, band_score: 7.0, passed: true, completed_at: new Date(Date.now() - 2*86400000).toISOString() },
  { id: '2', exam_type: 'IELTS', score: 65, band_score: 6.5, passed: false, completed_at: new Date(Date.now() - 7*86400000).toISOString() },
  { id: '3', exam_type: 'IELTS', score: 75, band_score: 7.5, passed: true, completed_at: new Date(Date.now() - 14*86400000).toISOString() },
]

export async function submitExamResult({ userId, examId, examType, score, answers, sectionScores }) {
  if (IS_DEMO) { console.info('[Demo] Exam result not persisted'); return { id: Date.now().toString(), score, band_score: scoreToBand(score), passed: score >= 70 } }
  const { data, error } = await supabase.from('exam_results').insert({ user_id: userId, exam_id: examId, exam_type: examType, score, band_score: scoreToBand(score), answers: answers ?? null, section_scores: sectionScores ?? null }).select().single()
  if (error) throw error
  return data
}

export async function getExamHistory(userId, limit = 20) {
  if (IS_DEMO) return DEMO_HISTORY
  const { data, error } = await supabase.from('exam_results').select('id,exam_id,exam_type,score,band_score,passed,section_scores,completed_at').eq('user_id', userId).order('completed_at', { ascending: false }).limit(limit)
  if (error) throw error
  return data
}

export async function getExamStats(userId) {
  if (IS_DEMO) return { taken: 3, bestScore: 75, bestBand: 7.5, avgScore: 71, passed: 2, recent: DEMO_HISTORY.reverse().map((d) => ({ date: new Date(d.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), score: d.score, band: d.band_score })) }
  const { data, error } = await supabase.from('exam_results').select('score,band_score,passed,completed_at').eq('user_id', userId).order('completed_at', { ascending: false })
  if (error) throw error
  if (!data.length) return { taken: 0, bestScore: null, avgScore: null, passed: 0 }
  const scores = data.map((d) => d.score)
  return { taken: data.length, bestScore: Math.max(...scores), bestBand: Math.max(...data.map((d) => d.band_score ?? 0)), avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length), passed: data.filter((d) => d.passed).length, recent: data.slice(0, 8).reverse().map((d) => ({ date: new Date(d.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), score: d.score, band: d.band_score })) }
}
