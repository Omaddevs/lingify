import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Target,
  Zap,
} from 'lucide-react'
import { calculateLevel, PLACEMENT_TEST } from '../data/curriculum'
import { useUser } from '../context/UserContext'

const LEVEL_INFO = {
  A0: {
    label: 'Mutlaq Boshlang\'ich',
    color: 'from-slate-400 to-slate-600',
    bg: 'bg-slate-50 border-slate-200',
    desc: 'Ingliz tilini noldan boshlaymiz. Alifbo, asosiy so\'zlar va oddiy gaplardan boshlaymiz.',
    nextGoal: 'A1 darajasiga o\'tish',
    emoji: '🌱',
  },
  A1: {
    label: 'Boshlang\'ich',
    color: 'from-emerald-400 to-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
    desc: 'Asosiy salomlashish, oila, kundalik hayot mavzularida oddiy jumlalar tuza olasiz.',
    nextGoal: 'A2 darajasiga o\'tish',
    emoji: '🌿',
  },
  A2: {
    label: 'Elementar',
    color: 'from-sky-400 to-sky-600',
    bg: 'bg-sky-50 border-sky-200',
    desc: 'Odatiy vaziyatlarda qisqa suhbatlar qura olasiz. Present va Past Simple yaxshi bilasiz.',
    nextGoal: 'B1 darajasiga o\'tish',
    emoji: '🌊',
  },
  B1: {
    label: 'O\'rta',
    color: 'from-indigo-400 to-indigo-600',
    bg: 'bg-indigo-50 border-indigo-200',
    desc: 'Ko\'pchilik kundalik mavzularda muloqot qila olasiz. IELTS 4.5-5.5 darajasiga mos.',
    nextGoal: 'B2 darajasiga o\'tish',
    emoji: '⚡',
  },
  B2: {
    label: 'Yuqori O\'rta',
    color: 'from-violet-400 to-violet-600',
    bg: 'bg-violet-50 border-violet-200',
    desc: 'Murakkab mavzularda erkin gaplasha olasiz. IELTS 6.0-7.0 darajasiga mos.',
    nextGoal: 'C1 darajasiga o\'tish',
    emoji: '🔥',
  },
  C1: {
    label: 'Ilg\'or',
    color: 'from-amber-400 to-amber-600',
    bg: 'bg-amber-50 border-amber-200',
    desc: 'Deyarli barcha mavzularda erkin va aniq muloqot qila olasiz. IELTS 7.0+ darajasi.',
    nextGoal: 'C2 darajasiga o\'tish',
    emoji: '🏆',
  },
}

// ── Intro screen ────────────────────────────────────────────────────────────
function IntroScreen({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center py-8 text-center"
    >
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg">
        <Target size={44} className="text-white" />
      </div>

      <h1 className="text-3xl font-bold text-slate-900">Daraja Testi</h1>
      <p className="mt-3 max-w-sm text-slate-500">
        15 ta savol orqali ingliz tili darajangizni aniqlaymiz va sizga mos darslarni tavsiya qilamiz.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
        {[
          { icon: Clock,    label: '5-7 daqiqa',     sub: 'Taxminiy vaqt' },
          { icon: BookOpen, label: '15 ta savol',     sub: 'Grammatika' },
          { icon: Award,    label: 'A0 dan C1 gacha', sub: 'Daraja oralig\'i' },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
              <Icon size={18} className="text-indigo-600" />
            </div>
            <p className="font-semibold text-slate-900">{label}</p>
            <p className="text-xs text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
        💡 Har bir savolda faqat <strong>bitta to'g'ri javob</strong> bor. Iltimos, o'ylamasdan tanlamang.
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-8 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl"
      >
        Testni boshlash
        <ArrowRight size={18} />
      </button>
    </motion.div>
  )
}

// ── Question card ───────────────────────────────────────────────────────────
function QuestionCard({ question, index, total, selected, onSelect }) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
        Savol {index + 1} / {total}
      </p>
      <h2 className="mb-8 text-xl font-bold text-slate-900">{question.question}</h2>

      <div className="grid gap-3">
        {question.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left text-sm font-medium transition-all ${
              selected === i
                ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                selected === i
                  ? 'border-indigo-500 bg-indigo-500 text-white'
                  : 'border-slate-300 text-slate-500'
              }`}
            >
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ── Results screen ──────────────────────────────────────────────────────────
function ResultsScreen({ level, score, total, onSave, onRetry }) {
  const info = LEVEL_INFO[level] || LEVEL_INFO.A1
  const pct = Math.round((score / total) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="mb-2 text-5xl">{info.emoji}</div>
      <h2 className="text-3xl font-bold text-slate-900">Sizning darajangiz</h2>

      <div className={`mx-auto mt-6 max-w-xs rounded-3xl border-2 p-6 ${info.bg}`}>
        <div
          className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${info.color}`}
        >
          <span className="text-2xl font-black">{level}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900">{info.label}</h3>
        <p className="mt-2 text-sm text-slate-600">{info.desc}</p>
      </div>

      <div className="mt-6 flex justify-center gap-6 text-center text-sm">
        <div>
          <p className="text-2xl font-bold text-slate-900">{score}/{total}</p>
          <p className="text-slate-400">To'g'ri javob</p>
        </div>
        <div className="w-px bg-slate-200" />
        <div>
          <p className="text-2xl font-bold text-indigo-700">{pct}%</p>
          <p className="text-slate-400">Natija</p>
        </div>
        <div className="w-px bg-slate-200" />
        <div>
          <p className="text-2xl font-bold text-slate-900">{level}</p>
          <p className="text-slate-400">Daraja</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
        <div className="flex items-center gap-2">
          <ChevronRight size={14} className="text-indigo-500" />
          <p className="text-sm font-semibold text-indigo-800">Keyingi maqsad: {info.nextGoal}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Qayta topshirish
        </button>
        <button
          type="button"
          onClick={() => onSave(level)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 py-3 text-sm font-bold text-white shadow-md"
        >
          <CheckCircle2 size={16} />
          Darajamni saqlash va o'rganishni boshlash
        </button>
      </div>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
function PlacementTestPage() {
  const navigate = useNavigate()
  const { setUser } = useUser()
  const questions = PLACEMENT_TEST

  const [phase, setPhase] = useState('intro') // intro | test | results
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState(Array(questions.length).fill(null))
  const [selectedOption, setSelectedOption] = useState(null)
  const [resultLevel, setResultLevel] = useState(null)

  const progressPct = phase === 'test' ? ((currentIdx) / questions.length) * 100 : 0

  function handleSelect(optionIdx) {
    setSelectedOption(optionIdx)
  }

  function handleNext() {
    if (selectedOption === null) return
    const newAnswers = [...answers]
    newAnswers[currentIdx] = selectedOption

    if (currentIdx + 1 < questions.length) {
      setAnswers(newAnswers)
      setSelectedOption(null)
      setCurrentIdx((i) => i + 1)
    } else {
      setAnswers(newAnswers)
      const level = calculateLevel(newAnswers, questions)
      setResultLevel(level)
      setPhase('results')
    }
  }

  function handleSaveLevel(level) {
    setUser({ level })
    navigate('/online-lessons')
  }

  function handleRetry() {
    setPhase('intro')
    setCurrentIdx(0)
    setAnswers(Array(questions.length).fill(null))
    setSelectedOption(null)
    setResultLevel(null)
  }

  const correctCount = resultLevel
    ? answers.filter((a, i) => a === questions[i].correct).length
    : 0

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar (only during test) */}
      {phase === 'test' && (
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="mx-auto flex max-w-2xl items-center gap-4">
            <Zap size={16} className="shrink-0 text-indigo-500" />
            <div className="flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {currentIdx}/{questions.length}
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Back link */}
        {phase === 'intro' && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 text-sm font-medium text-slate-400 hover:text-slate-600"
          >
            ← Orqaga
          </button>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <AnimatePresence mode="wait">
            {phase === 'intro' && (
              <IntroScreen key="intro" onStart={() => setPhase('test')} />
            )}

            {phase === 'test' && (
              <motion.div key={`q-${currentIdx}`}>
                <QuestionCard
                  question={questions[currentIdx]}
                  index={currentIdx}
                  total={questions.length}
                  selected={selectedOption}
                  onSelect={handleSelect}
                />

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex gap-1">
                    {questions.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i < currentIdx
                            ? 'w-3 bg-indigo-400'
                            : i === currentIdx
                            ? 'w-5 bg-indigo-600'
                            : 'w-1.5 bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 py-3 text-sm font-bold text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
                  >
                    {currentIdx + 1 < questions.length ? 'Keyingisi' : 'Natijani ko\'rish'}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {phase === 'results' && resultLevel && (
              <ResultsScreen
                key="results"
                level={resultLevel}
                score={correctCount}
                total={questions.length}
                onSave={handleSaveLevel}
                onRetry={handleRetry}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default PlacementTestPage
