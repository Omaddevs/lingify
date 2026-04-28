import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  RotateCcw,
  Star,
  Trophy,
  X,
  Zap,
} from 'lucide-react'
import { getLessonById, getNextLesson } from '../data/curriculum'
import { useLessonProgress } from '../hooks/useVocabulary'

// ── Quiz exercise component ─────────────────────────────────────────────────
function ExerciseCard({ exercise, index, total, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)

  function choose(i) {
    if (revealed) return
    setSelected(i)
    setRevealed(true)
    setTimeout(() => onAnswer(i === exercise.correct), 1200)
  }

  return (
    <motion.div
      key={exercise.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="w-full"
    >
      <p className="mb-1 text-xs font-medium text-indigo-500">
        Savol {index + 1} / {total}
      </p>
      <h3 className="mb-6 text-xl font-bold text-slate-900">{exercise.question}</h3>

      <div className="grid gap-3">
        {exercise.options.map((opt, i) => {
          let cls = 'rounded-2xl border-2 px-5 py-4 text-left text-sm font-medium transition-all '
          if (!revealed) {
            cls += 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer'
          } else if (i === exercise.correct) {
            cls += 'border-emerald-400 bg-emerald-50 text-emerald-800'
          } else if (i === selected) {
            cls += 'border-red-400 bg-red-50 text-red-700'
          } else {
            cls += 'border-slate-100 bg-slate-50 text-slate-400'
          }

          return (
            <button key={i} type="button" onClick={() => choose(i)} className={cls}>
              <span className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
                {revealed && i === exercise.correct && (
                  <CheckCircle2 size={16} className="ml-auto text-emerald-500" />
                )}
              </span>
            </button>
          )
        })}
      </div>

      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 rounded-xl p-3 text-sm ${
            selected === exercise.correct
              ? 'bg-emerald-50 text-emerald-800'
              : 'bg-amber-50 text-amber-800'
          }`}
        >
          <strong>{selected === exercise.correct ? '✅ To\'g\'ri!' : '❌ Noto\'g\'ri!'}</strong>{' '}
          {exercise.explanation}
        </motion.div>
      )}
    </motion.div>
  )
}

// ── Content section renderer ─────────────────────────────────────────────────
function ContentSection({ section }) {
  const [speakingLetter, setSpeakingLetter] = useState(null)
  const lines = section.body.split('\n').filter(Boolean)
  const upperLine = lines.find((line) => /A B C D E/.test(line))
  const lowerLine = lines.find((line) => /a b c d e/.test(line))

  const upperLetters = upperLine ? upperLine.split(/\s+/).filter((t) => /^[A-Z]$/.test(t)) : []
  const lowerLetters = lowerLine ? lowerLine.split(/\s+/).filter((t) => /^[a-z]$/.test(t)) : []

  const hasAlphabetGrid = upperLetters.length > 20 && lowerLetters.length > 20
  const isVowelSection = /unli harflar|vowels/i.test(section.title)
  const isExampleSection = /misol/i.test(section.title)
  const isNumbersSection = /raqamlar|numbers/i.test(section.title)

  function speakLetter(letter) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(String(letter).toLowerCase())
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    utterance.pitch = 1
    setSpeakingLetter(letter)
    utterance.onend = () => setSpeakingLetter(null)
    utterance.onerror = () => setSpeakingLetter(null)
    window.speechSynthesis.speak(utterance)
  }

  if (hasAlphabetGrid) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
        <h4 className="mb-1 text-2xl font-semibold text-slate-900">{section.title}</h4>
        <p className="mb-5 text-sm text-slate-500">Ingliz alifbosi</p>

        <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-[120px_1fr] md:items-start">
            <span className="inline-flex h-7 w-fit items-center rounded-md bg-indigo-100 px-2 text-xs font-semibold text-indigo-700">Aa</span>
            <div className="grid grid-cols-7 gap-2 sm:grid-cols-9 md:grid-cols-13">
              {upperLetters.map((letter) => (
                <button
                  key={`upper-${letter}`}
                  type="button"
                  onClick={() => speakLetter(letter)}
                  className={`grid h-9 place-items-center rounded-lg border bg-white text-sm font-semibold transition ${
                    speakingLetter === letter
                      ? 'border-indigo-500 text-indigo-700 shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5" />

          <div className="grid gap-3 md:grid-cols-[120px_1fr] md:items-start">
            <span className="inline-flex h-7 w-fit items-center rounded-md bg-indigo-100 px-2 text-xs font-semibold text-indigo-700">Aa</span>
            <div className="grid grid-cols-7 gap-2 sm:grid-cols-9 md:grid-cols-13">
              {lowerLetters.map((letter) => (
                <button
                  key={`lower-${letter}`}
                  type="button"
                  onClick={() => speakLetter(letter)}
                  className={`grid h-9 place-items-center rounded-lg border bg-white text-sm transition ${
                    speakingLetter === letter
                      ? 'border-indigo-500 text-indigo-700 shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isVowelSection) {
    const vowels = ['A', 'E', 'I', 'O', 'U']
    const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z']

    return (
      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
        <h4 className="mb-1 text-2xl font-semibold text-slate-900">{section.title}</h4>
        <p className="mb-5 text-sm text-slate-500">Ingliz alifbosidagi asosiy tovush guruhlari</p>

        <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Unli harflar</p>
            <p className="mt-1 text-xs text-indigo-700/80">Vowels — ovoz erkin chiqadigan harflar</p>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {vowels.map((letter) => (
                <button
                  key={`vowel-${letter}`}
                  type="button"
                  onClick={() => speakLetter(letter)}
                  className={`grid h-10 place-items-center rounded-lg border bg-white text-sm font-bold transition ${
                    speakingLetter === letter
                      ? 'border-indigo-500 text-indigo-700 shadow-sm'
                      : 'border-indigo-200 text-indigo-700 hover:border-indigo-400'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">Undoshlar</p>
            <p className="mt-1 text-xs text-slate-500">Consonants — qolgan 21 ta harf</p>
            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {consonants.map((letter) => (
                <button
                  key={`cons-${letter}`}
                  type="button"
                  onClick={() => speakLetter(letter)}
                  className={`grid h-7 place-items-center rounded-md border text-xs transition ${
                    speakingLetter === letter
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </article>
        </div>
      </div>
    )
  }

  if (isExampleSection) {
    const parsedExamples = section.body
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [wordPart, descPart] = line.split('→').map((x) => x?.trim())
        const letter = wordPart?.[0]?.toUpperCase() || '?'
        return {
          word: wordPart || line,
          desc: descPart || '',
          letter,
        }
      })

    return (
      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
        <h4 className="mb-1 text-2xl font-semibold text-slate-900">{section.title}</h4>
        <p className="mb-5 text-sm text-slate-500">So&apos;zlar qanday harf bilan boshlanishini ko&apos;ramiz</p>

        <div className="grid gap-3 md:grid-cols-3">
          {parsedExamples.map((item) => (
            <button
              key={`${item.word}-${item.letter}`}
              type="button"
              onClick={() => speakLetter(item.letter)}
              className={`group rounded-xl border bg-white p-4 text-left transition hover:border-indigo-300 hover:shadow-sm ${
                speakingLetter === item.letter ? 'border-indigo-500 shadow-sm' : 'border-slate-200'
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-lg text-sm font-bold ${
                    speakingLetter === item.letter ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {item.letter}
                </span>
                <p className="text-lg font-semibold text-slate-900">{item.word}</p>
              </div>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (isNumbersSection) {
    function numberToWord(n) {
      const under20 = [
        '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
        'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
        'seventeen', 'eighteen', 'nineteen',
      ]
      const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
      if (n <= 19) return under20[n]
      if (n === 100) return 'one hundred'
      const t = Math.floor(n / 10)
      const u = n % 10
      return u ? `${tens[t]}-${under20[u]}` : tens[t]
    }

    const chunks = []
    for (let start = 1; start <= 100; start += 20) {
      const end = Math.min(start + 19, 100)
      chunks.push({
        title: `${start} - ${end}`,
        data: Array.from({ length: end - start + 1 }, (_, i) => {
          const num = start + i
          return { num, word: numberToWord(num) }
        }),
      })
    }

    const NumberGrid = ({ title, data }) => (
      <article className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">{title}</p>
        <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-8 xl:grid-cols-10">
          {data.map((item) => (
            <button
              key={`${item.num}-${item.word}`}
              type="button"
              onClick={() => speakLetter(item.word)}
              className={`rounded-md border px-1.5 py-1.5 text-left transition ${
                speakingLetter === item.word
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/60'
              }`}
            >
              <p className="text-xs font-bold leading-none text-slate-900">{item.num}</p>
              <p className="mt-1 text-[10px] leading-none text-slate-600">{item.word}</p>
            </button>
          ))}
        </div>
      </article>
    )

    return (
      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
        <h4 className="mb-1 text-2xl font-semibold text-slate-900">Raqamlar 1-100</h4>
        <p className="mb-5 text-sm text-slate-500">Raqamni bosing — inglizcha talaffuz qilib beradi</p>

        <div className="grid gap-4">
          {chunks.map((chunk) => (
            <NumberGrid key={chunk.title} title={chunk.title} data={chunk.data} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <h4 className="mb-3 text-lg font-semibold text-slate-900">{section.title}</h4>
      <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">
        {section.body}
      </pre>
    </div>
  )
}

// ── Results screen ───────────────────────────────────────────────────────────
function ResultsScreen({ score, total, xp, onNext, onRetry, hasNext }) {
  const pct = Math.round((score / total) * 100)
  const passed = pct >= 60

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center py-8 text-center"
    >
      <div
        className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full ${
          passed ? 'bg-emerald-100' : 'bg-amber-100'
        }`}
      >
        {passed ? (
          <Trophy size={40} className="text-emerald-600" />
        ) : (
          <RotateCcw size={40} className="text-amber-600" />
        )}
      </div>

      <h2 className="text-3xl font-bold text-slate-900">
        {passed ? 'Ajoyib!' : 'Yana urinib ko\'ring'}
      </h2>
      <p className="mt-2 text-slate-500">
        {score}/{total} ta to\'g\'ri javob — {pct}%
      </p>

      {passed && (
        <div className="mt-4 flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2">
          <Zap size={16} className="text-indigo-600" />
          <span className="text-sm font-bold text-indigo-700">+{xp} XP qo\'shildi!</span>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RotateCcw size={15} />
          Qayta urinish
        </button>
        {hasNext && (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md"
          >
            Keyingi dars
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
function LessonPlayerPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { completeLesson, isCompleted } = useLessonProgress()

  const lesson = getLessonById(id)
  const nextLesson = lesson ? getNextLesson(id) : null

  const [phase, setPhase] = useState('content') // content | quiz | results
  const [sectionIdx, setSectionIdx] = useState(0)
  const [exerciseIdx, setExerciseIdx] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [alreadyDone] = useState(() => isCompleted(id))

  useEffect(() => {
    setSectionIdx(0)
    setExerciseIdx(0)
    setCorrectCount(0)
    setPhase('content')
  }, [id])

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">Dars topilmadi</p>
          <button
            onClick={() => navigate('/online-lessons')}
            className="mt-3 text-sm font-medium text-indigo-600"
          >
            Darslarga qaytish
          </button>
        </div>
      </div>
    )
  }

  const sections = lesson.content.sections || []
  const exercises = lesson.content.exercises || []
  const totalSections = sections.length
  const isNumberLesson = /raqam/i.test(lesson.title)

  const LEVEL_COLORS = {
    A0: 'bg-slate-100 text-slate-600',
    A1: 'bg-emerald-100 text-emerald-700',
    A2: 'bg-sky-100 text-sky-700',
    B1: 'bg-indigo-100 text-indigo-700',
    B2: 'bg-violet-100 text-violet-700',
    C1: 'bg-amber-100 text-amber-700',
  }

  const TYPE_LABELS = {
    grammar: 'Grammatika',
    vocabulary: 'So\'z boyligi',
    listening: 'Tinglash',
    reading: 'O\'qish',
  }

  function handleAnswered(correct) {
    if (correct) setCorrectCount((c) => c + 1)
    const nextIdx = exerciseIdx + 1
    if (nextIdx < exercises.length) {
      setExerciseIdx(nextIdx)
    } else {
      const finalScore = correct ? correctCount + 1 : correctCount
      if (finalScore / exercises.length >= 0.6) {
        completeLesson(lesson.id, lesson.xp)
      }
      setPhase('results')
    }
  }

  function handleRetry() {
    setExerciseIdx(0)
    setCorrectCount(0)
    setPhase('quiz')
  }

  function handleNextLesson() {
    if (nextLesson) navigate(`/lessons/${nextLesson.id}`)
  }

  const progressPct =
    phase === 'content'
      ? ((sectionIdx + 1) / (totalSections + exercises.length)) * 100
      : phase === 'quiz'
      ? ((totalSections + exerciseIdx + 1) / (totalSections + exercises.length)) * 100
      : 100

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/online-lessons')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50"
          >
            <X size={16} />
          </button>

          <div className="flex-1">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700"
                initial={false}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm font-semibold text-indigo-700">
            <Zap size={14} />
            +{lesson.xp} XP
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-4 py-8">
        {/* Lesson header */}
        <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate('/online-lessons')}
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${LEVEL_COLORS[lesson.level]}`}>
                {lesson.level}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {TYPE_LABELS[lesson.type] || lesson.type}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                <Clock size={11} />
                {lesson.duration}
              </span>
              {alreadyDone && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                  <CheckCircle2 size={11} />
                  Bajarilgan
                </span>
              )}
            </div>
            <h1 className="mt-3 text-[36px] leading-none font-bold tracking-tight text-slate-900">{lesson.title}</h1>
            <p className="mt-2 text-base text-slate-500">{lesson.description}</p>
          </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/online-lessons')}
            className="hidden h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 md:inline-flex"
          >
            <BookOpen size={15} />
            Darslar ro&apos;yxati
          </button>
        </div>

        {/* Main card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-7">
          <AnimatePresence mode="wait">
            {/* CONTENT PHASE */}
            {phase === 'content' && (
              <motion.div
                key={`content-${sectionIdx}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    {!isNumberLesson ? (
                      <p className="text-xs font-medium text-slate-500">
                        Qism {sectionIdx + 1} / {totalSections}
                      </p>
                    ) : null}
                    <p className="text-[28px] leading-none font-semibold text-slate-900">
                      {sections[sectionIdx]?.title}
                    </p>
                  </div>
                </div>
                  <div className="hidden items-center gap-2 md:flex">
                    {sections.map((_, i) => (
                      <span
                        key={`step-${i}`}
                        className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-semibold ${
                          i <= sectionIdx
                            ? 'border-indigo-500 bg-indigo-500 text-white'
                            : 'border-slate-200 bg-white text-slate-400'
                        }`}
                      >
                        {i + 1}
                      </span>
                    ))}
                  </div>
                </div>

                {sectionIdx === 0 && lesson.content.intro && (
                  <div className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
                    {lesson.content.intro}
                  </div>
                )}

                {sections[sectionIdx] && (
                  <ContentSection section={sections[sectionIdx]} />
                )}

                <div className="mt-7 flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-1 py-1">
                  <button
                    type="button"
                    onClick={() => setSectionIdx((i) => Math.max(0, i - 1))}
                    disabled={sectionIdx === 0}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 disabled:opacity-30 hover:bg-slate-50"
                  >
                    <ArrowLeft size={14} />
                    Oldingi
                  </button>

                  <div className="hidden min-w-[220px] flex-col items-center gap-1 md:flex">
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <motion.div
                        initial={false}
                        animate={{ width: `${((sectionIdx + 1) / totalSections) * 100}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700"
                      />
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      {sectionIdx + 1} / {totalSections} qism
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (sectionIdx < totalSections - 1) {
                        setSectionIdx((i) => i + 1)
                      } else {
                        setPhase('quiz')
                      }
                    }}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg"
                  >
                    {sectionIdx < totalSections - 1 ? (
                      <>
                        Keyingi <ChevronRight size={14} />
                      </>
                    ) : (
                      <>
                        Mashqlar <Star size={14} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* QUIZ PHASE */}
            {phase === 'quiz' && exerciseIdx < exercises.length && (
              <ExerciseCard
                key={`ex-${exerciseIdx}`}
                exercise={exercises[exerciseIdx]}
                index={exerciseIdx}
                total={exercises.length}
                onAnswer={handleAnswered}
              />
            )}

            {/* RESULTS PHASE */}
            {phase === 'results' && (
              <ResultsScreen
                key="results"
                score={correctCount}
                total={exercises.length}
                xp={lesson.xp}
                onRetry={handleRetry}
                onNext={handleNextLesson}
                hasNext={!!nextLesson}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Lesson navigation breadcrumb */}
        {phase === 'content' && (
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <span
              className="cursor-pointer hover:text-indigo-600"
              onClick={() => navigate('/online-lessons')}
            >
              Online Darslar
            </span>
            <ChevronRight size={12} />
            <span>{lesson.level} — {lesson.unitTitle}</span>
            <ChevronRight size={12} />
            <span className="text-slate-600">{lesson.title}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default LessonPlayerPage
