import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Brain, MessageSquare, Mic, MicOff, Sparkles, Square, Zap } from 'lucide-react'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const topics = [
  { id: 1, title: 'Daily Life',    description: 'Practice everyday conversations and routines.', icon: <MessageSquare size={20} />, color: 'from-blue-500 to-indigo-600' },
  { id: 2, title: 'Job Interview', description: 'Prepare for professional career opportunities.', icon: <Brain size={20} />,          color: 'from-purple-500 to-pink-600' },
  { id: 3, title: 'Travel & Tourism', description: 'Useful phrases for your next global adventure.', icon: <Zap size={20} />,        color: 'from-orange-500 to-red-600' },
]

// Session state machine
// idle → recording → processing → responding → idle
//                              ↓
//                           error

async function callEdge(path, init) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${SUPABASE_KEY}`, ...(init?.headers ?? {}) },
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(msg)
  }
  return res
}

function AudioVisualizer({ barHeights, barDurations }) {
  return (
    <div className="mt-8 flex items-end justify-center gap-1 h-12">
      {barHeights.map((height, i) => (
        <motion.div
          key={i}
          animate={{ height: [6, height, 6] }}
          transition={{ duration: barDurations[i], repeat: Infinity, ease: 'easeInOut' }}
          className="w-2 rounded-full bg-indigo-500"
        />
      ))}
    </div>
  )
}

export default function AISpeakingPanel() {
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [sessionState,  setSessionState]  = useState('idle')
  // idle | recording | processing | responding | error
  const [transcript,    setTranscript]    = useState('')
  const [aiResponse,    setAiResponse]    = useState('')
  const [errorMsg,      setErrorMsg]      = useState('')

  const mediaRecorderRef = useRef(null)
  const chunksRef        = useRef([])
  const audioRef         = useRef(null)

  // Stable random bar heights/durations for the visualiser
  const barHeights  = useMemo(() => Array.from({ length: 14 }, () => Math.random() * 36 + 8),  [])
  const barDurations = useMemo(() => Array.from({ length: 14 }, () => 0.4 + Math.random() * 0.7), [])

  // Clean up audio on unmount
  useEffect(() => () => audioRef.current?.pause(), [])

  const handleStartSession = (topic) => {
    setSelectedTopic(topic)
    setSessionState('idle')
    setTranscript('')
    setAiResponse('')
    setErrorMsg('')
  }

  // ── Recording ───────────────────────────────────────────────────────────────
  const startRecording = async () => {
    setErrorMsg('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        processAudio()
      }

      mr.start()
      mediaRecorderRef.current = mr
      setSessionState('recording')
    } catch (err) {
      setErrorMsg('Microphone access denied: ' + err.message)
      setSessionState('error')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setSessionState('processing')
  }

  // ── Transcribe → AI chat → TTS ─────────────────────────────────────────────
  const processAudio = async () => {
    try {
      // 1. Whisper transcription
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const formData = new FormData()
      formData.append('audio', blob, 'recording.webm')

      const transcribeRes = await callEdge('transcribe', { method: 'POST', body: formData })
      const { text } = await transcribeRes.json()
      setTranscript(text)

      // 2. AI chat response
      const chatRes = await callEdge('ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text, topic: selectedTopic?.title }),
      })
      const { response } = await chatRes.json()
      setAiResponse(response)

      // 3. TTS — stream audio
      setSessionState('responding')
      const ttsRes = await callEdge('ai-speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: response, voice: 'nova' }),
      })
      const audioBlob = await ttsRes.blob()
      const url = URL.createObjectURL(audioBlob)

      if (audioRef.current) audioRef.current.pause()
      audioRef.current = new Audio(url)
      audioRef.current.onended = () => {
        URL.revokeObjectURL(url)
        setSessionState('idle')
      }
      audioRef.current.play()
    } catch (err) {
      setErrorMsg(err.message)
      setSessionState('error')
    }
  }

  // ── Active session UI ───────────────────────────────────────────────────────
  if (selectedTopic) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-10">
        {/* Topic badge */}
        <div className="rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700">
          Topic: {selectedTopic.title}
        </div>

        {/* Mic orb */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {sessionState === 'recording' && (
            <span className="absolute inset-0 animate-ping rounded-full bg-red-400/25" />
          )}
          <div className={`relative flex h-36 w-36 items-center justify-center rounded-full shadow-2xl ${
            sessionState === 'recording'
              ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-red-200'
              : sessionState === 'responding'
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-200'
              : 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-200'
          }`}>
            {sessionState === 'recording'
              ? <MicOff size={44} className="text-white" />
              : <Mic size={44} className="text-white" />}
          </div>

          {/* Visualizer below orb */}
          {(sessionState === 'recording' || sessionState === 'responding') && (
            <AudioVisualizer barHeights={barHeights} barDurations={barDurations} />
          )}
        </motion.div>

        {/* State label */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-800">
            {sessionState === 'idle'       && 'Ready to speak'}
            {sessionState === 'recording'  && 'Recording… speak now'}
            {sessionState === 'processing' && 'Analysing your speech…'}
            {sessionState === 'responding' && 'AI is responding…'}
            {sessionState === 'error'      && 'Something went wrong'}
          </h3>
          {sessionState === 'processing' && (
            <div className="mx-auto mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="h-full w-1/2 rounded-full bg-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Transcript / AI response bubbles */}
        <AnimatePresence>
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">You said</p>
              <p className="text-sm text-slate-700">{transcript}</p>
            </motion.div>
          )}
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md rounded-2xl border border-indigo-100 bg-indigo-50 p-4"
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-400">AI Tutor</p>
              <p className="text-sm text-indigo-800">{aiResponse}</p>
            </motion.div>
          )}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex gap-3">
          {sessionState === 'idle' || sessionState === 'error' ? (
            <button
              onClick={startRecording}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
            >
              <Mic size={16} />
              Start Speaking
            </button>
          ) : sessionState === 'recording' ? (
            <button
              onClick={stopRecording}
              className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-red-600"
            >
              <Square size={16} />
              Stop Recording
            </button>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-6 py-3 text-sm font-semibold text-slate-500"
            >
              Processing…
            </button>
          )}

          <button
            onClick={() => { audioRef.current?.pause(); setSelectedTopic(null) }}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Change Topic
          </button>
        </div>
      </div>
    )
  }

  // ── Topic selection ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-500/20 to-transparent" />
        <div className="relative z-10 max-w-lg">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles size={12} />
            Powered by OpenAI Whisper &amp; GPT-4o
          </div>
          <h2 className="text-3xl font-bold md:text-4xl">Practice Speaking with your AI Tutor</h2>
          <p className="mt-4 text-slate-400">
            Speak freely — AI listens, understands, and responds with instant feedback.
          </p>
        </div>
        <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex h-32 w-32 rotate-12 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-400 to-purple-500 shadow-2xl"
          >
            <Sparkles size={48} className="text-white" />
          </motion.div>
        </div>
      </section>

      <div>
        <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-800">
          Choose a Topic
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-normal text-slate-400">
            {topics.length} available
          </span>
        </h3>
        <div className="grid gap-6 md:grid-cols-3">
          {topics.map((topic) => (
            <motion.div
              key={topic.id}
              whileHover={{ y: -5 }}
              className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              onClick={() => handleStartSession(topic)}
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${topic.color} text-white shadow-lg`}>
                {topic.icon}
              </div>
              <h4 className="text-lg font-bold text-slate-800">{topic.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{topic.description}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
                Start Now <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Recognition', value: '98% Accuracy', color: 'bg-indigo-50/50 border-indigo-100', icon: <Mic size={18} className="text-indigo-600" /> },
          { label: 'Feedback',    value: 'Instant Reports', color: 'bg-purple-50/50 border-purple-100', icon: <MessageSquare size={18} className="text-purple-600" /> },
          { label: 'Response',    value: 'Real-time',       color: 'bg-amber-50/50 border-amber-100',   icon: <Zap size={18} className="text-amber-600" /> },
        ].map((s) => (
          <div key={s.label} className={`flex items-center gap-3 rounded-2xl border p-4 ${s.color}`}>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm">{s.icon}</div>
            <div>
              <div className="text-xs text-slate-500">{s.label}</div>
              <div className="text-sm font-bold text-slate-800">{s.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
