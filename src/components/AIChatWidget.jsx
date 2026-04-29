import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, MessageCircle, Send, Sparkles, Volume2, X } from 'lucide-react'

const QUICK_QUESTIONS = [
  'IELTS uchun qanday tayyorlanaman?',
  'Band 7 olish uchun nima qilish kerak?',
  '"Have been" va "has been" farqi nima?',
  'Speaking da filler words nima uchun kerak?',
  'Har kuni nechta so\'z o\'rganish kerak?',
  'IELTS Writing Task 2 da nechta paragraph?',
  'Present Perfect qachon ishlatiladi?',
  'Conditional sentences necha xil?',
]

const AI_RESPONSES = {
  default: [
    "Yaxshi savol! Bu borada quyidagilarni aytishim mumkin: har kuni 20-30 daqiqa muntazam mashq qilish eng muhim. Grammatika, vocabulary va speaking'ni parallel ravishda rivojlantiring.",
    "Bu juda foydali savol. Lingify platformasida buni maxsus darslarda o'rganishingiz mumkin. Online Lessons bo'limiga o'ting.",
    "Ingliz tilini o'rganishda sabr va muntazamlik muhim. Kichik qadamlar bilan boshlang — har kuni 10 ta so'z, 1 ta dars va 15 daqiqa speaking mashqi yetarli.",
  ],
  ielts: "IELTS uchun tayyorlov bosqichlari:\n\n1. **Placement test** orqali darajangizni aniqlang\n2. **B1-B2** darajasiga yeting (kamida 6 oy)\n3. **Cambridge IELTS** kitoblaridan mock test o'ting\n4. **Writing** uchun model answers o'rganing\n5. **Speaking** uchun AI bilan har kuni 15 daqiqa mashq qiling\n\nLingify'da Cambridge IELTS 11 mock testlari mavjud!",
  band: "Band 7+ olish uchun:\n\n**Listening:** 30/40+ to'g'ri javob\n**Reading:** 30/40+ to'g'ri javob\n**Writing:** Coherent, C1 darajadagi til\n**Speaking:** Fluent, varied vocabulary\n\nAsosiy maslahat: har kuni 1 soat inglizcha matn o'qing va 20 daqiqa AI bilan gaplashing.",
  grammar: "Grammatika maslahlari:\n\n**Present Perfect** — 'have/has + V3' — o'tmishdagi tajriba uchun\n**Past Simple** — aniq vaqt ko'rsatilganda (yesterday, in 2020)\n**Conditional** — 'If I were rich, I would...' — xayoliy holat\n\nLingify'dagi Grammar lessons bo'limida barchasi bor!",
  speaking: "Speaking rivojlantirish:\n\n1. Filler words ishlating: 'Well...', 'That's a good question...'\n2. Complex sentences tuzing: 'Although/However/Nevertheless'\n3. Specific examples keltiring: 'For instance...'\n4. AI Speaking Practice'da har kuni 15 daqiqa mashq qiling\n5. Partner bilan haftada 3 marta speaking session o'tkazing",
  vocab: "So'z boyligi uchun:\n\n**Yangi boshlovchilar:** kuniga 10 ta so'z\n**O'rtacha:** kuniga 15-20 ta so'z  \n**Ilg'or:** kuniga 20-30 ta so'z\n\nFlashcard (SM-2 algoritm) bilan takrorlash eng samarali usul. Lingify'da 500+ so'z mavjud!",
}

function getAIResponse(question) {
  const q = question.toLowerCase()
  if (q.includes('ielts')) return AI_RESPONSES.ielts
  if (q.includes('band') || q.includes('7')) return AI_RESPONSES.band
  if (q.includes('grammar') || q.includes('grammatika') || q.includes('present') || q.includes('conditional') || q.includes('perfect')) return AI_RESPONSES.grammar
  if (q.includes('speaking') || q.includes('gapir') || q.includes('filler')) return AI_RESPONSES.speaking
  if (q.includes('so\'z') || q.includes('vocab') || q.includes('word')) return AI_RESPONSES.vocab
  return AI_RESPONSES.default[Math.floor(Math.random() * AI_RESPONSES.default.length)]
}

function speak(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const clean = text.replace(/\*\*/g, '').replace(/\n/g, '. ').slice(0, 300)
  const u = new SpeechSynthesisUtterance(clean)
  u.lang = 'en-US'; u.rate = 0.88
  window.speechSynthesis.speak(u)
}

export function AIChatWidget() {
  const [open,       setOpen]     = useState(false)
  const [messages,   setMessages] = useState([
    { id: 0, role: 'ai', text: 'Salom! 👋 Men Lingify AI yordamchisiman. Ingliz tili haqida istalgan savolingizni bering!' },
  ])
  const [input,      setInput]    = useState('')
  const [loading,    setLoading]  = useState(false)
  const [unread,     setUnread]   = useState(0)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) setUnread(0)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage(text) {
    const msg = (text || input).trim()
    if (!msg || loading) return
    const userMsg = { id: Date.now(), role: 'user', text: msg }
    setMessages((p) => [...p, userMsg])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      const aiText = getAIResponse(msg)
      setMessages((p) => [...p, { id: Date.now()+1, role: 'ai', text: aiText }])
      setLoading(false)
      if (!open) setUnread((n) => n+1)
    }, 800 + Math.random() * 600)
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-2xl xl:bottom-6"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}}><ChevronDown size={22} /></motion.div>
            : <motion.div key="m" initial={{rotate:90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:-90,opacity:0}}><MessageCircle size={22} /></motion.div>}
        </AnimatePresence>
        {unread > 0 && !open && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
            {unread}
          </span>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-44 right-5 z-50 flex w-80 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl xl:bottom-24"
            style={{ height: 460 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-700 px-4 py-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                <Sparkles size={17} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Lingify AI</p>
                <p className="text-[11px] text-indigo-200">Ingliz tili bo'yicha yordamchi</p>
              </div>
              <button onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-xl text-white/70 hover:bg-white/15 transition">
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/30">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${m.role === 'ai' ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white' : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'}`}>
                    {m.role === 'ai' ? '🤖' : '👤'}
                  </div>
                  <div className={`max-w-[82%] space-y-1`}>
                    <div className={`rounded-2xl px-3 py-2.5 text-xs leading-5 ${m.role === 'ai' ? 'rounded-tl-sm bg-white border border-slate-200 text-slate-800' : 'rounded-tr-sm bg-gradient-to-br from-indigo-500 to-violet-600 text-white'}`}>
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    </div>
                    {m.role === 'ai' && (
                      <button onClick={() => speak(m.text)} className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-indigo-500 transition">
                        <Volume2 size={10} />Tinglash
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white">🤖</div>
                  <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3 py-2.5">
                    <div className="flex gap-1">
                      {[0,1,2].map((i) => (
                        <motion.div key={i} className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                          animate={{ y:[0,-4,0] }} transition={{ repeat:Infinity, duration:0.6, delay:i*0.15 }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick questions */}
            <div className="border-t border-slate-100 px-3 py-2">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {QUICK_QUESTIONS.slice(0, 4).map((q) => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-700 transition shrink-0">
                    {q.slice(0, 25)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-slate-100 bg-white p-3">
              <div className="flex items-center gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Savolingizni yozing..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-indigo-400 focus:bg-white" />
                <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-700 transition">
                  <Send size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIChatWidget
