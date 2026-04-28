import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft, Brain, CheckCircle2, ChevronRight,
  Clock, Lightbulb, Mic, MicOff, RefreshCw,
  RotateCcw, Square, Volume2, Zap,
} from 'lucide-react'

// ── Topics ────────────────────────────────────────────────────────────────────
const TOPICS = [
  {
    id: 'daily',
    emoji: '☀️',
    title: 'Kundalik Hayot',
    level: 'A1 - A2',
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50 border-amber-200',
    prompts: [
      'Tell me about your typical morning routine.',
      'What did you have for breakfast today? Describe it.',
      'How do you usually spend your weekends?',
      'Describe your neighborhood.',
      'What are your hobbies and why do you enjoy them?',
    ],
    tips: ['Simple present tense ishlating', '"I usually...", "Every day I..." iboralari', 'Vaqt ko\'rsatkichlarini qo\'shing: in the morning, after lunch'],
  },
  {
    id: 'ielts1',
    emoji: '📝',
    title: 'IELTS Part 1',
    level: 'B1 - B2',
    color: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50 border-indigo-200',
    prompts: [
      'Do you prefer living in a city or in the countryside? Why?',
      'How has technology changed the way people communicate?',
      'What kind of music do you enjoy and why?',
      'Describe your hometown. What do you like most about it?',
      'How important is learning a foreign language today?',
    ],
    tips: ['2-3 daqiqa gapiring', 'Misollar keltiring', '"For instance...", "Such as...", "One reason is..." ishlating'],
  },
  {
    id: 'ielts2',
    emoji: '🎤',
    title: 'IELTS Part 2 (Cue Card)',
    level: 'B2 - C1',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 border-emerald-200',
    prompts: [
      'Describe a memorable journey you have taken.\n• Where you went\n• Who you went with\n• What you did\n• Why it was memorable',
      'Describe a person who has influenced you greatly.\n• Who this person is\n• How you know them\n• What qualities they have\n• How they influenced you',
      'Describe a book you have read that you found interesting.\n• What the book was about\n• When you read it\n• Why you found it interesting\n• What you learned from it',
      'Describe a skill you would like to learn.\n• What the skill is\n• Why you want to learn it\n• How you would learn it\n• How it would help you',
    ],
    tips: ['1 daqiqa tayyorlan, 2 daqiqa gapir', 'Barcha bullet pointlarni qamrab ol', 'O\'tgan zamon ishlat (Describe = past)'],
  },
  {
    id: 'business',
    emoji: '💼',
    title: 'Business English',
    level: 'B1 - C1',
    color: 'from-slate-600 to-slate-800',
    bg: 'bg-slate-50 border-slate-200',
    prompts: [
      'Describe your ideal working environment.',
      'What qualities make a good leader?',
      'How do you handle stress at work?',
      'Describe a successful project you worked on.',
      'What are the advantages and disadvantages of working from home?',
    ],
    tips: ['Professional leksika ishlating', '"In my opinion...", "I believe..." bilan boshlang', 'Misollar keltirish muhim'],
  },
  {
    id: 'toefl',
    emoji: '🏫',
    title: 'TOEFL Speaking',
    level: 'B2 - C1',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50 border-rose-200',
    prompts: [
      'Some people prefer to study alone, while others prefer to study in groups. Which do you prefer and why?',
      'Do you agree or disagree: Technology has made people less creative. Give specific reasons and examples.',
      'Some people think that children should be allowed to use smartphones. Others disagree. What is your opinion?',
      'Is it better to specialize in one field or to have broad knowledge in many areas?',
    ],
    tips: ['15 soniya tayyorlan', '45-60 soniya gapir', 'PREP formula: Point, Reason, Example, Point'],
  },
  {
    id: 'interview',
    emoji: '🤝',
    title: 'Ish Suhbati',
    level: 'B1 - C1',
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50 border-sky-200',
    prompts: [
      'Tell me about yourself.',
      'What are your greatest strengths and weaknesses?',
      'Where do you see yourself in 5 years?',
      'Why do you want to work for this company?',
      'Describe a challenge you faced and how you overcame it.',
    ],
    tips: ['STAR method: Situation, Task, Action, Result', 'Aniq misollar keltir', '"I demonstrated...", "As a result..."'],
  },
]

// ── Vocabulary suggestions by topic ──────────────────────────────────────────
const VOCAB_HINTS = {
  daily:     ['routine', 'typically', 'occasionally', 'neighborhood', 'commute'],
  ielts1:    ['consequently', 'furthermore', 'in contrast', 'significantly', 'tend to'],
  ielts2:    ['memorable', 'unforgettable', 'particularly', 'in retrospect', 'inspired'],
  business:  ['collaborate', 'efficient', 'deadline', 'stakeholder', 'implement'],
  toefl:     ['moreover', 'nevertheless', 'whereas', 'in addition', 'highlight'],
  interview: ['accomplished', 'initiative', 'proactive', 'contributed', 'achieved'],
}

// ── Timer ─────────────────────────────────────────────────────────────────────
function useTimer(duration) {
  const [seconds, setSeconds] = useState(duration)
  const [running, setRunning] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!running) return
    ref.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(ref.current); setRunning(false); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [running])

  const start = useCallback(() => { setSeconds(duration); setRunning(true) }, [duration])
  const stop  = useCallback(() => { clearInterval(ref.current); setRunning(false) }, [])
  const reset = useCallback(() => { clearInterval(ref.current); setRunning(false); setSeconds(duration) }, [duration])

  const display = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
  const pct = (seconds / duration) * 100
  const isLow = seconds <= 30

  return { seconds, display, pct, isLow, running, start, stop, reset }
}

// ── Web Speech Recognition ────────────────────────────────────────────────────
function useSpeechRecognition(onTranscript) {
  const recogRef = useRef(null)
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setSupported(false); return }
    const r = new SR()
    r.lang = 'en-US'
    r.continuous = true
    r.interimResults = true
    r.onresult = (e) => {
      const text = Array.from(e.results).map((r) => r[0].transcript).join(' ')
      onTranscript(text)
    }
    r.onend = () => setListening(false)
    recogRef.current = r
  }, [onTranscript])

  function toggleListen() {
    if (!recogRef.current) return
    if (listening) { recogRef.current.stop(); setListening(false) }
    else           { recogRef.current.start(); setListening(true) }
  }

  return { listening, supported, toggleListen }
}

// ── Speak word (TTS) ──────────────────────────────────────────────────────────
function speakText(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = 'en-US'; utt.rate = 0.88
  window.speechSynthesis.speak(utt)
}

// ── Topic selector ────────────────────────────────────────────────────────────
function TopicCard({ topic, onClick }) {
  return (
    <motion.button whileHover={{ y: -3 }} onClick={onClick}
      className="group rounded-2xl border-2 border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-indigo-300 hover:shadow-md">
      <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${topic.color} text-white shadow-sm`}>
        <span className="text-2xl">{topic.emoji}</span>
      </div>
      <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">{topic.title}</h3>
      <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">{topic.level}</span>
      <p className="mt-2 text-xs text-slate-400">{topic.prompts.length} ta savol</p>
      <ChevronRight size={16} className="mt-3 text-slate-300 group-hover:text-indigo-400" />
    </motion.button>
  )
}

// ── Practice session ──────────────────────────────────────────────────────────
function PracticeSession({ topic, onBack }) {
  const [promptIdx,  setPromptIdx]  = useState(0)
  const [transcript, setTranscript] = useState('')
  const [phase,      setPhase]      = useState('ready') // ready | recording | done
  const [showTips,   setShowTips]   = useState(false)
  const [history,    setHistory]    = useState([])

  const duration = topic.id === 'ielts2' ? 120 : 60
  const timer = useTimer(duration)
  const { listening, supported, toggleListen } = useSpeechRecognition(setTranscript)

  const prompt  = topic.prompts[promptIdx]
  const vocabs  = VOCAB_HINTS[topic.id] || []

  useEffect(() => {
    if (timer.seconds === 0 && phase === 'recording') {
      setPhase('done')
      if (listening) toggleListen()
    }
  }, [timer.seconds, phase])

  function startRecording() {
    setTranscript('')
    setPhase('recording')
    timer.start()
    if (supported) toggleListen()
  }

  function stopRecording() {
    timer.stop()
    setPhase('done')
    if (listening) toggleListen()
  }

  function nextPrompt() {
    setHistory((h) => [...h, { prompt, transcript, words: wordCount }])
    const next = (promptIdx + 1) % topic.prompts.length
    setPromptIdx(next)
    setTranscript('')
    setPhase('ready')
    timer.reset()
  }

  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="font-bold text-slate-900">{topic.emoji} {topic.title}</h2>
          <p className="text-xs text-slate-400">Savol {promptIdx + 1} / {topic.prompts.length}</p>
        </div>
        <div className="ml-auto flex gap-2">
          {history.length > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={11} />{history.length} bajarildi
            </div>
          )}
          <div className="flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <Zap size={11} />+{history.length * 15 + (phase === 'done' ? 15 : 0)} XP
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        {/* Main practice card */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Prompt */}
          <div className="mb-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50 p-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Savol</p>
              <button onClick={() => speakText(prompt.split('\n')[0])}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition">
                <Volume2 size={12} />Tinglash
              </button>
            </div>
            <p className="whitespace-pre-line text-base font-semibold leading-7 text-slate-900">{prompt}</p>
          </div>

          {/* Timer */}
          <div className="mb-5 flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#eef2ff" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none"
                  stroke={timer.isLow ? '#ef4444' : '#6366f1'} strokeWidth="3"
                  strokeDasharray={`${timer.pct} 100`} strokeLinecap="round"
                  className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-black ${timer.isLow ? 'text-red-600' : 'text-indigo-700'}`}>
                  {timer.display}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {phase === 'ready' ? `${duration} soniya vaqtingiz bor` :
                 phase === 'recording' ? 'Gapirmoqdasiz...' : 'Bajarildi!'}
              </p>
              <p className="text-xs text-slate-400">
                {phase === 'done' ? `${wordCount} ta so'z aytdingiz` : `Maqsad: ${Math.round(duration / 2)}+ ta so'z`}
              </p>
            </div>
          </div>

          {/* Transcript */}
          {(phase === 'recording' || phase === 'done') && (
            <div className="mb-4 min-h-24 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-400 mb-2">
                {supported ? 'Nutqingiz (avtomatik)' : 'Nutqingizni bu yerga yozing'}
              </p>
              {supported ? (
                <p className={`text-sm leading-6 ${transcript ? 'text-slate-800' : 'text-slate-300 italic'}`}>
                  {transcript || 'Gapiring...'}
                </p>
              ) : (
                <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Gapirgan narsangizni shu yerga yozing..."
                  rows={4} className="w-full resize-none bg-transparent text-sm text-slate-800 outline-none" />
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            {phase === 'ready' && (
              <button onClick={startRecording}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg">
                <Mic size={16} />
                Boshlash
              </button>
            )}
            {phase === 'recording' && (
              <button onClick={stopRecording}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 py-3 text-sm font-bold text-white shadow-md animate-pulse">
                <Square size={14} />
                To'xtatish
              </button>
            )}
            {phase === 'done' && (
              <>
                <button onClick={() => { setPhase('ready'); timer.reset(); setTranscript('') }}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <RotateCcw size={14} />Qayta
                </button>
                <button onClick={nextPrompt}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 py-3 text-sm font-bold text-white shadow-md">
                  <ChevronRight size={15} />Keyingi savol
                </button>
              </>
            )}
          </div>

          {/* Word count progress */}
          {phase !== 'ready' && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{wordCount} ta so'z</span>
                <span>Maqsad: {Math.round(duration / 2)}+</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100">
                <div className={`h-full rounded-full transition-all ${
                  wordCount >= duration / 2 ? 'bg-emerald-500' : 'bg-indigo-500'
                }`} style={{ width: `${Math.min(100, (wordCount / (duration / 2)) * 100)}%` }} />
              </div>
            </div>
          )}
        </article>

        {/* Tips panel */}
        <aside className="space-y-3">
          {/* Vocab hints */}
          <article className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Brain size={15} className="text-indigo-600" />
              <p className="text-sm font-semibold text-indigo-800">Foydali so'zlar</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {vocabs.map((w) => (
                <button key={w} onClick={() => speakText(w)}
                  className="flex items-center gap-1 rounded-full bg-white border border-indigo-200 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition">
                  <Volume2 size={10} />{w}
                </button>
              ))}
            </div>
          </article>

          {/* Grammar tips */}
          <article className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <button onClick={() => setShowTips((v) => !v)}
              className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb size={15} className="text-amber-600" />
                <p className="text-sm font-semibold text-amber-800">Maslahatlar</p>
              </div>
              <ChevronRight size={14} className={`text-amber-400 transition-transform ${showTips ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
              {showTips && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  className="overflow-hidden">
                  <div className="mt-3 space-y-2">
                    {topic.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-amber-800">
                        <span className="mt-0.5 shrink-0 font-bold text-amber-500">{i + 1}.</span>
                        {tip}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </article>

          {/* Timer info */}
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-slate-400" />
              <p className="text-xs font-semibold text-slate-600">Vaqt</p>
            </div>
            <p className="text-2xl font-black text-slate-900">{timer.display}</p>
            <p className="text-xs text-slate-400 mt-0.5">{duration} soniya = jami vaqt</p>
          </article>

          {/* Session history */}
          {history.length > 0 && (
            <article className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="mb-2 text-xs font-semibold text-emerald-800">Bajarilgan savollar</p>
              <div className="space-y-1.5">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-emerald-700">
                    <CheckCircle2 size={11} className="shrink-0 text-emerald-500" />
                    <span className="truncate">{h.prompt.split('\n')[0].substring(0, 40)}...</span>
                    <span className="shrink-0 text-emerald-500">{h.words}w</span>
                  </div>
                ))}
              </div>
            </article>
          )}
        </aside>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
function SpeakingPracticePage() {
  const navigate = useNavigate()
  const [selectedTopic, setSelectedTopic] = useState(null)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <button onClick={() => selectedTopic ? setSelectedTopic(null) : navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50">
            <ArrowLeft size={15} />
          </button>
          <div>
            <p className="text-sm font-bold text-slate-900">AI Speaking Practice</p>
            <p className="text-[11px] text-slate-400">
              {selectedTopic ? selectedTopic.title : 'Mavzu tanlang'}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              <Mic size={11} />Speaking Mode
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        <AnimatePresence mode="wait">
          {!selectedTopic ? (
            <motion.div key="topics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {/* Hero */}
              <div className="mb-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white">
                <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-sm font-medium text-indigo-200 mb-1">Speaking Practice</p>
                    <h1 className="text-2xl font-black">Gapirish ko'nikmasini rivojlantiring</h1>
                    <p className="mt-2 text-sm text-indigo-200">
                      Mavzu tanlang → savol o'qing → gapiring → XP oling.
                      Brauzer mikrofoni orqali nutqingiz matnga aylanadi.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      {['IELTS savollar', 'TOEFL prompts', 'Ish suhbati', 'Kundalik hayot'].map((t) => (
                        <span key={t} className="rounded-full bg-white/20 px-2.5 py-1">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="hidden text-7xl md:block">🎙️</div>
                </div>
              </div>

              {/* Topic grid */}
              <h2 className="mb-4 text-lg font-bold text-slate-900">Mavzu tanlang</h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {TOPICS.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} onClick={() => setSelectedTopic(topic)} />
                ))}
              </div>

              {/* Tips */}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Mic,         title: 'Mikrofon',   desc: 'Brauzer mikrofon ruxsatini bering. Nutqingiz avtomatik matnga aylanadi.' },
                  { icon: Clock,       title: 'Vaqt',       desc: '60 soniya speaking + 30 soniya preparation. IELTS format bilan bir xil.' },
                  { icon: RefreshCw,   title: 'Takrorlash', desc: 'Har bir mavzuda 4-5 ta savol. Har birini 2-3 marta qayta ishlang.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                      <Icon size={15} className="text-indigo-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{title}</p>
                    <p className="mt-1 text-xs text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="session" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <PracticeSession topic={selectedTopic} onBack={() => setSelectedTopic(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SpeakingPracticePage
