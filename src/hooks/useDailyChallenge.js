import { useCallback, useEffect, useState } from 'react'

const CHALLENGE_KEY = 'lingify_daily_challenge'

function todayStr() { return new Date().toISOString().slice(0, 10) }

const CHALLENGE_POOL = [
  { id: 'lesson',    title: '1 ta dars tugatish',        xp: 30,  icon: '📖', type: 'lesson' },
  { id: 'flashcard', title: '10 ta so\'z takrorlash',    xp: 25,  icon: '🧠', type: 'flashcard' },
  { id: 'test',      title: 'Mock test bo\'limini topshirish', xp: 50, icon: '📋', type: 'test' },
  { id: 'vocab5',    title: '5 ta yangi so\'z qo\'shish', xp: 20,  icon: '📝', type: 'vocab' },
  { id: 'speaking',  title: 'AI Speaking sessiyasi',      xp: 40,  icon: '🎤', type: 'speaking' },
  { id: 'streak',    title: 'Bugun tizimga kirish',        xp: 10,  icon: '🔥', type: 'streak' },
  { id: 'game',      title: 'O\'yin o\'ynash (1 marta)',   xp: 15,  icon: '🎮', type: 'game' },
  { id: 'vocab10',   title: '10 ta so\'z takrorlash',      xp: 30,  icon: '⭐', type: 'flashcard' },
]

function getDailyChallenges() {
  // Pick 3 deterministic challenges based on day
  const dayNum = Math.floor(Date.now() / 86400000)
  const pool = [...CHALLENGE_POOL]
  const selected = []
  const used = new Set()
  for (let i = 0; selected.length < 3; i++) {
    const idx = (dayNum + i * 7) % pool.length
    if (!used.has(idx)) { used.add(idx); selected.push(pool[idx]) }
  }
  return selected
}

export function useDailyChallenge() {
  const [data, setData] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CHALLENGE_KEY) || '{}')
      if (saved.date === todayStr()) return saved
    } catch {}
    return { date: todayStr(), completed: [], claimed: false, totalXP: 0 }
  })

  useEffect(() => {
    localStorage.setItem(CHALLENGE_KEY, JSON.stringify(data))
  }, [data])

  const challenges = getDailyChallenges()

  const completeChallenge = useCallback((id) => {
    setData((prev) => {
      if (prev.completed.includes(id)) return prev
      const next = { ...prev, completed: [...prev.completed, id] }
      return next
    })
  }, [])

  const claimRewards = useCallback(() => {
    const pending = challenges.filter((c) => data.completed.includes(c.id) && !data.claimed)
    const xp = pending.reduce((s, c) => s + c.xp, 0)
    setData((prev) => ({ ...prev, claimed: true, totalXP: prev.totalXP + xp }))
    return xp
  }, [challenges, data])

  const isCompleted  = useCallback((id) => data.completed.includes(id), [data])
  const allDone      = challenges.every((c) => data.completed.includes(c.id))
  const completedCount = challenges.filter((c) => data.completed.includes(c.id)).length
  const totalDayXP   = challenges.filter((c) => data.completed.includes(c.id)).reduce((s,c) => s+c.xp, 0)

  return {
    challenges,
    completed:    data.completed,
    claimed:      data.claimed,
    allDone,
    completedCount,
    totalDayXP,
    completeChallenge,
    claimRewards,
    isCompleted,
  }
}
