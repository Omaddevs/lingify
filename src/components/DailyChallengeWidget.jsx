import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ChevronRight, Flame, Trophy, X, Zap } from 'lucide-react'
import { useDailyChallenge } from '../hooks/useDailyChallenge'

const CHALLENGE_PATHS = {
  lesson:    '/online-lessons',
  flashcard: '/flashcards',
  test:      '/mock-exam',
  vocab:     '/vocabulary',
  speaking:  '/speaking-practice',
  streak:    null,
  game:      '/games',
}

function ChallengeRow({ challenge, done, onGo }) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl border-2 p-3 transition ${done ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-100 bg-white hover:border-indigo-200'}`}>
      <span className="text-xl shrink-0">{challenge.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${done ? 'text-emerald-700 line-through opacity-70' : 'text-slate-800'}`}>
          {challenge.title}
        </p>
        <p className="flex items-center gap-1 text-[11px] text-slate-400">
          <Zap size={10} className="text-amber-400" />+{challenge.xp} XP
        </p>
      </div>
      {done ? (
        <CheckCircle2 size={20} className="shrink-0 text-emerald-500" />
      ) : (
        <button onClick={() => onGo(challenge)}
          className="shrink-0 flex items-center gap-1 rounded-xl bg-indigo-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-indigo-700 transition">
          Boshlash <ChevronRight size={11} />
        </button>
      )}
    </div>
  )
}

export function DailyChallengeWidget() {
  const navigate  = useNavigate()
  const { challenges, completedCount, allDone, totalDayXP, claimRewards, claimed, isCompleted } = useDailyChallenge()
  const [showClaim, setShowClaim] = useState(false)
  const [claimedXP, setClaimedXP] = useState(0)

  function handleClaim() {
    const xp = claimRewards()
    setClaimedXP(xp)
    setShowClaim(true)
    setTimeout(() => setShowClaim(false), 3000)
  }

  function handleGo(challenge) {
    const path = CHALLENGE_PATHS[challenge.type]
    if (path) navigate(path)
  }

  const pct = Math.round((completedCount / challenges.length) * 100)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100">
            <Flame size={16} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">Kunlik topshiriqlar</p>
            <p className="text-[11px] text-slate-400">{completedCount}/{challenges.length} bajarildi</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-700">
          <Zap size={11} />{totalDayXP} XP
        </div>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${pct === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`} />
        </div>
        <p className="mt-0.5 text-right text-[10px] text-slate-400">{pct}%</p>
      </div>

      {/* Challenges */}
      <div className="space-y-2">
        {challenges.map((c) => (
          <ChallengeRow key={c.id} challenge={c} done={isCompleted(c.id)} onGo={handleGo} />
        ))}
      </div>

      {/* Claim button */}
      {allDone && !claimed && (
        <motion.button initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={handleClaim}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-black text-white shadow-md hover:shadow-lg transition">
          <Trophy size={16} />Mukofot olish! +{totalDayXP} XP
        </motion.button>
      )}

      {claimed && (
        <div className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 py-2.5 text-sm font-bold text-emerald-700">
          <CheckCircle2 size={15} />Bugungi topshiriqlar bajarildi ✓
        </div>
      )}

      {/* Claim animation */}
      <AnimatePresence>
        {showClaim && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowClaim(false)}>
            <motion.div className="rounded-3xl bg-white p-8 text-center shadow-2xl mx-4 max-w-sm w-full">
              <div className="text-6xl mb-3">🎉</div>
              <h3 className="text-2xl font-black text-slate-900">Barakalla!</h3>
              <p className="text-slate-500 mt-1">Barcha kunlik topshiriqlar bajarildi</p>
              <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3">
                <Zap size={20} className="text-amber-500" />
                <span className="text-2xl font-black text-amber-700">+{claimedXP} XP</span>
              </div>
              <button onClick={() => setShowClaim(false)}
                className="mt-4 rounded-2xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white">
                Davom etish →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DailyChallengeWidget
