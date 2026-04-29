import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle, ArrowLeft, BarChart3, Brain, CheckCircle2,
  ChevronRight, Clock, Lightbulb, Mic, MicOff, RefreshCw,
  Send, Settings, Sparkles, ThumbsUp, User, Volume2,
  VolumeX, X, Zap,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
//  GLOBAL TTS ENGINE  (Chrome bugfix included)
// ─────────────────────────────────────────────────────────────────────────────
const TTS = {
  _voices: [],
  _timer:  null,
  _utt:    null,

  // Load voices — Chrome loads them async; we poll + listen
  init() {
    if (!window.speechSynthesis) return
    const load = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length) this._voices = v
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    // Chrome sometimes needs a moment
    setTimeout(load, 200)
    setTimeout(load, 800)
    setTimeout(load, 2000)
  },

  getVoices() {
    if (!this._voices.length) this._voices = window.speechSynthesis?.getVoices() || []
    return this._voices
  },

  getEnVoices() {
    return this.getVoices().filter((v) => v.lang.startsWith('en'))
  },

  // Find voice by name (always use fresh reference)
  findVoice(name) {
    const all = this.getVoices()
    return all.find((v) => v.name === name) || null
  },

  speak(text, voiceName, rate = 0.88, onStart, onEnd) {
    if (!window.speechSynthesis) { onEnd?.(); return }

    // Stop previous
    this.stop()

    const clean = text
      .replace(/\*\*/g, '')
      .replace(/\n{2,}/g, '. ')
      .replace(/\n/g, ', ')
      .trim()
      .slice(0, 800)

    if (!clean) { onEnd?.(); return }

    const utt    = new SpeechSynthesisUtterance(clean)
    utt.lang     = 'en-US'
    utt.rate     = Math.max(0.5, Math.min(2, rate))
    utt.pitch    = 1.05
    utt.volume   = 1.0
    this._utt    = utt

    // Find voice by name (fresh reference each time)
    if (voiceName) {
      const v = this.findVoice(voiceName)
      if (v) utt.voice = v
    }

    utt.onstart = () => { this._startChromeFix(); onStart?.() }
    utt.onend   = () => { this._stopChromeFix();  onEnd?.()   }
    utt.onerror = (e) => {
      this._stopChromeFix()
      // Retry without voice on error
      if (e.error !== 'interrupted') {
        const fallback = new SpeechSynthesisUtterance(clean)
        fallback.lang = 'en-US'
        fallback.rate = rate
        fallback.onend = () => onEnd?.()
        fallback.onerror = () => onEnd?.()
        window.speechSynthesis.speak(fallback)
      } else {
        onEnd?.()
      }
    }

    // Small delay — prevents Chrome "not-allowed" error
    setTimeout(() => {
      try { window.speechSynthesis.speak(utt) } catch (_) { onEnd?.() }
    }, 60)
  },

  stop() {
    this._stopChromeFix()
    try { window.speechSynthesis?.cancel() } catch (_) {}
    this._utt = null
  },

  // Chrome bug: synthesis pauses after ~15s — keep it alive
  _startChromeFix() {
    this._stopChromeFix()
    this._timer = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause()
        window.speechSynthesis.resume()
      } else {
        this._stopChromeFix()
      }
    }, 10000)
  },
  _stopChromeFix() {
    if (this._timer) { clearInterval(this._timer); this._timer = null }
  },
}

// Initialise once on module load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TTS.init())
  } else {
    TTS.init()
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  VOICE MANAGER HOOK
// ─────────────────────────────────────────────────────────────────────────────
const FEMALE_KW = ['Samantha','Karen','Moira','Tessa','Fiona','Victoria','Veena','Ava','Susan',
  'Emma','Joanna','Ivy','Kendra','Kimberly','Salli','Nicole','Aria','Jenny','Ana','Zira',
  'Hazel','Linda','female','woman']
const MALE_KW   = ['Alex','Daniel','David','James','Tom','Fred','Bruce','Ryan','Matthew',
  'Aaron','Stephen','Joey','Justin','Kevin','Russell','George','male','man']

function voiceGender(v) {
  const n = v.name + ' ' + v.lang
  if (FEMALE_KW.some((k) => n.includes(k))) return 'female'
  if (MALE_KW.some((k) => n.includes(k))) return 'male'
  // Fallback: even index = female, odd = male
  return null
}

function useVoices() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const bump = () => setTick((t) => t + 1)
    window.speechSynthesis?.addEventListener('voiceschanged', bump)
    const t1 = setTimeout(bump, 300)
    const t2 = setTimeout(bump, 1000)
    const t3 = setTimeout(bump, 2500)
    return () => {
      window.speechSynthesis?.removeEventListener('voiceschanged', bump)
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
    }
  }, [])

  const all = TTS.getEnVoices()
  const female = all.filter((v) => voiceGender(v) === 'female')
  const male   = all.filter((v) => voiceGender(v) === 'male')
  const other  = all.filter((v) => !voiceGender(v))

  return {
    female: female.length ? female : other.filter((_, i) => i % 2 === 0).slice(0, 4),
    male:   male.length   ? male   : other.filter((_, i) => i % 2 !== 0).slice(0, 4),
    all,
  }
}

// Convenience wrappers (keep same API as before)
function speakText(text, voiceNameOrObj, rate = 0.88, onStart, onEnd) {
  const name = typeof voiceNameOrObj === 'string'
    ? voiceNameOrObj
    : voiceNameOrObj?.name || null
  TTS.speak(text, name, rate, onStart, onEnd)
}

function stopSpeaking() {
  TTS.stop()
}

// ─────────────────────────────────────────────────────────────────────────────
//  SPEECH RECOGNITION
// ─────────────────────────────────────────────────────────────────────────────
function useSpeechRec() {
  const [transcript, setTranscript]   = useState('')
  const [interim,    setInterim]      = useState('')
  const [listening,  setListening]    = useState(false)
  const [supported,  setSupported]    = useState(true)
  const recogRef  = useRef(null)
  const finalRef  = useRef('')

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setSupported(false); return }

    const r       = new SR()
    r.lang        = 'en-US'
    r.continuous  = true
    r.interimResults = true
    r.maxAlternatives = 1

    r.onresult = (e) => {
      let fin = '', int = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) fin += t + ' '
        else int = t
      }
      if (fin) {
        finalRef.current += fin
        setTranscript(finalRef.current)
      }
      setInterim(int)
    }
    r.onend   = () => { setListening(false); setInterim('') }
    r.onerror = () => { setListening(false); setInterim('') }

    recogRef.current = r
  }, [])

  const start = useCallback(() => {
    finalRef.current = ''
    setTranscript('')
    setInterim('')
    if (recogRef.current) {
      try { recogRef.current.start(); setListening(true) } catch (_) {}
    }
  }, [])

  const stop = useCallback(() => {
    if (recogRef.current) {
      try { recogRef.current.stop() } catch (_) {}
    }
    setListening(false)
  }, [])

  const clear = useCallback(() => {
    finalRef.current = ''
    setTranscript('')
    setInterim('')
  }, [])

  return { transcript, interim, listening, supported, start, stop, clear }
}

// ─────────────────────────────────────────────────────────────────────────────
//  GRAMMAR ANALYSER
// ─────────────────────────────────────────────────────────────────────────────
const GRAMMAR_RULES = [
  { id: 'g1',  pattern: /\b(I|he|she|it)\s+are\b/gi,         msg: '"is" ishlatilishi kerak',          fix: (m) => m.replace(/are/i, 'is') },
  { id: 'g2',  pattern: /\b(you|we|they)\s+is\b/gi,          msg: '"are" ishlatilishi kerak',          fix: (m) => m.replace(/\bis\b/i, 'are') },
  { id: 'g3',  pattern: /\bI\s+goes?\b/gi,                    msg: '"I go" — goes emas',               fix: (m) => m.replace(/goes?/i, 'go') },
  { id: 'g4',  pattern: /\b(he|she|it)\s+\bgo\b(?!es|ing)/gi,msg: '"goes" — uchun',                   fix: (m) => m.replace(/\bgo\b/i, 'goes') },
  { id: 'g5',  pattern: /\bdid\s+(\w+ed|went|came|saw)\b/gi, msg: 'did + base form: "did go" emas',   fix: null },
  { id: 'g6',  pattern: /\bdoesn\'t\s+(\w+s\b)/gi,           msg: "doesn't + base form",              fix: null },
  { id: 'g7',  pattern: /\b(a)\s+[aeiouAEIOU]/g,             msg: '"an" bo\'lishi kerak (unli oldin)', fix: (m) => m.replace(/\ba\b/, 'an') },
  { id: 'g8',  pattern: /\ban\s+[^aeiou\s\W]/gi,             msg: '"a" bo\'lishi kerak (undosh oldin)',fix: (m) => m.replace(/\ban\b/i, 'a') },
  { id: 'g9',  pattern: /\bmore\s+\w+er\b/gi,                msg: '"more" + comparative — noto\'g\'ri',fix: null },
  { id: 'g10', pattern: /\bI\s+have\s+\d+\s+year/gi,         msg: '"I am X years old" — to\'g\'ri',   fix: null },
  { id: 'g11', pattern: /\bdon\'t\s+has\b/gi,                 msg: '"don\'t have" ishlatilsin',         fix: (m) => m.replace(/has/, 'have') },
  { id: 'g12', pattern: /\bI\s+am\s+agree\b/gi,              msg: '"I agree" — "am agree" emas',       fix: (m) => m.replace(/am agree/, 'agree') },
  { id: 'g13', pattern: /\bI\s+am\s+\d+\s+years?\b/gi,       msg: '"I am X years old" — "old" kerak', fix: null },
  { id: 'g14', pattern: /\bmuch\s+(books|people|cars)\b/gi,  msg: '"many" (sanaladigan narsalar)',      fix: (m) => m.replace(/much/, 'many') },
  { id: 'g15', pattern: /\bI\s+was\s+born\s+in\s+\d{4}\s+year\b/gi, msg: '"born in 1999" — "year" shart emas', fix: null },
]

function analyseGrammar(text) {
  const errors = []
  const seen   = new Set()
  GRAMMAR_RULES.forEach((rule) => {
    const matches = [...text.matchAll(rule.pattern)]
    matches.forEach((m) => {
      const key = rule.id + m[0].toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        errors.push({ id: rule.id, original: m[0], msg: rule.msg, fix: rule.fix ? rule.fix(m[0]) : null })
      }
    })
  })
  return errors
}

// ─────────────────────────────────────────────────────────────────────────────
//  VOCABULARY ANALYSER
// ─────────────────────────────────────────────────────────────────────────────
const VOCAB_MAP = {
  'very good':      { adv: 'excellent / outstanding / superb',         tag: 'Yuqori daraja' },
  'very bad':       { adv: 'terrible / dreadful / appalling',          tag: 'Yuqori daraja' },
  'very big':       { adv: 'enormous / vast / massive / colossal',     tag: 'Yuqori daraja' },
  'very small':     { adv: 'tiny / minuscule / minute',                tag: 'Yuqori daraja' },
  'very happy':     { adv: 'thrilled / overjoyed / delighted / ecstatic', tag: 'Yuqori daraja' },
  'very sad':       { adv: 'devastated / heartbroken / despondent',    tag: 'Yuqori daraja' },
  'very tired':     { adv: 'exhausted / drained / worn out',           tag: 'Yuqori daraja' },
  'very fast':      { adv: 'rapidly / swiftly / at lightning speed',   tag: 'Yuqori daraja' },
  'very important': { adv: 'crucial / vital / essential / pivotal',    tag: 'IELTS Band+' },
  'very difficult': { adv: 'challenging / demanding / formidable',     tag: 'IELTS Band+' },
  'very interesting':{ adv: 'fascinating / captivating / compelling',  tag: 'IELTS Band+' },
  'very nice':      { adv: 'wonderful / delightful / charming',        tag: 'Yuqori daraja' },
  'i think':        { adv: 'I would argue / In my view / I believe / I contend', tag: 'IELTS format' },
  'a lot of':       { adv: 'numerous / a great deal of / a significant number of', tag: 'Akademik' },
  'many people':    { adv: 'a large number of people / the majority of people', tag: 'Akademik' },
  'also':           { adv: 'furthermore / in addition / moreover / additionally', tag: "Bog'lovchi" },
  'but':            { adv: 'however / nevertheless / on the other hand / yet', tag: "Bog'lovchi" },
  'because':        { adv: 'due to / owing to / as a result of / since', tag: 'Akademik' },
  'so':             { adv: 'therefore / consequently / as a result / thus', tag: "Bog'lovchi" },
  'get':            { adv: 'obtain / acquire / receive / attain',      tag: 'Rasmiy' },
  'use':            { adv: 'utilise / employ / implement / apply',     tag: 'Rasmiy' },
  'show':           { adv: 'demonstrate / illustrate / indicate',      tag: 'Rasmiy' },
  'help':           { adv: 'assist / facilitate / support / enable',   tag: 'Rasmiy' },
  'make':           { adv: 'create / establish / generate / produce',  tag: 'Rasmiy' },
  'good':           { adv: 'beneficial / advantageous / favourable',   tag: 'Sifat' },
  'bad':            { adv: 'detrimental / adverse / unfavourable',     tag: 'Sifat' },
  'start':          { adv: 'initiate / commence / embark on',          tag: 'Rasmiy' },
  'end':            { adv: 'conclude / terminate / finalise',          tag: 'Rasmiy' },
  'big problem':    { adv: 'significant issue / major challenge / pressing concern', tag: 'IELTS Band+' },
  'in my country':  { adv: 'in my home country / in my native country', tag: 'IELTS format' },
}

function analyseVocabulary(text) {
  const lower = text.toLowerCase()
  const hits  = []
  const seen  = new Set()
  Object.entries(VOCAB_MAP).forEach(([basic, { adv, tag }]) => {
    if (lower.includes(basic) && !seen.has(basic)) {
      seen.add(basic)
      hits.push({ used: basic, better: adv, tag })
    }
  })
  return hits
}

// ─────────────────────────────────────────────────────────────────────────────
//  FLUENCY ANALYSER
// ─────────────────────────────────────────────────────────────────────────────
function analyseFluency(text, durationSec = 0) {
  const words      = text.trim().split(/\s+/).filter(Boolean)
  const wpm        = durationSec > 5 ? Math.round((words.length / durationSec) * 60) : null
  const sentences  = text.split(/[.!?]+/).filter((s) => s.trim().length > 2)
  const avgLen     = sentences.length ? words.length / sentences.length : 0
  const fillers    = (text.match(/\b(um|uh|er|ah|like|you know|I mean|sort of|kind of)\b/gi) || []).length

  const connectors = (text.match(/\b(however|furthermore|moreover|therefore|consequently|in addition|on the other hand|as a result|in contrast|for instance|for example|in particular|notably|significantly)\b/gi) || []).length

  const complexity = sentences.filter((s) => s.trim().split(/\s+/).length > 12).length

  return { words: words.length, wpm, avgSentenceLen: +avgLen.toFixed(1), fillers, connectors, complexity }
}

// ─────────────────────────────────────────────────────────────────────────────
//  BAND SCORE CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
function calcBand(messages) {
  const userMsgs = messages.filter((m) => m.role === 'user' && m.text)
  if (!userMsgs.length) return null

  const fullText  = userMsgs.map((m) => m.text).join(' ')
  const allErrors = userMsgs.flatMap((m) => m.errors || [])
  const allVocab  = userMsgs.flatMap((m) => m.vocab || [])
  const fluency   = analyseFluency(fullText)

  // Fluency & Coherence (1-9)
  let fc = 6.0
  if (fluency.words > 200)  fc += 1.0
  if (fluency.words > 100)  fc += 0.5
  if (fluency.connectors > 3) fc += 0.5
  if (fluency.fillers > 5)  fc -= 0.5
  if (fluency.avgSentenceLen > 15) fc += 0.5
  fc = Math.min(9, Math.max(3.5, fc))

  // Grammar (1-9)
  let gr = 7.0 - allErrors.length * 0.4
  if (allErrors.length === 0) gr = 8.0
  gr = Math.min(9, Math.max(3.5, gr))

  // Vocabulary (1-9)
  let lx = 6.5
  const upgrades = allVocab.length
  if (upgrades > 5) lx -= 0.5     // too many basic words
  if (fluency.connectors > 4) lx += 1.0
  if (upgrades === 0) lx += 1.0   // no basic words found — good sign
  lx = Math.min(9, Math.max(3.5, lx))

  // Pronunciation (estimated from writing complexity)
  const pr = Math.min(9, Math.max(3.5, (fc + gr) / 2))

  const overall = +(Math.round(((fc + gr + lx + pr) / 4) * 2) / 2).toFixed(1)

  return { fc: +fc.toFixed(1), gr: +gr.toFixed(1), lx: +lx.toFixed(1), pr: +pr.toFixed(1), overall, fluency, allErrors, allVocab, fullText }
}

// ─────────────────────────────────────────────────────────────────────────────
//  AI CONVERSATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────
const AI_PERSONALITIES = {
  examiner: {
    name: 'IELTS Examiner',
    style: 'professional',
    greeting: "Good morning! Welcome to your IELTS Speaking practice session. I'm your examiner today. Let's start with Part 1. Can you tell me your full name and where you're from?",
  },
  friend: {
    name: 'English Friend',
    style: 'casual',
    greeting: "Hey! Great to chat with you today! My name is Jamie and I'm here to practise English with you. So, tell me — what's been going on in your life lately?",
  },
  teacher: {
    name: 'English Teacher',
    style: 'educational',
    greeting: "Hello! I'm your English conversation teacher today. We'll have a natural conversation, and I'll help you improve as we go. First, let me ask — what brings you to learn English, and what's your main goal?",
  },
}

const TOPIC_STARTERS = {
  travel:     "I'd love to hear about your travel experiences! Have you ever been abroad, or is there a place you'd really love to visit?",
  food:       "Let's talk about food! What's your absolute favourite meal, and can you describe what makes it so special to you?",
  technology: "Technology is changing so fast! How do you think smartphones have changed daily life — for better or worse?",
  education:  "Education is such an interesting topic. Do you think the way people learn has changed a lot with the internet?",
  work:       "Tell me about what you do for work or study. What do you enjoy most about it, and what challenges do you face?",
  family:     "Family is really important. Can you tell me a bit about your family and what role they play in your life?",
  hobbies:    "Everyone needs hobbies to relax! What do you like to do in your free time, and how did you get into it?",
  environment:"The environment is such a pressing issue. What do you think individuals can do to make a real difference?",
  culture:    "Uzbekistan has such a rich culture! What aspects of your culture are you most proud of?",
  future:     "Where do you see yourself in five years? What are your biggest hopes and dreams?",
}

const FOLLOW_UP_BANK = [
  "That's fascinating! Could you tell me a bit more about that?",
  "I see. Why do you think that is?",
  "Interesting! How did that make you feel?",
  "And what do you think the main reason for that is?",
  "Could you give me an example of what you mean?",
  "How long have you felt that way?",
  "Do you think most people in your country would agree with you?",
  "Has that always been the case, or has it changed recently?",
  "What would you say to someone who disagreed with your view?",
  "If you could change one thing about that, what would it be?",
  "That's a great point. Can you expand on that idea?",
  "How does that compare to how things were, say, ten years ago?",
  "What impact do you think that has on society as a whole?",
  "Is there anything you'd like to add to what you've said?",
]

const SHORT_RESPONSE_PROMPTS = [
  "Could you say a little more about that? Try to give an example or explain your reasoning.",
  "Great start! Now try to elaborate — why exactly do you feel that way?",
  "Interesting! Can you develop that idea further? Aim for two or three sentences.",
  "Good! For a higher band score, try to extend your answer with a reason or personal example.",
]

const ENCOURAGEMENT = [
  "Excellent answer! You expressed yourself very clearly.",
  "That was really well put! Great vocabulary too.",
  "Wonderful! You gave a detailed and well-structured response.",
  "Very good! I could follow your ideas clearly.",
  "Great job! You're speaking with real confidence.",
  "That's a sophisticated answer — well done!",
  "Impressive! You used some excellent linking language there.",
]

function detectTopic(text) {
  const lower = text.toLowerCase()
  for (const [topic, starter] of Object.entries(TOPIC_STARTERS)) {
    if (lower.includes(topic)) return { topic, starter }
  }
  return null
}

function generateAIReply(userText, history, personality, questionCount) {
  const words = userText.trim().split(/\s+/).filter(Boolean).length
  const errors = analyseGrammar(userText)
  const lower  = userText.toLowerCase()

  // Handle very short responses
  if (words < 8) {
    return SHORT_RESPONSE_PROMPTS[Math.floor(Math.random() * SHORT_RESPONSE_PROMPTS.length)]
  }

  // Detect if user is confused or asking for help
  if (lower.includes("i don't understand") || lower.includes("what do you mean") || lower.includes("can you repeat")) {
    return "Of course! No problem at all. Let me rephrase that. I was asking you to share your thoughts and experiences on this topic. Just speak naturally — there are no wrong answers here. Take your time."
  }

  // Detect topic in user's speech
  const topicMatch = detectTopic(lower)
  if (topicMatch && history.length < 4) {
    return `Oh, ${topicMatch.topic}! That's a great topic. ${topicMatch.starter}`
  }

  // Encouragement for long answers
  const encourage = words > 60
    ? ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)] + " "
    : words > 30
    ? ["I see, thank you. ", "That's really interesting! ", "Good point! "][Math.floor(Math.random() * 3)]
    : ""

  // Grammar correction (subtle)
  let correction = ""
  if (errors.length > 0 && Math.random() > 0.4) {
    const err = errors[0]
    correction = err.fix
      ? `Just a small note — instead of "${err.original}", you could say "${err.fix}". `
      : `Quick tip: "${err.original}" — ${err.msg}. `
  }

  // Context-sensitive follow-up
  let followUp = ""
  if (lower.includes("uzbek") || lower.includes("tashkent") || lower.includes("samarkand") || lower.includes("bukhara")) {
    followUp = "Uzbekistan sounds absolutely wonderful! What's the one thing you think visitors to your country should definitely experience?"
  } else if (lower.includes("ielts") || lower.includes("exam") || lower.includes("test")) {
    followUp = "Preparing for IELTS is such a big undertaking. What do you find most challenging about it — reading, writing, or speaking?"
  } else if (lower.includes("job") || lower.includes("work") || lower.includes("career")) {
    followUp = "Work and career are so important. If money weren't an issue, what would your ideal job be and why?"
  } else if (lower.includes("family") || lower.includes("parents") || lower.includes("brother") || lower.includes("sister")) {
    followUp = "Family bonds are so important. In what ways do you think family shapes who we are as people?"
  } else if (lower.includes("university") || lower.includes("college") || lower.includes("school") || lower.includes("study")) {
    followUp = "Education is fascinating. Do you think the skills you learn at university are actually useful in real life?"
  } else if (lower.includes("technology") || lower.includes("phone") || lower.includes("internet") || lower.includes("social media")) {
    followUp = "Technology really is transforming everything. Do you think it's making us more connected or more isolated as a society?"
  } else if (lower.includes("travel") || lower.includes("country") || lower.includes("abroad") || lower.includes("visit")) {
    followUp = "Travelling really does broaden the mind! If you could live in any country other than Uzbekistan, where would you choose and why?"
  } else {
    // Random thoughtful follow-up
    followUp = FOLLOW_UP_BANK[Math.floor(Math.random() * FOLLOW_UP_BANK.length)]
  }

  return encourage + correction + followUp
}

// ─────────────────────────────────────────────────────────────────────────────
//  PRONUNCIATION TIPS DATABASE
// ─────────────────────────────────────────────────────────────────────────────
const PRONUNC_DB = [
  { word: 'think',       ipa: '/θɪŋk/',         tip: 'th → til oldingi tishlar orasiga, "s" emas "θ"' },
  { word: 'this',        ipa: '/ðɪs/',           tip: 'th → "d" emas, yumshoq "ð" tovushi' },
  { word: 'world',       ipa: '/wɜːld/',         tip: '"w" + "ɜːld" — "v" emas! Lablar yumaloq bo\'lsin' },
  { word: 'comfortable', ipa: '/ˈkʌmftəbl/',     tip: 'Uch bo\'g\'in: "CUMF-tuh-bul" (5 emas)' },
  { word: 'vegetables',  ipa: '/ˈvedʒtəblz/',    tip: 'Uch bo\'g\'in: "VEJ-tuh-bulz"' },
  { word: 'important',   ipa: '/ɪmˈpɔːtnt/',     tip: 'Stress ikkinchi: "im-POR-tant"' },
  { word: 'develop',     ipa: '/dɪˈveləp/',       tip: 'Stress o\'rtada: "di-VEL-up"' },
  { word: 'environment', ipa: '/ɪnˈvaɪrənmənt/', tip: '"t" ko\'pincha jim: "en-VY-run-ment"' },
  { word: 'specific',    ipa: '/spəˈsɪfɪk/',     tip: 'Stress ikkinchi: "spe-SIF-ic"' },
  { word: 'technology',  ipa: '/tekˈnɒlədʒi/',   tip: '"ch" = "k" bu yerda: "tek-NOL-uh-jee"' },
  { word: 'actually',    ipa: '/ˈæktʃuəli/',     tip: '"ch" bor: "AK-chu-uh-lee"' },
  { word: 'usually',     ipa: '/ˈjuːʒuəli/',     tip: '"zh" tovushi: "YOO-zhoo-uh-lee"' },
  { word: 'especially',  ipa: '/ɪˈspeʃəli/',     tip: 'Stress ikkinchi: "e-SPESH-uh-lee"' },
  { word: 'interesting', ipa: '/ˈɪntrɪstɪŋ/',   tip: 'Uch bo\'g\'in: "IN-truh-sting"' },
  { word: 'opportunity', ipa: '/ˌɒpəˈtjuːnɪti/',tip: 'Stress uchinchi: "op-uh-TYOO-ni-tee"' },
  { word: 'government',  ipa: '/ˈɡʌvənmənt/',    tip: 'Uch bo\'g\'in: "GUV-un-ment"' },
  { word: 'pronunciation',ipa: '/prəˌnʌnsiˈeɪʃn/',tip: '"pronounciation" emas! "pro-NUN-see-AY-shun"' },
  { word: 'clothes',     ipa: '/kloʊðz/',         tip: '"cloths" emas — "z" bilan tugaydi' },
  { word: 'recipe',      ipa: '/ˈresɪpi/',        tip: 'Uch bo\'g\'in: "RES-ih-pee" ("recipee" emas)' },
  { word: 'colleague',   ipa: '/ˈkɒliːɡ/',        tip: '"g" jim: "KOL-eeg"' },
]

function getPronuncTips(text) {
  const lower = text.toLowerCase()
  return PRONUNC_DB.filter((p) => lower.includes(p.word)).slice(0, 3)
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCORE REPORT
// ─────────────────────────────────────────────────────────────────────────────
const BAND_LABELS = {
  9: 'Expert',    8.5: 'Very Good', 8: 'Very Good',
  7.5: 'Good',   7: 'Good User',   6.5: 'Competent',
  6: 'Competent', 5.5: 'Modest',   5: 'Modest',
  4.5: 'Limited', 4: 'Limited',    3.5: 'Limited',
}

const BAND_COLORS = {
  9: 'text-emerald-600', 8.5: 'text-emerald-600', 8: 'text-emerald-500',
  7.5: 'text-sky-600',   7: 'text-sky-500',       6.5: 'text-indigo-500',
  6: 'text-indigo-400',  5.5: 'text-violet-500',  5: 'text-amber-500',
  4.5: 'text-orange-500',4: 'text-red-400',       3.5: 'text-red-500',
}

function getHigherBandTips(score) {
  const tips = []
  if (score.fc < 7) {
    tips.push("🎯 Fluency: Ko'proq gapiring! Har javobda kamida 5-7 gap bo'lsin. Pauzalarni to'ldirish uchun 'Well...', 'That's an interesting question...', 'Let me think about that...' ishlating.")
    tips.push("🔗 Coherence: Bog'lovchilar qo'shing: 'Furthermore', 'On the other hand', 'As a result', 'For instance'. Bu Band 7+'ga ko'taradi.")
  }
  if (score.gr < 7) {
    tips.push("📝 Grammar: Present Perfect ('I have been...'), Conditionals ('If I were...'), Passive voice ('It is believed that...') ishlating. Bu structures band'ingizni oshiradi.")
    tips.push("⚠️ Articles: 'a/an/the' bilan diqqatli bo'ling. Bu O'zbek talabalarining eng ko'p xatosi.")
  }
  if (score.lx < 7) {
    tips.push("💡 Vocabulary: 'Very good/bad/big' o'rniga 'exceptional/dreadful/enormous' ishlating. Har kuni 10 ta yangi so'z o'rgang.")
    tips.push("🎨 Idiomatic language: 'It goes without saying', 'In the long run', 'On the whole' — bu iboralar Band 7+ uchun zarur.")
  }
  tips.push("🎙️ Pronunciation: Har kuni BBC Learning English yoki 6 Minute English tinglab taqlid qiling. 'th' va 'r/l' tovushlariga e'tibor bering.")
  tips.push("📖 Reading: Inglizcha matnlar o'qib, yangi so'zlarni kontekstda o'rgang. The Guardian, BBC News — har kuni 10-15 daqiqa.")
  return tips.slice(0, 5)
}

function ScoreReport({ messages, onRestart, voiceObj }) {
  const score = calcBand(messages)
  if (!score) return <div className="text-center text-slate-400 py-16">Yetarli ma'lumot yo'q</div>

  const pronuncTips = getPronuncTips(score.fullText)
  const bandTips    = getHigherBandTips(score)
  const bandColor   = BAND_COLORS[score.overall] || 'text-indigo-600'
  const bandLabel   = BAND_LABELS[score.overall] || ''

  const uniqueErrors = [...new Map(score.allErrors.map((e) => [e.original.toLowerCase(), e])).values()]
  const uniqueVocab  = [...new Map(score.allVocab.map((v) => [v.used, v])).values()]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-5 pb-10">

      {/* Hero score */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-7 text-white shadow-xl">
        <p className="text-sm text-indigo-200">Sessiya yakunlandi 🎉</p>
        <h2 className="mt-1 text-2xl font-black">Speaking Baholash Natijalari</h2>

        <div className="mt-5 flex items-center gap-6">
          <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full bg-white shadow-xl">
            <p className={`text-5xl font-black ${bandColor}`}>{score.overall}</p>
            <p className="text-[11px] text-slate-400 font-medium">{bandLabel}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {[
              { label: 'Jami so\'z', value: score.fluency.words },
              { label: 'Javoblar', value: messages.filter((m) => m.role === 'user').length },
              { label: 'Grammar xato', value: uniqueErrors.length },
              { label: 'Vocab maslahat', value: uniqueVocab.length },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl bg-white/15 p-3 text-center">
                <p className="text-2xl font-black">{value}</p>
                <p className="text-[11px] text-indigo-200">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Band explanation */}
        <div className="mt-4 rounded-2xl bg-white/10 p-3 text-sm text-indigo-100">
          <strong>Band {score.overall} ({bandLabel}):</strong>{' '}
          {score.overall >= 8 ? 'Juda a\'lo! Professional darajada inglizcha muloqot qila olasiz.' :
           score.overall >= 7 ? 'Yaxshi! Murakkab mavzularda erkin gaplasha olasiz.' :
           score.overall >= 6 ? 'O\'rta daraja. Ko\'pchilik talablarga mos. Kuchaytirishingiz mumkin.' :
           score.overall >= 5 ? 'Qoniqarli. Asosiy fikrlarni ifodalay olasiz, lekin cheklovlar bor.' :
           'Rivojlanish zarur. Muntazam mashq qilib, tez yaxshilanasiz.'}
        </div>
      </div>

      {/* 4 skills */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-bold text-slate-900">Ko'nikmalar bo'yicha baho</h3>
        <div className="space-y-4">
          {[
            { label: 'Fluency & Coherence', score: score.fc, desc: 'Gapirish tezligi, ravonligi, bog\'liqligi', color: 'bg-sky-500' },
            { label: 'Grammatical Range & Accuracy', score: score.gr, desc: 'Grammar xatolar soni va murakkablik', color: 'bg-emerald-500' },
            { label: 'Lexical Resource', score: score.lx, desc: 'Lug\'at boyligi va so\'z tanlash', color: 'bg-violet-500' },
            { label: 'Pronunciation', score: score.pr, desc: 'Talaffuz aniqligi (taxminiy)', color: 'bg-amber-500' },
          ].map(({ label, score: s, desc, color }) => (
            <div key={label}>
              <div className="mb-1 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="text-[11px] text-slate-400">{desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-slate-900">{s}</p>
                  <p className="text-[10px] text-slate-400">/ 9.0</p>
                </div>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(s / 9) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`h-full rounded-full ${color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Fluency stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          {[
            { label: 'Jami so\'z', value: score.fluency.words },
            { label: 'Bog\'lovchilar', value: score.fluency.connectors },
            { label: 'Filler so\'zlar', value: score.fluency.fillers },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-slate-50 p-2">
              <p className={`text-lg font-black ${value === 0 && label.includes('Filler') ? 'text-emerald-600' : 'text-slate-800'}`}>{value}</p>
              <p className="text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grammar errors */}
      {uniqueErrors.length > 0 && (
        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-900">
            <AlertCircle size={16} className="text-red-400" />
            Grammar xatoliklar ({uniqueErrors.length} ta)
          </h3>
          <div className="space-y-2.5">
            {uniqueErrors.map((err) => (
              <div key={err.original + err.id} className="rounded-xl border border-red-100 bg-red-50 p-3">
                <div className="flex items-start gap-2">
                  <X size={14} className="mt-0.5 shrink-0 text-red-400" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-bold line-through text-red-600">"{err.original}"</span>
                      <span className="ml-2 text-xs text-red-500">— {err.msg}</span>
                    </p>
                    {err.fix && (
                      <p className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 size={11} />To'g'risi: "{err.fix}"
                      </p>
                    )}
                  </div>
                  <button onClick={() => speakText(err.fix || err.original, voiceObj?.selectedName)}
                    className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
                    <Volume2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vocabulary */}
      {uniqueVocab.length > 0 && (
        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-900">
            <Brain size={16} className="text-amber-500" />
            Vocabulary yaxshilash ({uniqueVocab.length} ta imkoniyat)
          </h3>
          <div className="space-y-2">
            {uniqueVocab.slice(0, 8).map((v) => (
              <div key={v.used} className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-600">"{v.used}"</span>
                  <span className="mx-2 text-amber-400">→</span>
                  <span className="text-sm font-bold text-amber-900">"{v.better.split(' / ')[0]}"</span>
                  <p className="mt-0.5 text-[11px] text-amber-600">
                    Boshqa variantlar: {v.better.split(' / ').slice(1).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => speakText(v.better.split(' / ')[0], voiceObj?.selectedName)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200">
                    <Volume2 size={12} />
                  </button>
                  <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">{v.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pronunciation */}
      {pronuncTips.length > 0 && (
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-900">
            <Volume2 size={16} className="text-sky-500" />
            Talaffuz maslahatlari
          </h3>
          <div className="space-y-2.5">
            {pronuncTips.map((tip) => (
              <div key={tip.word} className="flex items-start gap-3 rounded-xl bg-sky-50 border border-sky-100 p-3">
                <button onClick={() => speakText(tip.word, voiceObj?.selectedName, 0.7)}
                  className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600 hover:bg-sky-200 transition">
                  <Volume2 size={16} />
                </button>
                <div>
                  <p className="font-bold text-sky-900">
                    {tip.word}
                    <span className="ml-2 font-normal text-sky-500 font-mono">{tip.ipa}</span>
                  </p>
                  <p className="text-xs text-sky-700 mt-0.5">{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How to get higher band */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
        <h3 className="mb-3 flex items-center gap-2 font-bold text-indigo-900">
          <ThumbsUp size={16} className="text-indigo-500" />
          Band {score.overall} → Band {Math.min(9, score.overall + 0.5)} ga o'tish uchun
        </h3>
        <ul className="space-y-2">
          {bandTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-indigo-800">
              <span className="mt-0.5 shrink-0 font-black text-indigo-500">{i + 1}.</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={onRestart}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-4 text-sm font-bold text-white shadow-md">
        <RefreshCw size={15} />Yangi suhbat boshlash
      </button>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  VOICE SELECTOR
// ─────────────────────────────────────────────────────────────────────────────
function VoiceSelector({ selectedName, onSelect, gender, onGenderChange }) {
  const voices    = useVoices()
  const [open, setOpen]       = useState(false)
  const [testing, setTesting] = useState(null)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const available  = gender === 'female' ? voices.female : voices.male
  const currentName = selectedName || available[0]?.name || (gender === 'female' ? 'Ayol ovoz' : 'Erkak ovoz')
  const displayName = currentName.length > 14 ? currentName.slice(0, 14) + '…' : currentName

  function testVoice(e, v) {
    e.stopPropagation()
    setTesting(v.name)
    speakText('Hello! This is my voice. How does it sound?', v.name, 0.9,
      null, () => setTesting(null))
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition">
        <span>{gender === 'female' ? '👩' : '👨'}</span>
        {displayName}
        <ChevronRight size={12} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          style={{ zIndex: 9999 }}>

          {/* Gender tabs */}
          <div className="grid grid-cols-2 gap-1.5 border-b border-slate-100 p-2">
            {[
              { id: 'female', label: '👩 Ayol ovoz', active: 'bg-pink-100 text-pink-700 border-pink-300', inactive: 'text-slate-500 hover:bg-slate-50' },
              { id: 'male',   label: '👨 Erkak ovoz', active: 'bg-blue-100 text-blue-700 border-blue-300', inactive: 'text-slate-500 hover:bg-slate-50' },
            ].map(({ id, label, active, inactive }) => (
              <button key={id}
                onClick={() => { onGenderChange(id) }}
                className={`flex items-center justify-center gap-1.5 rounded-xl border-2 py-2 text-xs font-bold transition ${
                  gender === id ? active : `border-transparent ${inactive}`
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* Voice list */}
          <div className="max-h-56 overflow-y-auto p-2">
            {available.length === 0 ? (
              <div className="py-5 text-center">
                <Volume2 size={24} className="mx-auto mb-2 text-slate-300" />
                <p className="text-xs text-slate-500">Ovozlar yuklanmoqda...</p>
                <p className="mt-1 text-[11px] text-slate-400">Chrome yoki Edge ishlatishni tavsiya qilamiz</p>
              </div>
            ) : (
              available.map((v) => (
                <div key={v.name}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 transition cursor-pointer ${
                    selectedName === v.name
                      ? 'bg-indigo-50 border border-indigo-200'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                  onClick={() => { onSelect(v.name); setOpen(false) }}>

                  {/* Check mark */}
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    selectedName === v.name ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                  }`}>
                    {selectedName === v.name && <CheckCircle2 size={12} className="text-white" />}
                  </div>

                  {/* Name + lang */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${selectedName === v.name ? 'text-indigo-700' : 'text-slate-800'}`}>
                      {v.name}
                    </p>
                    <p className="text-[10px] text-slate-400">{v.lang}</p>
                  </div>

                  {/* Test button */}
                  <button
                    onClick={(e) => testVoice(e, v)}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
                      testing === v.name ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600'
                    }`}>
                    {testing === v.name ? <VolumeX size={12} /> : <Volume2 size={12} />}
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 px-3 py-2">
            <p className="text-[10px] text-slate-400">
              💡 ▶ tugmasi bilan har ovozni sinab ko'ring
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  CHAT MESSAGE
// ─────────────────────────────────────────────────────────────────────────────
function ChatMsg({ msg, onPlay, isSpeaking }) {
  const isAI = msg.role === 'ai'
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>

      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold ${
        isAI
          ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md'
          : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md'
      }`}>
        {isAI ? '🤖' : '👤'}
      </div>

      <div className={`max-w-[80%] space-y-1.5 ${isAI ? '' : 'flex flex-col items-end'}`}>
        <p className={`text-[11px] font-bold ${isAI ? 'text-indigo-500' : 'text-emerald-500'}`}>
          {isAI ? 'AI' : 'Siz'}
        </p>

        {/* Main bubble */}
        <div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
          isAI
            ? 'rounded-tl-sm bg-white border border-slate-200 shadow-sm text-slate-800'
            : 'rounded-tr-sm bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
        }`}>
          <p className="whitespace-pre-wrap">{msg.text}</p>
        </div>

        {/* AI controls */}
        {isAI && (
          <button onClick={() => onPlay(msg.text)}
            className={`flex items-center gap-1 text-[11px] transition ${
              isSpeaking ? 'text-indigo-600 font-semibold' : 'text-slate-400 hover:text-indigo-500'
            }`}>
            {isSpeaking ? <VolumeX size={11} /> : <Volume2 size={11} />}
            {isSpeaking ? 'To\'xtatish' : 'Tinglash'}
          </button>
        )}

        {/* Inline grammar errors */}
        {!isAI && msg.errors?.length > 0 && (
          <div className="space-y-1">
            {msg.errors.slice(0, 2).map((err, i) => (
              <div key={i} className="flex items-start gap-1.5 rounded-xl border border-red-100 bg-red-50 px-2.5 py-1.5 text-xs">
                <AlertCircle size={10} className="mt-0.5 shrink-0 text-red-400" />
                <span className="text-red-700">
                  <strong>"{err.original}"</strong> → {err.fix ? <><strong className="text-emerald-700">"{err.fix}"</strong></> : err.msg}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Vocab hints */}
        {!isAI && msg.vocab?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {msg.vocab.slice(0, 2).map((v) => (
              <span key={v.used} className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
                💡 {v.used} → <strong>{v.better.split(' / ')[0]}</strong>
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
function SpeakingPracticePage() {
  const navigate   = useNavigate()
  const voicesData = useVoices()

  // Voice settings — store NAME (string), not object
  const [voiceGender,    setVoiceGender]    = useState('female')
  const [selectedVoiceName, setVoiceName]  = useState(null)
  const [speechRate,     setSpeechRate]     = useState(0.88)

  // Session
  const [phase,         setPhase]         = useState('setup')
  const [messages,      setMessages]      = useState([])
  const [inputText,     setInputText]     = useState('')
  const [isAITyping,    setIsAITyping]    = useState(false)
  const [isSpeakingId,  setSpeakingId]    = useState(null)
  const [elapsedSec,    setElapsedSec]    = useState(0)
  const [questionCount, setQCount]        = useState(0)
  const [sessionKey,    setSessionKey]    = useState(0)

  // Setup options
  const [aiPersona,  setAiPersona]  = useState('examiner')
  const [startTopic, setStartTopic] = useState('free')

  const bottomRef   = useRef(null)
  const textareaRef = useRef(null)
  const timerRef    = useRef(null)

  const { transcript, interim, listening, supported, start: startRec, stop: stopRec, clear: clearRec } = useSpeechRec()

  // Auto-select first available voice when voices load
  useEffect(() => {
    if (selectedVoiceName) return
    const list = voiceGender === 'female' ? voicesData.female : voicesData.male
    const all  = voicesData.all
    const pick = list[0] || all[0]
    if (pick) setVoiceName(pick.name)
  }, [voicesData, voiceGender, selectedVoiceName])

  // When gender changes, reset to first voice of new gender
  function handleGenderChange(g) {
    setVoiceGender(g)
    setVoiceName(null)    // will auto-pick on next render
  }

  // Get current voice NAME (always fresh from TTS engine)
  function getVoiceName() {
    if (selectedVoiceName && TTS.findVoice(selectedVoiceName)) return selectedVoiceName
    const list = voiceGender === 'female' ? voicesData.female : voicesData.male
    return list[0]?.name || voicesData.all[0]?.name || null
  }

  // Sync speech transcript → input
  useEffect(() => {
    if (transcript) setInputText(transcript)
  }, [transcript])

  // Scroll to bottom
  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
  }, [messages, isAITyping])

  // Timer
  useEffect(() => {
    if (phase !== 'chat') return
    timerRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  function playAI(text, msgId) {
    if (isSpeakingId === msgId) { TTS.stop(); setSpeakingId(null); return }
    setSpeakingId(msgId)
    TTS.speak(text, getVoiceName(), speechRate, null, () => setSpeakingId(null))
  }

  function startSession() {
    const persona  = AI_PERSONALITIES[aiPersona]
    const topicMsg = startTopic !== 'free' && TOPIC_STARTERS[startTopic]
      ? TOPIC_STARTERS[startTopic]
      : persona.greeting

    const greeting = { id: 'ai-0', role: 'ai', text: topicMsg }
    setMessages([greeting])
    setPhase('chat')
    setElapsedSec(0)
    setQCount(0)
    setSpeakingId('ai-0')

    // Speak after short delay (voices must be ready)
    setTimeout(() => {
      TTS.speak(topicMsg, getVoiceName(), speechRate, null, () => setSpeakingId(null))
    }, 300)
  }

  function sendMessage() {
    const text = inputText.trim()
    if (!text || isAITyping) return

    TTS.stop(); setSpeakingId(null)
    if (listening) stopRec()

    const errors = analyseGrammar(text)
    const vocab  = analyseVocabulary(text)

    const userMsg = { id: `u-${Date.now()}`, role: 'user', text, errors, vocab }
    setMessages((prev) => [...prev, userMsg])
    setInputText(''); clearRec()
    setIsAITyping(true)

    const delay = 800 + Math.min(text.length * 10, 1600)
    setTimeout(() => {
      const aiText = generateAIReply(text, messages, aiPersona, questionCount)
      const aiId   = `ai-${Date.now()}`
      setMessages((prev) => [...prev, { id: aiId, role: 'ai', text: aiText }])
      setQCount((q) => q + 1)
      setIsAITyping(false)
      setSpeakingId(aiId)
      TTS.speak(aiText, getVoiceName(), speechRate, null, () => setSpeakingId(null))
    }, delay)
  }

  function endSession() {
    TTS.stop(); setSpeakingId(null)
    if (listening) stopRec()
    clearInterval(timerRef.current)
    setPhase('report')
  }

  function restart() {
    TTS.stop(); setSpeakingId(null)
    setMessages([]); setInputText(''); clearRec()
    setElapsedSec(0); setQCount(0)
    setPhase('setup')
    setSessionKey((k) => k + 1)
  }

  const elapsed = `${String(Math.floor(elapsedSec / 60)).padStart(2, '0')}:${String(elapsedSec % 60).padStart(2, '0')}`
  const userMsgCount = messages.filter((m) => m.role === 'user').length

  return (
    <div className="min-h-screen bg-slate-50">
      {/* TOP BAR */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <button
            onClick={() => { stopSpeaking(); phase === 'chat' ? endSession() : phase === 'report' ? restart() : navigate(-1) }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 shrink-0">
            <ArrowLeft size={15} />
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900">AI Speaking Practice</p>
            <p className="text-[11px] text-slate-400">
              {phase === 'setup'  ? 'Sozlamalar'  :
               phase === 'chat'   ? `${elapsed} · ${userMsgCount} javob` :
               'Sessiya natijasi'}
            </p>
          </div>

          {phase === 'chat' && (
            <>
              <VoiceSelector
                selectedName={selectedVoiceName}
                onSelect={(name) => setVoiceName(name)}
                gender={voiceGender}
                onGenderChange={handleGenderChange} />
              <button onClick={endSession}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition">
                <BarChart3 size={12} />Baholash
              </button>
            </>
          )}

          {phase === 'setup' && (
            <div className="flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              <Mic size={11} />AI Speaking
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-5">
        <AnimatePresence mode="wait">

          {/* ── SETUP ── */}
          {phase === 'setup' && (
            <motion.div key={`setup-${sessionKey}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-5">

              {/* Hero */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-700 to-purple-800 p-7 text-white shadow-xl">
                <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
                <div className="absolute bottom-0 left-32 h-24 w-24 rounded-full bg-violet-500/30" />
                <div className="relative">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    <Sparkles size={11} />AI Conversation Engine
                  </span>
                  <h1 className="mt-3 text-3xl font-black leading-tight">
                    AI bilan haqiqiy<br />
                    <span className="text-yellow-300">speaking suhbati</span>
                  </h1>
                  <p className="mt-2 max-w-lg text-sm text-indigo-200">
                    AI examiner savol beradi, siz javob berasiz. Real-time grammar/vocabulary tahlil.
                    Sessiya oxirida batafsil band score va maslahat olasiz.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {['🎤 Mikrofon yoki matn', '📊 Instant grammar check', '💡 Vocab suggestions', '🏆 Band score report'].map((f) => (
                      <span key={f} className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">{f}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* AI Persona */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 font-bold text-slate-900 flex items-center gap-2">
                    <User size={16} className="text-indigo-500" />AI xarakter
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(AI_PERSONALITIES).map(([key, p]) => (
                      <button key={key} onClick={() => setAiPersona(key)}
                        className={`flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left transition ${
                          aiPersona === key ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 hover:border-slate-200'
                        }`}>
                        <span className="text-xl">{key === 'examiner' ? '👔' : key === 'friend' ? '😊' : '📚'}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{p.name}</p>
                          <p className="text-xs text-slate-500">
                            {key === 'examiner' ? 'Professional IELTS format' :
                             key === 'friend' ? 'Erkin, do\'stona suhbat' : 'O\'rgatuvchi uslubda'}
                          </p>
                        </div>
                        {aiPersona === key && <CheckCircle2 size={16} className="ml-auto shrink-0 text-indigo-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic + Voice */}
                <div className="space-y-4">
                  {/* Topic */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-3 font-bold text-slate-900 flex items-center gap-2">
                      <Brain size={16} className="text-amber-500" />Suhbat mavzusi
                    </h3>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'free',        label: '🆓 Erkin suhbat' },
                        { id: 'travel',      label: '✈️ Sayohat' },
                        { id: 'technology',  label: '💻 Texnologiya' },
                        { id: 'education',   label: '🎓 Ta\'lim' },
                        { id: 'work',        label: '💼 Ish/Kasb' },
                        { id: 'food',        label: '🍜 Oziq-ovqat' },
                        { id: 'environment', label: '🌿 Ekologiya' },
                        { id: 'culture',     label: '🎭 Madaniyat' },
                      ].map(({ id, label }) => (
                        <button key={id} onClick={() => setStartTopic(id)}
                          className={`rounded-xl border-2 px-2.5 py-2 text-xs font-medium text-left transition ${
                            startTopic === id ? 'border-amber-400 bg-amber-50 text-amber-800' : 'border-slate-100 text-slate-600 hover:border-slate-200'
                          }`}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Voice */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-3 font-bold text-slate-900 flex items-center gap-2">
                      <Volume2 size={16} className="text-sky-500" />AI ovozi
                    </h3>
                    {/* Gender tabs */}
                    <div className="flex gap-2 mb-3">
                      {['female', 'male'].map((g) => (
                        <button key={g} onClick={() => handleGenderChange(g)}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition ${
                            voiceGender === g
                              ? g === 'female' ? 'bg-pink-100 text-pink-700 border-2 border-pink-300' : 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                              : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}>
                          {g === 'female' ? '👩 Ayol' : '👨 Erkak'}
                        </button>
                      ))}
                    </div>

                    {/* Voice list for setup page */}
                    {(() => {
                      const list = voiceGender === 'female' ? voicesData.female : voicesData.male
                      return list.length > 0 ? (
                        <div className="mb-3 max-h-32 overflow-y-auto space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-1.5">
                          {list.map((v) => (
                            <div key={v.name}
                              onClick={() => setVoiceName(v.name)}
                              className={`flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 transition ${
                                selectedVoiceName === v.name ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 text-slate-700'
                              }`}>
                              <div className={`h-3 w-3 rounded-full border-2 shrink-0 ${selectedVoiceName === v.name ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`} />
                              <span className="flex-1 text-xs font-medium truncate">{v.name}</span>
                              <button onClick={(e) => { e.stopPropagation(); TTS.speak('Hello! This is a voice test.', v.name, speechRate) }}
                                className="shrink-0 text-slate-400 hover:text-indigo-500 transition">
                                <Volume2 size={11} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                          ⏳ Ovozlar yuklanmoqda... Biroz kuting yoki sahifani yangilang.
                        </p>
                      )
                    })()}

                    {/* Speed */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Gapirish tezligi</span>
                        <span className="font-semibold">{speechRate < 0.8 ? 'Sekin' : speechRate < 1 ? 'Normal' : 'Tez'}</span>
                      </div>
                      <input type="range" min="0.6" max="1.2" step="0.1" value={speechRate}
                        onChange={(e) => setSpeechRate(Number(e.target.value))}
                        className="w-full accent-indigo-600" />
                    </div>

                    {/* Preview */}
                    <button onClick={() => TTS.speak("Hello! I'm your AI speaking partner. Let's have a great conversation today!", getVoiceName(), speechRate)}
                      className="mt-3 flex items-center gap-2 rounded-xl bg-indigo-50 border border-indigo-200 px-3 py-2.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition w-full justify-center">
                      <Volume2 size={13} />🔊 Ovozni sinab ko'rish
                    </button>
                  </div>
                </div>
              </div>

              {/* Start button */}
              <button onClick={startSession}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 py-5 text-base font-black text-white shadow-xl transition hover:scale-[1.02] hover:shadow-2xl">
                <Mic size={20} />
                Suhbatni boshlash
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* ── CHAT ── */}
          {phase === 'chat' && (
            <motion.div key="chat"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col" style={{ height: 'calc(100vh - 130px)' }}>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 space-y-4 shadow-sm mb-3">
                {messages.map((msg) => (
                  <ChatMsg key={msg.id} msg={msg}
                    onPlay={(text) => playAI(text, msg.id)}
                    isSpeaking={isSpeakingId === msg.id} />
                ))}

                {/* AI typing */}
                {isAITyping && (
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white">🤖</div>
                    <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        {[0,1,2].map((i) => (
                          <motion.div key={i} className="h-2 w-2 rounded-full bg-indigo-400"
                            animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Interim */}
                {listening && interim && (
                  <div className="flex flex-row-reverse gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white">👤</div>
                    <div className="max-w-[75%] rounded-2xl rounded-tr-sm border-2 border-dashed border-emerald-300 bg-emerald-50 px-4 py-3 text-sm italic text-emerald-700">
                      {interim}...
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                {!supported && (
                  <p className="mb-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    ⚠️ Mikrofon qo'llab-quvvatlanmaydi. Klaviatura bilan yozing.
                  </p>
                )}

                <div className="flex items-end gap-2">
                  {supported && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={listening ? stopRec : startRec}
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                        listening
                          ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse'
                          : 'border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                      }`}>
                      {listening ? <MicOff size={18} /> : <Mic size={18} />}
                    </motion.button>
                  )}

                  <div className="relative flex-1">
                    <textarea ref={textareaRef} value={inputText}
                      onChange={(e) => { setInputText(e.target.value) }}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                      placeholder={listening ? '🎙️ Gapiring — matn avtomatik kiriladi...' : 'Javobingizni yozing yoki mikrofon bilan gapiring...'}
                      rows={2}
                      className={`w-full resize-none rounded-xl border-2 bg-slate-50 px-4 py-2.5 text-sm outline-none transition ${
                        listening ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-indigo-400 focus:bg-white'
                      }`}
                      style={{ maxHeight: 100 }} />
                  </div>

                  <motion.button whileTap={{ scale: 0.9 }}
                    onClick={sendMessage}
                    disabled={!inputText.trim() || isAITyping}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md transition hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed">
                    <Send size={16} />
                  </motion.button>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Enter — yuborish · Shift+Enter — yangi qator</span>
                  {userMsgCount >= 3 && (
                    <button onClick={endSession}
                      className="flex items-center gap-1 text-indigo-500 font-bold hover:underline">
                      <ThumbsUp size={10} />Baholash →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── REPORT ── */}
          {phase === 'report' && (
            <motion.div key="report"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <ScoreReport
                messages={messages}
                onRestart={restart}
                voiceObj={{ selectedName: getVoiceName(), rate: speechRate }} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

export default SpeakingPracticePage
