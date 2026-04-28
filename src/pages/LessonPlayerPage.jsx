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
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <h4 className="mb-3 font-semibold text-slate-900">{section.title}</h4>
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
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
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

      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Lesson header */}
        <div className="mb-6 flex items-start gap-4">
          <button
            type="button"
            onClick={() => navigate('/online-lessons')}
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEVEL_COLORS[lesson.level]}`}>
                {lesson.level}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {TYPE_LABELS[lesson.type] || lesson.type}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock size={11} />
                {lesson.duration}
              </span>
              {alreadyDone && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <CheckCircle2 size={11} />
                  Bajarilgan
                </span>
              )}
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{lesson.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{lesson.description}</p>
          </div>
        </div>

        {/* Main card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <AnimatePresence mode="wait">
            {/* CONTENT PHASE */}
            {phase === 'content' && (
              <motion.div
                key={`content-${sectionIdx}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Qism {sectionIdx + 1} / {totalSections}
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {sections[sectionIdx]?.title}
                    </p>
                  </div>
                </div>

                {sectionIdx === 0 && lesson.content.intro && (
                  <div className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-800">
                    {lesson.content.intro}
                  </div>
                )}

                {sections[sectionIdx] && (
                  <ContentSection section={sections[sectionIdx]} />
                )}

                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSectionIdx((i) => Math.max(0, i - 1))}
                    disabled={sectionIdx === 0}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 disabled:opacity-30 hover:bg-slate-50"
                  >
                    <ArrowLeft size={14} />
                    Oldingi
                  </button>

                  <div className="flex gap-1.5">
                    {sections.map((_, i) => (
                      <span
                        key={i}
                        className={`h-2 rounded-full transition-all ${
                          i === sectionIdx
                            ? 'w-6 bg-indigo-500'
                            : i < sectionIdx
                            ? 'w-2 bg-indigo-300'
                            : 'w-2 bg-slate-200'
                        }`}
                      />
                    ))}
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
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg"
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
