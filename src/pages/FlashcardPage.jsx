import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Trophy,
  Volume2,
  X,
  Zap,
} from 'lucide-react'
import { useVocabulary } from '../hooks/useVocabulary'

// ── Card flip animation ─────────────────────────────────────────────────────
function FlashCard({ word, flipped, onFlip, onSpeak }) {
  return (
    <div
      className="relative h-72 w-full cursor-pointer"
      style={{ perspective: 1200 }}
      onClick={onFlip}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-8 shadow-sm"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-indigo-400">
            So'z
          </p>
          <h2 className="text-4xl font-bold text-slate-900">{word.word}</h2>
          {word.pronunciation && (
            <p className="mt-2 text-sm text-slate-400">/{word.pronunciation}/</p>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSpeak(word.word) }}
            className="mt-4 flex items-center gap-1.5 rounded-full border border-indigo-200 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
          >
            <Volume2 size={13} />
            Tinglash
          </button>
          <p className="mt-6 text-xs text-slate-400">Karta ustiga bosing → ma'nosi</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 shadow-sm"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-emerald-500">
            Ma'nosi
          </p>
          <p className="text-center text-lg font-semibold text-slate-800">{word.definition}</p>
          {word.translation && (
            <div className="mt-3 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
              🇺🇿 {word.translation}
            </div>
          )}
          {word.example && (
            <p className="mt-4 text-center text-sm italic text-slate-500">"{word.example}"</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ── Rating buttons ──────────────────────────────────────────────────────────
function RatingButtons({ onRate }) {
  const buttons = [
    { quality: 0, label: 'Bilmadim', color: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' },
    { quality: 1, label: 'Qiyin', color: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' },
    { quality: 2, label: 'Yaxshi', color: 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100' },
    { quality: 3, label: 'Oson', color: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
  ]

  return (
    <div className="mt-6 grid grid-cols-4 gap-2">
      {buttons.map(({ quality, label, color }) => (
        <button
          key={quality}
          type="button"
          onClick={() => onRate(quality)}
          className={`rounded-2xl border-2 py-3 text-xs font-semibold transition-all ${color}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

// ── Results screen ───────────────────────────────────────────────────────────
function SessionResults({ stats, total, onRestart, onFinish }) {
  const known = stats.filter((s) => s >= 2).length
  const pct = Math.round((known / total) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center py-10 text-center"
    >
      <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100">
        <Trophy size={40} className="text-indigo-600" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900">Sessiya tugadi!</h2>
      <p className="mt-2 text-slate-500">
        {known}/{total} so'zni yaxshi bildingiz ({pct}%)
      </p>

      <div className="mt-6 grid grid-cols-4 gap-3 text-center">
        {[
          { label: 'Bilmadim', count: stats.filter((s) => s === 0).length, color: 'text-red-600 bg-red-50' },
          { label: 'Qiyin', count: stats.filter((s) => s === 1).length, color: 'text-amber-600 bg-amber-50' },
          { label: 'Yaxshi', count: stats.filter((s) => s === 2).length, color: 'text-sky-600 bg-sky-50' },
          { label: 'Oson', count: stats.filter((s) => s === 3).length, color: 'text-emerald-600 bg-emerald-50' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`rounded-2xl p-3 ${color}`}>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs font-medium">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RotateCcw size={15} />
          Qayta o'rganish
        </button>
        <button
          type="button"
          onClick={onFinish}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white"
        >
          <CheckCircle2 size={15} />
          Tugatish
        </button>
      </div>
    </motion.div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
function FlashcardPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const folderId = searchParams.get('folder')
  const { words, folders, getWordsByFolder, reviewWord, speakWord, getDueWords } = useVocabulary()

  const sessionWords = useMemo(() => {
    if (folderId) return getWordsByFolder(folderId)
    const due = getDueWords()
    return due.length > 0 ? due : words.slice(0, 20)
  }, [folderId, getWordsByFolder, getDueWords, words])

  const folder = folderId ? folders.find((f) => f.id === folderId) : null

  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [phase, setPhase] = useState('session') // session | done
  const [ratings, setRatings] = useState([])

  const currentWord = sessionWords[cardIdx]

  const handleRate = useCallback(
    (quality) => {
      if (!currentWord) return
      reviewWord(currentWord.id, quality)
      setRatings((r) => [...r, quality])
      setFlipped(false)

      setTimeout(() => {
        if (cardIdx + 1 < sessionWords.length) {
          setCardIdx((i) => i + 1)
        } else {
          setPhase('done')
        }
      }, 200)
    },
    [currentWord, cardIdx, sessionWords.length, reviewWord],
  )

  function restart() {
    setCardIdx(0)
    setFlipped(false)
    setRatings([])
    setPhase('session')
  }

  if (sessionWords.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
          <CheckCircle2 size={36} className="text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Barcha so'zlar o'rganildi!</h2>
        <p className="text-slate-500">Bugun takrorlanadigan so'z yo'q. Ertaga qaytib keling.</p>
        <button
          onClick={() => navigate('/vocabulary')}
          className="mt-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Lug'atga qaytish
        </button>
      </div>
    )
  }

  const progressPct = ((cardIdx) / sessionWords.length) * 100

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-xl items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/vocabulary')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50"
          >
            <X size={16} />
          </button>

          <div className="flex-1">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <span className="text-sm font-semibold text-slate-700">
            {cardIdx}/{sessionWords.length}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/vocabulary')}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {folder ? `${folder.emoji} ${folder.name}` : 'Bugungi takrorlash'}
            </h1>
            <p className="text-xs text-slate-500">{sessionWords.length} ta so'z</p>
          </div>
          <div className="ml-auto flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <Zap size={12} />
            Flashcard
          </div>
        </div>

        {/* Main content */}
        <AnimatePresence mode="wait">
          {phase === 'session' && currentWord ? (
            <motion.div
              key={`card-${cardIdx}`}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.25 }}
            >
              <FlashCard
                word={currentWord}
                flipped={flipped}
                onFlip={() => setFlipped((f) => !f)}
                onSpeak={speakWord}
              />

              {flipped ? (
                <>
                  <p className="mt-5 text-center text-xs text-slate-400">
                    Bu so'zni qanchalik bilasiz?
                  </p>
                  <RatingButtons onRate={handleRate} />
                </>
              ) : (
                <div className="mt-5 text-center">
                  <p className="text-sm text-slate-400">
                    Kartaga bosing → ma'nosini ko'ring
                  </p>
                  <div className="mt-4 flex justify-center gap-6 text-xs text-slate-400">
                    <button
                      type="button"
                      onClick={() => {
                        if (cardIdx > 0) {
                          setCardIdx((i) => i - 1)
                          setFlipped(false)
                        }
                      }}
                      disabled={cardIdx === 0}
                      className="flex items-center gap-1 disabled:opacity-30"
                    >
                      <ArrowLeft size={13} />
                      Oldingi
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlipped(true)}
                      className="flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
                    >
                      Ma'nosini ko'rish
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* Word level badge */}
              <div className="mt-6 flex items-center justify-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                  {currentWord.level}
                </span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full ${
                        i < (currentWord.mastery || 0) ? 'bg-indigo-500' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  Daraja: {currentWord.mastery || 0}/5
                </span>
              </div>
            </motion.div>
          ) : phase === 'done' ? (
            <SessionResults
              key="results"
              stats={ratings}
              total={sessionWords.length}
              onRestart={restart}
              onFinish={() => navigate('/vocabulary')}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FlashcardPage
