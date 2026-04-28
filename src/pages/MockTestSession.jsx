import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Headphones,
  Mic,
  PenLine,
  RotateCcw,
  Trophy,
  X,
  Zap,
} from 'lucide-react'
import {
  calculateBandScore,
  getTestById,
  getTestQuestions,
  saveTestResult,
  IELTS_READING_PASSAGES,
  IELTS_LISTENING_SECTIONS,
  IELTS_WRITING_TASKS,
} from '../data/mockTests'

// ── Countdown Timer ──────────────────────────────────────────────────────────
function useCountdown(totalSeconds, onExpire) {
  const [seconds, setSeconds] = useState(totalSeconds)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          onExpire()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [onExpire])

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  const pct = (seconds / totalSeconds) * 100
  const isLow = seconds < 300

  return { display: `${mins}:${secs}`, pct, isLow, seconds }
}

// ── Exit confirm modal ───────────────────────────────────────────────────────
function ExitConfirm({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <AlertTriangle size={28} className="text-amber-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Testdan chiqasizmi?</h3>
        <p className="mt-2 text-sm text-slate-500">
          Barcha javoblaringiz yo'qoladi. Bu amaliyotni tasdiqlaysizmi?
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Davom etish
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
          >
            Chiqish
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── MCQ question block ───────────────────────────────────────────────────────
function MCQQuestion({ question, index, answer, onSelect }) {
  const typeLabel = { multiple_choice: 'MC', true_false_ng: 'T/F/NG' }

  return (
    <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
          {index + 1}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
          {typeLabel[question.type] || question.type}
        </span>
      </div>
      <p className="mb-4 text-sm font-semibold text-slate-900">{question.question}</p>
      <div className="grid gap-2">
        {question.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(question.id, i)}
            className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition-all ${
              answer === i
                ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                : 'border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50'
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                answer === i
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
    </div>
  )
}

// ── Reading section ──────────────────────────────────────────────────────────
function ReadingSection({ passages, answers, onAnswer }) {
  const [activePassage, setActivePassage] = useState(0)
  const passage = passages[activePassage]
  const allQuestions = passages.flatMap((p) => p.questions)
  const answered = Object.keys(answers).length

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_480px]">
      {/* Passage */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex gap-2">
          {passages.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActivePassage(i)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activePassage === i
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Passage {i + 1}
            </button>
          ))}
        </div>
        <h3 className="mb-3 text-lg font-bold text-slate-900">{passage.title}</h3>
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {passage.text.split('\n\n').map((para, i) => (
            <p key={i} className="mb-4 text-sm leading-7 text-slate-700">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div>
        <div className="mb-4 flex items-center justify-between rounded-xl bg-indigo-50 p-3">
          <p className="text-sm font-semibold text-indigo-800">
            {answered}/{allQuestions.length} savol javoblandi
          </p>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-indigo-100">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${(answered / allQuestions.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="max-h-[65vh] overflow-y-auto pr-1">
          {passage.questions.map((q, i) => (
            <MCQQuestion
              key={q.id}
              question={q}
              index={passages.slice(0, activePassage).reduce((sum, p) => sum + p.questions.length, 0) + i}
              answer={answers[q.id]}
              onSelect={onAnswer}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Listening section ────────────────────────────────────────────────────────
function ListeningSection({ sections, answers, onAnswer }) {
  const [showTranscript, setShowTranscript] = useState(false)
  const section = sections[0]
  const answered = Object.keys(answers).length

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_480px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
            <Headphones size={18} className="text-sky-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{section.title}</p>
            <p className="text-xs text-slate-500">Section {section.section}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
          <p className="text-sm font-medium text-sky-800">{section.audioDescription}</p>
          <p className="mt-2 text-xs text-sky-600">
            🎧 Haqiqiy testda audio fayl eshitiladi. Bu amaliyot versiyasida transcript ko'rsatiladi.
          </p>
        </div>

        <button
          onClick={() => setShowTranscript((v) => !v)}
          className="mt-4 text-sm font-medium text-indigo-600 hover:underline"
        >
          {showTranscript ? 'Transcriptni yopish' : 'Transcriptni ko\'rish (Amaliyot)'}
        </button>

        {showTranscript && (
          <div className="mt-4 max-h-72 overflow-y-auto rounded-xl bg-slate-50 p-4">
            {section.transcript.split('\n').map((line, i) => (
              <p key={i} className="mb-1 text-sm text-slate-700">{line}</p>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between rounded-xl bg-sky-50 p-3">
          <p className="text-sm font-semibold text-sky-800">
            {answered}/{section.questions.length} savol javoblandi
          </p>
        </div>
        <div className="max-h-[65vh] overflow-y-auto pr-1">
          {section.questions.map((q, i) => (
            <MCQQuestion
              key={q.id}
              question={q}
              index={i}
              answer={answers[q.id]}
              onSelect={onAnswer}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Writing section ──────────────────────────────────────────────────────────
function WritingSection({ tasks, answers, onAnswer }) {
  const [activeTask, setActiveTask] = useState(0)
  const task = tasks[activeTask]
  const wordCount = (answers[task.id] || '').trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {tasks.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setActiveTask(i)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTask === i
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Task {t.task}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <PenLine size={16} className="text-amber-500" />
            <h3 className="font-semibold text-slate-900">{task.title}</h3>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="whitespace-pre-line text-sm leading-7 text-slate-700">{task.prompt}</p>
          </div>
          {task.bandDescriptors && (
            <div className="mt-4 space-y-1">
              <p className="text-xs font-semibold text-slate-500">Baholash mezonlari:</p>
              {task.bandDescriptors.map((d) => (
                <p key={d} className="flex items-start gap-1 text-xs text-slate-500">
                  <span className="mt-0.5 shrink-0 text-indigo-400">•</span> {d}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Javobingiz:</p>
            <div className={`rounded-lg px-2 py-1 text-xs font-semibold ${
              wordCount >= (task.wordLimit || 150)
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {wordCount} so'z / Min: {task.wordLimit || 150}
            </div>
          </div>
          <textarea
            value={answers[task.id] || ''}
            onChange={(e) => onAnswer(task.id, e.target.value)}
            placeholder={`${task.title} javobingizni shu yerga yozing...`}
            className="flex-1 min-h-[400px] resize-none rounded-2xl border border-slate-200 p-4 text-sm leading-7 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          {task.modelAnswer && (
            <details className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
              <summary className="cursor-pointer text-xs font-semibold text-emerald-700">
                Namuna javobni ko'rish
              </summary>
              <p className="mt-2 text-xs leading-6 text-slate-600">{task.modelAnswer}</p>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Speaking section ─────────────────────────────────────────────────────────
function SpeakingSection() {
  const [recording, setRecording] = useState(false)
  const [recordings, setRecordings] = useState({})

  function toggleRecording(id) {
    setRecording((v) => !v)
    if (recording) {
      setRecordings((prev) => ({ ...prev, [id]: true }))
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
        <div className="flex items-center gap-3">
          <Mic size={20} className="text-violet-600" />
          <div>
            <h3 className="font-bold text-slate-900">Speaking Section</h3>
            <p className="text-xs text-slate-500">
              Haqiqiy testda examiner bilan gaplashasiz. Bu amaliyotda o'zingizni record qilib mashq qiling.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-amber-700 bg-amber-50 rounded-xl px-3 py-2 mb-4">
          🎤 Browser audio ruxsatini bering. Bu versiyada speaking yozib olinmaydi — amaliyot uchun.
        </p>
        <button
          onClick={() => toggleRecording('s1')}
          className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
            recording
              ? 'bg-red-500 text-white shadow-md animate-pulse'
              : 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-md'
          }`}
        >
          <Mic size={15} />
          {recording ? 'To\'xtatish ◼' : '▶ Yozishni boshlash'}
        </button>
        {recordings['s1'] && (
          <p className="mt-3 text-sm text-emerald-600">✅ Speaking javobingiz saqlandi</p>
        )}
      </div>
    </div>
  )
}

// ── Results screen ───────────────────────────────────────────────────────────
function ResultsScreen({ testMeta, answers, questions, type, onRetry, navigate }) {
  const correctCount = type === 'mcq' || type === 'reading' || type === 'listening'
    ? questions.filter((q) => answers[q.id] === q.correct).length
    : 0
  const totalMCQ = questions.length
  const band = type !== 'writing' && type !== 'speaking'
    ? calculateBandScore(correctCount, totalMCQ)
    : null

  useEffect(() => {
    saveTestResult({
      testId: testMeta.id,
      testTitle: testMeta.title,
      testType: testMeta.type,
      correct: correctCount,
      total: totalMCQ,
      band,
      type,
    })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl py-10 text-center"
    >
      <div className="mb-4 flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100">
          <Trophy size={40} className="text-indigo-600" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-900">Test yakunlandi!</h2>

      {band !== null ? (
        <>
          <div className="mx-auto mt-6 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl">
            <p className="text-4xl font-black">{band}</p>
            <p className="text-xs font-medium opacity-80">Band Score</p>
          </div>
          <p className="mt-4 text-slate-600">
            {correctCount}/{totalMCQ} ta to'g'ri javob ({Math.round((correctCount / totalMCQ) * 100)}%)
          </p>
        </>
      ) : (
        <div className="mx-auto mt-6 max-w-xs rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
          <p className="text-sm text-indigo-700">
            Writing/Speaking javoblaringiz yozildi. Haqiqiy testda examiner tomonidan baholanadi.
          </p>
        </div>
      )}

      {/* Score breakdown */}
      {type !== 'writing' && type !== 'speaking' && (
        <div className="mt-6 grid grid-cols-2 gap-3 text-left">
          {questions.slice(0, 6).map((q, i) => {
            const correct = answers[q.id] === q.correct
            return (
              <div
                key={q.id}
                className={`rounded-xl border p-3 ${
                  correct ? 'border-emerald-100 bg-emerald-50' : 'border-red-100 bg-red-50'
                }`}
              >
                <p className="text-xs font-semibold text-slate-700">Savol {i + 1}</p>
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">{q.question}</p>
                <div className={`mt-1 text-xs font-semibold ${correct ? 'text-emerald-700' : 'text-red-600'}`}>
                  {correct ? '✅ To\'g\'ri' : `❌ Noto'g'ri — To'g'ri: ${q.options?.[q.correct]}`}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RotateCcw size={14} />
          Qayta topshirish
        </button>
        <button
          onClick={() => navigate('/mock-exam')}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md"
        >
          <CheckCircle2 size={14} />
          Bosh sahifaga
        </button>
      </div>
    </motion.div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
function MockTestSession() {
  const { testId } = useParams()
  const navigate = useNavigate()

  const testMeta = getTestById(testId)
  const testData = getTestQuestions(testId)

  const [phase, setPhase] = useState('intro') // intro | session | done
  const [answers, setAnswers] = useState({})
  const [showExit, setShowExit] = useState(false)

  const allQuestions = testData?.allQuestions || []

  const handleExpire = useCallback(() => setPhase('done'), [])
  const { display, pct, isLow } = useCountdown(
    phase === 'session' ? (testMeta?.totalTime || 60) * 60 : 9999,
    handleExpire,
  )

  function handleAnswer(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function handleSubmit() {
    if (allQuestions.length > 0 && Object.keys(answers).length < allQuestions.length * 0.5) {
      if (!window.confirm('Barcha savollarga javob bermadiniz. Davom etasizmi?')) return
    }
    setPhase('done')
  }

  function handleRetry() {
    setAnswers({})
    setPhase('intro')
  }

  if (!testMeta || !testData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">Test topilmadi</p>
          <button
            onClick={() => navigate('/mock-exam')}
            className="mt-3 text-sm font-medium text-indigo-600"
          >
            Testlarga qaytish
          </button>
        </div>
      </div>
    )
  }

  const SECTION_ICONS = {
    reading: BookOpen,
    listening: Headphones,
    writing: PenLine,
    speaking: Mic,
    mcq: CheckCircle2,
  }
  const SectionIcon = SECTION_ICONS[testData.type] || BookOpen

  if (phase === 'intro') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-lg text-center"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600">
            <SectionIcon size={36} className="text-white" />
          </div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
            {testMeta.type}
          </div>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{testMeta.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{testMeta.description}</p>

          <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
            {[
              { icon: Clock, label: `${testMeta.totalTime} daq`, sub: 'Vaqt' },
              { icon: CheckCircle2, label: `${allQuestions.length || '—'} ta`, sub: 'Savol' },
              { icon: Zap, label: '+50 XP', sub: 'Mukofot' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={sub} className="flex flex-col items-center gap-1 rounded-2xl bg-slate-50 p-3">
                <Icon size={16} className="text-indigo-500" />
                <p className="font-bold text-slate-900">{label}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-3 text-left text-xs text-amber-800">
            ⚠️ Test boshlanganidan keyin vaqt to'xtatilmaydi. Tayyor bo'lganingizda bosing.
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate('/mock-exam')}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={14} />
              Orqaga
            </button>
            <button
              onClick={() => setPhase('session')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-5 py-2.5 text-sm font-bold text-white shadow-md"
            >
              Testni boshlash
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <ResultsScreen
          testMeta={testMeta}
          answers={answers}
          questions={allQuestions}
          type={testData.type}
          onRetry={handleRetry}
          navigate={navigate}
        />
      </div>
    )
  }

  // SESSION PHASE
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Exit confirm */}
      <AnimatePresence>
        {showExit && (
          <ExitConfirm
            onConfirm={() => navigate('/mock-exam')}
            onCancel={() => setShowExit(false)}
          />
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className={`sticky top-0 z-30 border-b bg-white px-4 py-3 shadow-sm transition-colors ${isLow ? 'border-red-200' : 'border-slate-200'}`}>
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <button
            onClick={() => setShowExit(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50"
          >
            <X size={15} />
          </button>

          <div className="flex flex-1 items-center gap-3">
            <span className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold ${
              isLow ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-slate-100 text-slate-700'
            }`}>
              <Clock size={14} />
              {display}
            </span>

            <div className="flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className={`h-full rounded-full transition-colors ${isLow ? 'bg-red-500' : 'bg-indigo-500'}`}
                  animate={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
            <span className="font-semibold text-slate-800">
              {Object.keys(answers).length}/{allQuestions.length}
            </span>
            javoblandi
          </div>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-md"
          >
            <CheckCircle2 size={13} />
            Topshirish
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
            <SectionIcon size={15} className="text-indigo-600" />
          </div>
          <h2 className="font-semibold text-slate-900">{testMeta.title}</h2>
        </div>

        {testData.type === 'reading' && (
          <ReadingSection
            passages={testData.passages}
            answers={answers}
            onAnswer={handleAnswer}
          />
        )}
        {testData.type === 'listening' && (
          <ListeningSection
            sections={testData.sections}
            answers={answers}
            onAnswer={handleAnswer}
          />
        )}
        {testData.type === 'writing' && (
          <WritingSection
            tasks={testData.tasks}
            answers={answers}
            onAnswer={handleAnswer}
          />
        )}
        {testData.type === 'mcq' && (
          <div className="mx-auto max-w-2xl">
            {testData.allQuestions.map((q, i) => (
              <MCQQuestion
                key={q.id}
                question={q}
                index={i}
                answer={answers[q.id]}
                onSelect={handleAnswer}
              />
            ))}
          </div>
        )}
        {testData.type === 'speaking' && <SpeakingSection />}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg"
          >
            <CheckCircle2 size={15} />
            Testni yakunlash
          </button>
        </div>
      </div>
    </div>
  )
}

export default MockTestSession
