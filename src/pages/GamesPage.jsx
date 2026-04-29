import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft, CheckCircle2, ChevronRight, Clock,
  Flame, Gamepad2, RefreshCw, Star, Trophy,
  Volume2, Zap, X, BookOpen, Shuffle, Timer,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
//  UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }
function speak(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'; u.rate = 0.85
  window.speechSynthesis.speak(u)
}

// ─────────────────────────────────────────────────────────────────────────────
//  SHARED DATA
// ─────────────────────────────────────────────────────────────────────────────
const WORD_PAIRS = [
  { en: 'Comprehensive', uz: 'Keng qamrovli' }, { en: 'Meticulous', uz: 'Puxta, diqqatli' },
  { en: 'Ambiguous', uz: 'Noaniq' },            { en: 'Collaborate', uz: 'Hamkorlik qilmoq' },
  { en: 'Eloquent', uz: 'Notiq' },              { en: 'Innovative', uz: 'Yangilikchi' },
  { en: 'Persevere', uz: 'Sabot bilan davom etmoq' }, { en: 'Transparent', uz: 'Shaffof' },
  { en: 'Abundant', uz: 'Mo\'l' },              { en: 'Diligent', uz: 'Mehnatsevar' },
  { en: 'Genuine', uz: 'Haqiqiy' },             { en: 'Enormous', uz: 'Ulkan' },
  { en: 'Sufficient', uz: 'Yetarli' },          { en: 'Consequence', uz: 'Oqibat' },
  { en: 'Significant', uz: 'Muhim' },           { en: 'Fundamental', uz: 'Asosiy' },
  { en: 'Accelerate', uz: 'Tezlashtirmoq' },    { en: 'Sophisticated', uz: 'Murakkab' },
  { en: 'Inevitable', uz: 'Muqarrar' },         { en: 'Remarkable', uz: 'Ajoyib' },
]

const SENTENCES = [
  { words: ['I','usually','wake','up','at','seven'], correct: 'I usually wake up at seven' },
  { words: ['She','has','been','studying','English','for','two','years'], correct: 'She has been studying English for two years' },
  { words: ['The','report','was','written','by','the','manager'], correct: 'The report was written by the manager' },
  { words: ['If','I','had','more','time','I','would','travel'], correct: 'If I had more time I would travel' },
  { words: ['They','are','going','to','watch','a','movie','tonight'], correct: 'They are going to watch a movie tonight' },
  { words: ['She','didn\'t','know','the','answer','to','the','question'], correct: 'She didn\'t know the answer to the question' },
  { words: ['The','students','who','study','hard','will','pass'], correct: 'The students who study hard will pass' },
  { words: ['He','speaks','English','as','well','as','a','native'], correct: 'He speaks English as well as a native' },
]

const GRAMMAR_QUESTIONS = [
  { q: 'She ___ to school every day.', opts: ['go','goes','going','gone'], ans: 1, exp: 'She (3rd person) → "goes"' },
  { q: 'I ___ English for 3 years.', opts: ['study','studied','have studied','studying'], ans: 2, exp: '"for 3 years" → Present Perfect' },
  { q: 'The book ___ on the table.', opts: ['is','are','be','been'], ans: 0, exp: 'Yakka narsa → "is"' },
  { q: 'He ___ read this book yet.', opts: ['didn\'t','hasn\'t','don\'t','wasn\'t'], ans: 1, exp: '"yet" → Present Perfect: "hasn\'t"' },
  { q: 'If I ___ rich, I would travel.', opts: ['am','was','were','will be'], ans: 2, exp: '2nd Conditional: "If I were..."' },
  { q: 'She ___ born in 1998.', opts: ['is','was','were','been'], ans: 1, exp: 'O\'tgan zamon: "was born"' },
  { q: '___ you ever been to London?', opts: ['Did','Have','Do','Were'], ans: 1, exp: 'Tajriba: "Have you ever been...?"' },
  { q: 'I don\'t have ___ money.', opts: ['some','any','many','much'], ans: 3, exp: 'Sanalmaydigan → "much money"' },
  { q: 'She is ___ engineer.', opts: ['a','an','the','—'], ans: 1, exp: '"engineer" unli → "an"' },
  { q: 'They ___ football right now.', opts: ['play','plays','are playing','played'], ans: 2, exp: '"right now" → Present Continuous' },
  { q: 'He works ___ a doctor.', opts: ['like','as','for','at'], ans: 1, exp: 'Kasb preposition: "works as"' },
  { q: 'The news ___ surprising.', opts: ['are','were','is','be'], ans: 2, exp: '"news" doim yakka → "is"' },
]

const SPELLING_WORDS = [
  { word: 'beautiful', hint: 'Chiroyli' }, { word: 'necessary', hint: 'Zarur' },
  { word: 'occurrence', hint: 'Hodisa' }, { word: 'separately', hint: 'Alohida' },
  { word: 'millennium', hint: 'Ming yillik' }, { word: 'recommend', hint: 'Tavsiya qilmoq' },
  { word: 'definitely', hint: 'Albatta' }, { word: 'successful', hint: 'Muvaffaqiyatli' },
  { word: 'environment', hint: 'Atrof-muhit' }, { word: 'government', hint: 'Hukumat' },
  { word: 'approximately', hint: 'Taxminan' }, { word: 'immediately', hint: 'Darhol' },
  { word: 'achievement', hint: 'Yutuq' }, { word: 'professional', hint: 'Professional' },
  { word: 'comfortable', hint: 'Qulay' },
]

const VOCAB_RACE_WORDS = [
  { word: 'cat', uz: 'mushuk' }, { word: 'house', uz: 'uy' }, { word: 'apple', uz: 'olma' },
  { word: 'water', uz: 'suv' }, { word: 'beautiful', uz: 'chiroyli' }, { word: 'run', uz: 'yugurmoq' },
  { word: 'book', uz: 'kitob' }, { word: 'study', uz: 'o\'qimoq' }, { word: 'friend', uz: 'do\'st' },
  { word: 'happy', uz: 'xursand' }, { word: 'big', uz: 'katta' }, { word: 'fast', uz: 'tez' },
  { word: 'important', uz: 'muhim' }, { word: 'difficult', uz: 'qiyin' }, { word: 'learn', uz: 'o\'rganmoq' },
]

// ─────────────────────────────────────────────────────────────────────────────
//  HANGMAN
// ─────────────────────────────────────────────────────────────────────────────
const HANGMAN_WORDS = [
  { word: 'FLUENT', hint: 'Ravon inglizcha gaplasha oladigan' },
  { word: 'GRAMMAR', hint: 'Til qoidalari' },
  { word: 'VOCABULARY', hint: 'So\'z boyligi' },
  { word: 'PRONUNCIATION', hint: 'So\'zlarni to\'g\'ri talaffuz qilish' },
  { word: 'SENTENCE', hint: 'To\'liq fikrni ifodalovchi so\'zlar guruhi' },
  { word: 'ADJECTIVE', hint: 'Sifat so\'z turkumi' },
  { word: 'SYNONYM', hint: 'Bir xil ma\'noli so\'z' },
  { word: 'PREPOSITION', hint: 'Ko\'makchi (in, on, at...)' },
  { word: 'CAMBRIDGE', hint: 'Mashhur ingliz universiteti' },
  { word: 'ENGLISH', hint: 'Dunyo tili' },
]

function HangmanGame() {
  const { word, hint } = HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)]
  const [currentWord] = useState(word)
  const [currentHint] = useState(hint)
  const [guessed, setGuessed] = useState(new Set())
  const [wrong, setWrong] = useState(0)
  const MAX_WRONG = 6

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const won = currentWord.split('').every((l) => guessed.has(l))
  const lost = wrong >= MAX_WRONG

  function guess(l) {
    if (guessed.has(l) || won || lost) return
    const next = new Set(guessed)
    next.add(l)
    setGuessed(next)
    if (!currentWord.includes(l)) setWrong((w) => w + 1)
  }

  function restart() { setGuessed(new Set()); setWrong(0) }

  const HangmanSVG = () => (
    <svg viewBox="0 0 200 220" className="w-44 h-44" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <line x1="20" y1="210" x2="180" y2="210" className="text-slate-400" />
      <line x1="60" y1="210" x2="60" y2="20" className="text-slate-400" />
      <line x1="60" y1="20" x2="130" y2="20" className="text-slate-400" />
      <line x1="130" y1="20" x2="130" y2="45" className="text-slate-400" />
      {wrong > 0 && <circle cx="130" cy="60" r="15" className="text-slate-700" />}
      {wrong > 1 && <line x1="130" y1="75" x2="130" y2="130" className="text-slate-700" />}
      {wrong > 2 && <line x1="130" y1="90" x2="105" y2="115" className="text-slate-700" />}
      {wrong > 3 && <line x1="130" y1="90" x2="155" y2="115" className="text-slate-700" />}
      {wrong > 4 && <line x1="130" y1="130" x2="105" y2="160" className="text-slate-700" />}
      {wrong > 5 && <line x1="130" y1="130" x2="155" y2="160" className="text-slate-700" />}
    </svg>
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Hangman 🎯</h2>
        <div className="flex gap-2">
          <span className={`text-sm font-bold ${wrong >= 4 ? 'text-red-500' : 'text-slate-500'}`}>{wrong}/{MAX_WRONG} xato</span>
          <button onClick={restart} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"><RefreshCw size={14} className="text-slate-500" /></button>
        </div>
      </div>

      <div className={`rounded-2xl p-4 text-center border-2 ${won ? 'border-emerald-300 bg-emerald-50' : lost ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}>
        <p className="text-xs text-slate-500 mb-2">💡 Maslahat: {currentHint}</p>
        <div className="flex justify-center mb-4"><HangmanSVG /></div>

        <div className="flex justify-center gap-3">
          {currentWord.split('').map((l, i) => (
            <div key={i} className={`flex h-10 w-8 items-center justify-center border-b-2 text-xl font-black transition ${guessed.has(l) ? 'border-indigo-500 text-indigo-700' : 'border-slate-400 text-transparent'}`}>
              {guessed.has(l) ? l : '_'}
            </div>
          ))}
        </div>

        {(won || lost) && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <p className={`text-lg font-black ${won ? 'text-emerald-700' : 'text-red-600'}`}>
              {won ? '🎉 Barakalla!' : `😢 So\'z: ${currentWord}`}
            </p>
            <button onClick={restart} className="mt-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white">Qayta</button>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-9 gap-1.5">
        {letters.map((l) => {
          const used = guessed.has(l)
          const correct = used && currentWord.includes(l)
          const incorrect = used && !currentWord.includes(l)
          return (
            <motion.button key={l} whileTap={{ scale: 0.9 }} onClick={() => guess(l)} disabled={used || won || lost}
              className={`rounded-lg py-2 text-xs font-black transition ${correct ? 'bg-emerald-500 text-white' : incorrect ? 'bg-red-200 text-red-400' : 'bg-slate-100 text-slate-700 hover:bg-indigo-100 hover:text-indigo-700'} disabled:cursor-not-allowed`}>
              {l}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  ANAGRAM
// ─────────────────────────────────────────────────────────────────────────────
const ANAGRAM_WORDS = [
  { word: 'LISTEN', hint: 'Tinglash (verb)' }, { word: 'SILENT', hint: 'Jim, sokin' },
  { word: 'HEART', hint: 'Yurak' }, { word: 'EARTH', hint: 'Yer sayyorasi' },
  { word: 'STUDY', hint: 'O\'qimoq' }, { word: 'DUSTY', hint: 'Changlik' },
  { word: 'TEACHER', hint: 'O\'qituvchi' }, { word: 'CHEATER', hint: 'Aldamchi' },
  { word: 'ENGLISH', hint: 'Til nomi' }, { word: 'GRAMMAR', hint: 'Til qoidalari' },
  { word: 'WORDS', hint: 'So\'zlar (plural)' }, { word: 'SWORD', hint: 'Qilich' },
]

function AnagramGame() {
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(0)
  const [scrambled, setScrambled] = useState('')
  const data = ANAGRAM_WORDS[idx]

  useEffect(() => {
    setScrambled(shuffle(data.word.split('')).join(''))
    setInput(''); setResult(null)
  }, [idx])

  function check() {
    const ok = input.trim().toUpperCase() === data.word
    setResult(ok ? 'correct' : 'wrong')
    if (ok) setScore((s) => s + 15)
  }
  function next() {
    setIdx((i) => (i + 1) % ANAGRAM_WORDS.length)
  }

  return (
    <div className="space-y-5 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Anagram 🔀</h2>
        <span className="flex items-center gap-1 text-sm font-bold text-indigo-700"><Zap size={13} />{score}</span>
      </div>
      <p className="text-xs text-slate-500">Aralashtirilgan harflardan to'g'ri so'z tuzing</p>

      <div className="rounded-3xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-6 text-center">
        <p className="text-xs text-violet-500 font-semibold mb-2">💡 {data.hint}</p>
        <div className="flex justify-center gap-2 my-4">
          {scrambled.split('').map((l, i) => (
            <motion.div key={i} initial={{ rotate: -10 + Math.random() * 20 }} animate={{ rotate: 0 }}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border-2 border-violet-300 text-lg font-black text-violet-800 shadow-sm">
              {l}
            </motion.div>
          ))}
        </div>
        <button onClick={() => setScrambled(shuffle(data.word.split('')).join(''))}
          className="text-xs text-violet-500 hover:underline flex items-center gap-1 mx-auto">
          <Shuffle size={11} />Aralashtirib ko'rish
        </button>
      </div>

      <input value={input} onChange={(e) => setInput(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === 'Enter' && check()}
        placeholder="Javobingizni yozing..."
        className={`w-full rounded-2xl border-2 px-5 py-3.5 text-lg font-black text-center uppercase tracking-widest outline-none transition ${result === 'correct' ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : result === 'wrong' ? 'border-red-400 bg-red-50 text-red-800' : 'border-slate-200 bg-white focus:border-violet-400'}`} />

      {result && (
        <p className={`text-center text-sm font-bold ${result === 'correct' ? 'text-emerald-700' : 'text-red-600'}`}>
          {result === 'correct' ? '✅ To\'g\'ri!' : `❌ To\'g\'ri javob: ${data.word}`}
        </p>
      )}
      <div className="flex gap-3">
        {!result
          ? <button onClick={check} disabled={!input.trim()} className="flex-1 rounded-2xl bg-violet-600 py-3 text-sm font-bold text-white disabled:opacity-40">Tekshirish</button>
          : <button onClick={next} className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white">Keyingi <ChevronRight size={15} /></button>
        }
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  WORD SNAKE
// ─────────────────────────────────────────────────────────────────────────────
const SNAKE_WORDS = ['apple','elephant','tiger','rabbit','time','energy','yellow','wonder','rain','name','mind','dog','great','table','engine','eagle','end','door','robot','test']

function WordSnakeGame() {
  const [chain, setChain] = useState(['apple'])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [running, setRunning] = useState(false)
  const timerRef = useRef(null)

  function startGame() {
    setChain(['apple']); setInput(''); setError(''); setScore(0); setTimeLeft(60); setRunning(true)
    timerRef.current = setInterval(() => setTimeLeft((t) => { if (t <= 1) { clearInterval(timerRef.current); setRunning(false); return 0 } return t - 1 }), 1000)
  }
  useEffect(() => () => clearInterval(timerRef.current), [])

  function submit() {
    const word = input.trim().toLowerCase()
    if (!word) return
    const last = chain[chain.length - 1]
    if (word[0] !== last[last.length - 1]) { setError(`So'z "${last[last.length - 1].toUpperCase()}" bilan boshlanishi kerak!`); return }
    if (chain.includes(word)) { setError('Bu so\'z allaqachon ishlatilgan!'); return }
    if (word.length < 3) { setError('Kamida 3 ta harf bo\'lishi kerak!'); return }
    setChain((c) => [...c, word])
    setScore((s) => s + word.length)
    setInput(''); setError('')
  }

  const lastWord = chain[chain.length - 1]
  const nextLetter = lastWord[lastWord.length - 1].toUpperCase()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Word Snake 🐍</h2>
        <div className="flex gap-3">
          {running && <span className={`font-black ${timeLeft <= 10 ? 'text-red-500' : 'text-slate-600'}`}>{timeLeft}s</span>}
          <span className="flex items-center gap-1 font-bold text-indigo-700"><Zap size={13} />{score}</span>
        </div>
      </div>

      {!running && timeLeft === 60 ? (
        <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-6 text-center">
          <p className="text-4xl mb-3">🐍</p>
          <p className="text-sm text-slate-600 mb-4">Oxirgi harfdan boshlanadigan so'z ayting. Zanjirni uzaytiring!</p>
          <div className="text-xs text-slate-500 space-y-1 mb-4">
            <p>🍎 apple → <strong>E</strong>lephant → <strong>T</strong>iger → ...</p>
          </div>
          <button onClick={startGame} className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-black text-white shadow-md">Boshlash!</button>
        </div>
      ) : !running && timeLeft === 0 ? (
        <div className="rounded-3xl bg-emerald-50 border-2 border-emerald-200 p-6 text-center">
          <p className="text-3xl mb-2">🏆</p>
          <p className="text-xl font-black text-emerald-800">Vaqt tugadi!</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{chain.length - 1} <span className="text-sm font-normal text-slate-500">so\'z</span></p>
          <button onClick={startGame} className="mt-4 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white">Qayta</button>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-emerald-700">Zanjir ({chain.length} ta so'z)</p>
              <p className="text-xs font-black text-emerald-600">Keyingi harf: <span className="text-lg">{nextLetter}</span></p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {chain.slice(-8).map((w, i) => (
                <span key={i} className="rounded-full bg-white border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800">{w}</span>
              ))}
            </div>
          </div>
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">{error}</p>}
          <div className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder={`"${nextLetter}" bilan boshlaning...`}
              className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-400" />
            <button onClick={submit} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white">→</button>
          </div>
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  FILL IN THE BLANK
// ─────────────────────────────────────────────────────────────────────────────
const FILL_BLANKS = [
  { before: 'She is', blank: 'listening', after: 'to music right now.', options: ['listened','listening','listens','listen'], hint: 'Hozir nima qilmoqda?' },
  { before: 'I have', blank: 'never', after: 'been to Japan.', options: ['ever','never','already','yet'], hint: 'Hayotingizda hech qachon' },
  { before: 'The report', blank: 'was written', after: 'by the manager.', options: ['was written','wrote','has written','writing'], hint: 'Passive voice — kim tomonidan yozilgan?' },
  { before: 'He is', blank: 'more intelligent', after: 'than his brother.', options: ['most intelligent','more intelligent','intelligenter','the most'], hint: 'Ikki kishini taqqoslash' },
  { before: 'If it rains, we', blank: 'will stay', after: 'at home.', options: ['would stay','will stay','stayed','stay'], hint: '1st Conditional — haqiqiy ehtimol' },
  { before: 'She', blank: 'has been working', after: 'here since 2020.', options: ['worked','is working','has been working','works'], hint: '"since" bilan qaysi zamon?' },
  { before: 'You', blank: 'must', after: 'wear a seatbelt in a car.', options: ['should','must','can','might'], hint: 'Qat\'iy majburiyat' },
  { before: 'There are', blank: 'a few', after: 'students in the class.', options: ['a few','a little','few','little'], hint: 'Sanaladigan narsa, oz miqdor' },
]

function FillBlankGame() {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const q = FILL_BLANKS[idx]

  function answer(opt) {
    if (selected) return
    setSelected(opt)
    if (opt === q.blank) setScore((s) => s + 10)
    setTimeout(() => {
      if (idx + 1 >= FILL_BLANKS.length) { setDone(true); return }
      setIdx((i) => i + 1); setSelected(null)
    }, 1200)
  }

  if (done) return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200 p-8 text-center">
      <p className="text-4xl mb-3">✏️</p>
      <h3 className="text-2xl font-black text-sky-800">Tayyor!</h3>
      <p className="text-3xl font-black text-slate-900 mt-2">{score} <span className="text-sm font-normal text-slate-500">ball</span></p>
      <button onClick={() => { setIdx(0); setScore(0); setDone(false); setSelected(null) }} className="mt-4 rounded-2xl bg-sky-600 px-6 py-3 text-sm font-bold text-white">Qayta</button>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Fill the Blank ✏️</h2>
        <div className="flex gap-3 text-sm">
          <span className="text-slate-400">{idx + 1}/{FILL_BLANKS.length}</span>
          <span className="flex items-center gap-1 font-bold text-sky-700"><Zap size={13} />{score}</span>
        </div>
      </div>
      <p className="text-xs text-slate-500">Bo'sh joyga mos so'zni tanlang</p>

      <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-5">
        <p className="text-xs font-semibold text-sky-600 mb-3">💡 {q.hint}</p>
        <p className="text-lg font-bold text-slate-900 leading-8 text-center">
          {q.before}{' '}
          <span className={`inline-block min-w-28 rounded-xl border-2 px-3 py-0.5 text-center transition-all ${selected ? (selected === q.blank ? 'border-emerald-400 bg-emerald-100 text-emerald-800' : 'border-red-400 bg-red-100 text-red-800') : 'border-dashed border-sky-400 bg-white text-sky-600'}`}>
            {selected || '___?___'}
          </span>{' '}
          {q.after}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {q.options.map((opt) => {
          const isSelected = selected === opt
          const isCorrect = opt === q.blank
          return (
            <motion.button key={opt} whileTap={{ scale: 0.97 }} onClick={() => answer(opt)}
              className={`rounded-2xl border-2 py-3 px-4 text-sm font-semibold transition ${selected ? (isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : isSelected ? 'border-red-400 bg-red-50 text-red-800' : 'border-slate-100 text-slate-400') : 'border-slate-200 bg-white text-slate-800 hover:border-sky-400 hover:bg-sky-50 cursor-pointer'}`}>
              {opt}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  IDIOM MATCH
// ─────────────────────────────────────────────────────────────────────────────
const IDIOMS = [
  { idiom: 'Break a leg!', meaning: 'Omad tilayman!' },
  { idiom: 'It\'s raining cats and dogs', meaning: 'Juda kuchli yomg\'ir yog\'moqda' },
  { idiom: 'Bite the bullet', meaning: 'Og\'ir vaziyatga chidamoq' },
  { idiom: 'Hit the nail on the head', meaning: 'To\'g\'ri gapirmoq / Aniq muammoni ko\'rsatmoq' },
  { idiom: 'Under the weather', meaning: 'Sal kasal yoki yomon his qilmoq' },
  { idiom: 'Piece of cake', meaning: 'Juda oson narsa' },
  { idiom: 'Let the cat out of the bag', meaning: 'Sirni fosh qilmoq' },
  { idiom: 'Kill two birds with one stone', meaning: 'Bir o\'qda ikki quyon urmoq' },
  { idiom: 'Cost an arm and a leg', meaning: 'Juda qimmat bo\'lmoq' },
  { idiom: 'Once in a blue moon', meaning: 'Juda kamdan-kam' },
]

function IdiomMatchGame() {
  const [pairs] = useState(() => shuffle(IDIOMS).slice(0, 6))
  const [selected, setSelected] = useState(null)
  const [matched, setMatched] = useState(new Set())
  const [wrong, setWrong] = useState([])
  const [score, setScore] = useState(0)

  const shuffledLeft  = pairs.map((p) => p.idiom)
  const shuffledRight = shuffle(pairs.map((p) => p.meaning))

  function selectLeft(idiom) {
    if (matched.has(idiom)) return
    setSelected(idiom)
  }
  function selectRight(meaning) {
    if (!selected || matched.has(selected)) return
    const pair = pairs.find((p) => p.idiom === selected)
    if (pair && pair.meaning === meaning) {
      setMatched((m) => new Set([...m, selected]))
      setScore((s) => s + 15)
      setSelected(null)
    } else {
      setWrong([selected, meaning])
      setTimeout(() => { setWrong([]); setSelected(null) }, 800)
    }
  }

  const done = matched.size === pairs.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Idiom Match 💬</h2>
        <span className="flex items-center gap-1 text-sm font-bold text-amber-700"><Zap size={13} />{score}</span>
      </div>
      <p className="text-xs text-slate-500">Idiomani uning ma'nosi bilan moslang</p>

      {done ? (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="rounded-3xl bg-amber-50 border-2 border-amber-300 p-8 text-center">
          <p className="text-4xl mb-2">💬</p>
          <h3 className="text-xl font-black text-amber-800">Ajoyib!</h3>
          <p className="text-sm text-amber-600">Jami ball: {score}</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 text-center">Idiom</p>
            {shuffledLeft.map((idiom) => {
              const isMatched  = matched.has(idiom)
              const isSelected = selected === idiom
              const isWrong    = wrong.includes(idiom)
              return (
                <button key={idiom} onClick={() => selectLeft(idiom)}
                  className={`w-full rounded-2xl border-2 px-3 py-3 text-left text-xs font-semibold leading-5 transition ${isMatched ? 'border-emerald-300 bg-emerald-50 text-emerald-700 cursor-default' : isWrong ? 'border-red-300 bg-red-50 text-red-700' : isSelected ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-md' : 'border-slate-200 bg-white text-slate-800 hover:border-amber-300 hover:bg-amber-50'}`}>
                  {isMatched ? '✅ ' : ''}{idiom}
                </button>
              )
            })}
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 text-center">Ma'nosi</p>
            {shuffledRight.map((meaning) => {
              const matchedIdiom = [...matched].find((id) => pairs.find((p) => p.idiom === id && p.meaning === meaning))
              const isMatched = !!matchedIdiom
              const isWrong   = wrong.includes(meaning)
              return (
                <button key={meaning} onClick={() => selectRight(meaning)}
                  className={`w-full rounded-2xl border-2 px-3 py-3 text-left text-xs font-semibold leading-5 transition ${isMatched ? 'border-emerald-300 bg-emerald-50 text-emerald-700 cursor-default' : isWrong ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50'}`}>
                  {meaning}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  PREPOSITION HUNT
// ─────────────────────────────────────────────────────────────────────────────
const PREP_QUESTIONS = [
  { before: 'She was born', after: 'Monday.', correct: 'on', opts: ['in','on','at','by'], hint: 'Kun bilan → "on"' },
  { before: 'I wake up', after: '7 o\'clock.', correct: 'at', opts: ['in','on','at','for'], hint: 'Aniq vaqt → "at"' },
  { before: 'He lives', after: 'Tashkent.', correct: 'in', opts: ['at','on','in','to'], hint: 'Shahar/mamlakat → "in"' },
  { before: 'The book is', after: 'the table.', correct: 'on', opts: ['in','on','at','under'], hint: 'Yuza ustida → "on"' },
  { before: 'I am interested', after: 'learning English.', correct: 'in', opts: ['at','in','for','about'], hint: '"interested in" — fixed phrase' },
  { before: 'She waited', after: 'two hours.', correct: 'for', opts: ['since','for','during','in'], hint: 'Davr uchun → "for"' },
  { before: 'I have lived here', after: '2020.', correct: 'since', opts: ['for','since','from','in'], hint: 'Boshlanish nuqtasi → "since"' },
  { before: 'The cat is hiding', after: 'the sofa.', correct: 'under', opts: ['on','in','under','behind'], hint: 'Narsa ostida' },
  { before: 'She is afraid', after: 'spiders.', correct: 'of', opts: ['from','of','about','with'], hint: '"afraid of" — fixed phrase' },
  { before: 'We go to school', after: 'foot.', correct: 'on', opts: ['by','with','on','in'], hint: 'Piyoda yurish → "on foot"' },
]

function PrepositionHuntGame() {
  const qs = shuffle(PREP_QUESTIONS)
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const q = qs[idx]

  function answer(opt) {
    if (selected) return
    setSelected(opt)
    if (opt === q.correct) setScore((s) => s + 10)
    setTimeout(() => {
      if (idx + 1 >= qs.length) { setDone(true); return }
      setIdx((i) => i + 1); setSelected(null)
    }, 1100)
  }

  if (done) return (
    <div className="rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 p-8 text-center">
      <p className="text-4xl mb-2">🎯</p>
      <h3 className="text-2xl font-black text-rose-800">Tayyor!</h3>
      <p className="text-3xl font-black text-slate-900 mt-1">{score} <span className="text-sm font-normal text-slate-500">ball</span></p>
      <button onClick={() => { setIdx(0); setScore(0); setDone(false); setSelected(null) }} className="mt-4 rounded-2xl bg-rose-600 px-6 py-3 text-sm font-bold text-white">Qayta</button>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Preposition Hunt 🎯</h2>
        <div className="flex gap-3 text-sm">
          <span className="text-slate-400">{idx + 1}/{qs.length}</span>
          <span className="flex items-center gap-1 font-bold text-rose-700"><Zap size={13} />{score}</span>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-5">
        <p className="text-xs font-semibold text-rose-500 mb-3">💡 {q.hint}</p>
        <p className="text-xl font-bold text-slate-900 text-center leading-9">
          {q.before}{' '}
          <span className={`inline-block min-w-16 rounded-xl border-2 px-2 py-0.5 text-center font-black transition ${selected ? (selected === q.correct ? 'border-emerald-400 bg-emerald-100 text-emerald-800' : 'border-red-400 bg-red-100 text-red-800') : 'border-dashed border-rose-400 bg-white text-rose-500'}`}>
            {selected || '___'}
          </span>{' '}
          {q.after}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {q.opts.map((opt) => {
          const isSelected = selected === opt
          const isCorrect  = opt === q.correct
          return (
            <motion.button key={opt} whileTap={{ scale: 0.95 }} onClick={() => answer(opt)}
              className={`rounded-2xl border-2 py-3 text-base font-black transition ${selected ? (isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : isSelected ? 'border-red-400 bg-red-50 text-red-800' : 'border-slate-100 text-slate-400') : 'border-slate-200 bg-white text-slate-800 hover:border-rose-400 hover:bg-rose-50 cursor-pointer'}`}>
              {opt}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  SYNONYM STORM
// ─────────────────────────────────────────────────────────────────────────────
const SYNONYM_DATA = [
  { word: 'Happy',     synonyms: ['Joyful', 'Pleased', 'Delighted', 'Content'],  wrong: ['Sad','Angry','Tired','Bored'] },
  { word: 'Big',       synonyms: ['Large', 'Huge', 'Enormous', 'Vast'],           wrong: ['Small','Tiny','Little','Narrow'] },
  { word: 'Fast',      synonyms: ['Quick', 'Rapid', 'Swift', 'Speedy'],           wrong: ['Slow','Sluggish','Lazy','Dull'] },
  { word: 'Smart',     synonyms: ['Clever', 'Intelligent', 'Brilliant', 'Wise'],  wrong: ['Foolish','Dumb','Silly','Stupid'] },
  { word: 'Beautiful', synonyms: ['Pretty', 'Gorgeous', 'Lovely', 'Stunning'],    wrong: ['Ugly','Plain','Dull','Awful'] },
  { word: 'Angry',     synonyms: ['Furious', 'Irritated', 'Upset', 'Mad'],        wrong: ['Happy','Calm','Pleased','Relaxed'] },
]

function SynonymStormGame() {
  const [idx, setIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [selected, setSelected] = useState([])
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(0)
  const timerRef = useRef(null)
  const data = SYNONYM_DATA[idx]

  const options = shuffle([...data.synonyms, ...data.wrong].slice(0, 6))

  useEffect(() => {
    setTimeLeft(15); setSelected([]); setResult(null)
    timerRef.current = setInterval(() => setTimeLeft((t) => { if (t <= 1) { clearInterval(timerRef.current); setResult('timeout'); return 0 } return t - 1 }), 1000)
    return () => clearInterval(timerRef.current)
  }, [idx])

  function toggle(opt) {
    if (result) return
    setSelected((s) => s.includes(opt) ? s.filter((x) => x !== opt) : [...s, opt])
  }
  function check() {
    clearInterval(timerRef.current)
    const correct = selected.filter((s) => data.synonyms.includes(s)).length
    const wrong   = selected.filter((s) => !data.synonyms.includes(s)).length
    const pts = correct * 5 - wrong * 2
    setScore((s) => s + Math.max(0, pts))
    setResult('done')
  }
  function next() {
    if (idx + 1 >= SYNONYM_DATA.length) setIdx(0)
    else setIdx((i) => i + 1)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Synonym Storm 🌪️</h2>
        <span className="flex items-center gap-1 text-sm font-bold text-violet-700"><Zap size={13} />{score}</span>
      </div>
      <p className="text-xs text-slate-500">Berilgan so'zning barcha sinonimlarini tanlang</p>

      <div className={`rounded-2xl border-2 p-4 flex items-center justify-between ${timeLeft <= 5 ? 'border-red-300 bg-red-50' : 'border-violet-200 bg-violet-50'}`}>
        <div>
          <p className="text-xs text-violet-500 mb-1">Sinonimlari qaysi?</p>
          <p className="text-3xl font-black text-violet-900">{data.word}</p>
        </div>
        <div className={`text-3xl font-black ${timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-violet-700'}`}>{timeLeft}s</div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {options.map((opt) => {
          const isSel = selected.includes(opt)
          const isSyn = data.synonyms.includes(opt)
          let cls = 'rounded-2xl border-2 py-3 px-4 text-sm font-semibold transition '
          if (result) cls += isSyn ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : isSel ? 'border-red-400 bg-red-50 text-red-700' : 'border-slate-100 text-slate-400'
          else cls += isSel ? 'border-violet-500 bg-violet-50 text-violet-800 shadow-md' : 'border-slate-200 bg-white text-slate-800 hover:border-violet-300 cursor-pointer'
          return <motion.button key={opt} whileTap={{ scale: 0.97 }} onClick={() => toggle(opt)} className={cls}>{opt}</motion.button>
        })}
      </div>

      {!result
        ? <button onClick={check} disabled={!selected.length} className="w-full rounded-2xl bg-violet-600 py-3 text-sm font-bold text-white disabled:opacity-40">Tekshirish</button>
        : <button onClick={next} className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white">Keyingi <ChevronRight size={15} /></button>
      }
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  CATEGORY SORT
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORIES_DATA = {
  'Hayvonlar': ['dog','elephant','tiger','rabbit','eagle','shark'],
  'Mevalar':   ['apple','mango','grape','lemon','cherry','peach'],
  'Ranglar':   ['crimson','azure','scarlet','violet','amber','beige'],
}

function CategorySortGame() {
  const categories = Object.keys(CATEGORIES_DATA)
  const allWords   = shuffle(Object.values(CATEGORIES_DATA).flat())
  const [sorted, setSorted] = useState({ [categories[0]]: [], [categories[1]]: [], [categories[2]]: [] })
  const [bank, setBank] = useState(allWords)
  const [active, setActive] = useState(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)

  function pickWord(w) {
    if (checked) return
    setActive(w)
  }
  function placeWord(cat) {
    if (!active || checked) return
    setSorted((s) => ({ ...s, [cat]: [...s[cat], active] }))
    setBank((b) => b.filter((w) => w !== active))
    setActive(null)
  }
  function check() {
    let pts = 0
    categories.forEach((cat) => {
      sorted[cat].forEach((w) => { if (CATEGORIES_DATA[cat].includes(w)) pts += 5 })
    })
    setScore(pts)
    setChecked(true)
  }
  function reset() { setSorted({ [categories[0]]: [], [categories[1]]: [], [categories[2]]: [] }); setBank(allWords); setActive(null); setChecked(false); setScore(0) }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Category Sort 📦</h2>
        <div className="flex gap-2">
          {checked && <span className="flex items-center gap-1 text-sm font-bold text-indigo-700"><Zap size={13} />{score}</span>}
          <button onClick={reset} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"><RefreshCw size={14} /></button>
        </div>
      </div>
      <p className="text-xs text-slate-500">So'zlarni to'g'ri kategoriyaga tashlang</p>

      {/* Word bank */}
      <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3 min-h-16 flex flex-wrap gap-2">
        {bank.length === 0 ? <p className="text-xs text-slate-400 italic w-full text-center py-2">Barcha so'zlar joylashtirildi ✓</p> : null}
        {bank.map((w) => (
          <motion.button key={w} whileTap={{ scale: 0.95 }} onClick={() => pickWord(w)}
            className={`rounded-xl border-2 px-3 py-1.5 text-sm font-semibold transition ${active === w ? 'border-indigo-500 bg-indigo-50 text-indigo-800 shadow-md' : 'border-slate-200 bg-white text-slate-800 hover:border-indigo-300'}`}>
            {w}
          </motion.button>
        ))}
      </div>

      {/* Category boxes */}
      <div className="grid grid-cols-3 gap-2">
        {categories.map((cat, ci) => {
          const colors = ['border-emerald-300 bg-emerald-50', 'border-amber-300 bg-amber-50', 'border-sky-300 bg-sky-50']
          const headers = ['border-emerald-400 bg-emerald-500', 'border-amber-400 bg-amber-500', 'border-sky-400 bg-sky-500']
          return (
            <div key={cat} className={`rounded-2xl border-2 overflow-hidden cursor-pointer ${colors[ci]} ${active ? 'ring-2 ring-indigo-400' : ''}`} onClick={() => placeWord(cat)}>
              <div className={`${headers[ci]} py-2 text-center text-xs font-black text-white`}>{cat}</div>
              <div className="p-2 min-h-20 flex flex-wrap gap-1.5 content-start">
                {sorted[cat].map((w) => {
                  const correct = checked && CATEGORIES_DATA[cat].includes(w)
                  const wrong   = checked && !CATEGORIES_DATA[cat].includes(w)
                  return (
                    <span key={w} className={`rounded-lg px-2 py-1 text-[11px] font-bold ${correct ? 'bg-emerald-500 text-white' : wrong ? 'bg-red-400 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}>
                      {w}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {bank.length === 0 && !checked && (
        <button onClick={check} className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-bold text-white">Tekshirish!</button>
      )}
      {checked && (
        <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-3 text-center">
          <p className="font-black text-indigo-800">Ball: {score}/{Object.values(CATEGORIES_DATA).flat().length * 5} ✓</p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  TENSE TRANSFORMER
// ─────────────────────────────────────────────────────────────────────────────
const TENSE_QS = [
  { from: 'Present Simple', to: 'Past Simple', sentence: 'She walks to school.', correct: 'She walked to school.', opts: ['She walked to school.','She walk to school.','She has walked to school.','She was walking to school.'] },
  { from: 'Present Simple', to: 'Future Simple', sentence: 'He eats breakfast.', correct: 'He will eat breakfast.', opts: ['He will eat breakfast.','He eats breakfast.','He was eating breakfast.','He ate breakfast.'] },
  { from: 'Past Simple', to: 'Present Perfect', sentence: 'She visited London.', correct: 'She has visited London.', opts: ['She has visited London.','She visits London.','She was visiting London.','She had visited London.'] },
  { from: 'Active', to: 'Passive', sentence: 'The chef cooked the food.', correct: 'The food was cooked by the chef.', opts: ['The food was cooked by the chef.','The food is cooked by the chef.','The chef was cooked the food.','The food cooked by the chef.'] },
  { from: 'Positive', to: 'Negative', sentence: 'He speaks English fluently.', correct: 'He doesn\'t speak English fluently.', opts: ['He doesn\'t speak English fluently.','He not speaks English fluently.','He didn\'t speak English fluently.','He isn\'t speak English fluently.'] },
  { from: 'Statement', to: 'Question', sentence: 'She has finished her work.', correct: 'Has she finished her work?', opts: ['Has she finished her work?','Did she finish her work?','She has finished her work?','Does she have finished her work?'] },
]

function TenseTransformerGame() {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const q = TENSE_QS[idx]

  function answer(opt) {
    if (selected) return
    setSelected(opt)
    if (opt === q.correct) setScore((s) => s + 12)
    setTimeout(() => {
      if (idx + 1 >= TENSE_QS.length) { setDone(true); return }
      setIdx((i) => i + 1); setSelected(null)
    }, 1200)
  }

  if (done) return (
    <div className="rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 p-8 text-center">
      <p className="text-4xl mb-2">⚡</p>
      <h3 className="text-2xl font-black text-orange-800">Tayyor!</h3>
      <p className="text-3xl font-black text-slate-900 mt-1">{score}</p>
      <button onClick={() => { setIdx(0); setScore(0); setDone(false); setSelected(null) }} className="mt-4 rounded-2xl bg-orange-600 px-6 py-3 text-sm font-bold text-white">Qayta</button>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Tense Transformer ⚡</h2>
        <div className="flex gap-3 text-sm">
          <span className="text-slate-400">{idx + 1}/{TENSE_QS.length}</span>
          <span className="flex items-center gap-1 font-bold text-orange-700"><Zap size={13} />{score}</span>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="rounded-full bg-orange-200 px-2.5 py-0.5 text-xs font-black text-orange-800">{q.from}</span>
          <span className="text-orange-400">→</span>
          <span className="rounded-full bg-amber-300 px-2.5 py-0.5 text-xs font-black text-amber-900">{q.to}</span>
        </div>
        <p className="text-base font-bold text-slate-900 mb-1">"{q.sentence}"</p>
        <p className="text-xs text-orange-600">Bu gapni <strong>{q.to}</strong> ga o'tkazing</p>
      </div>

      <div className="space-y-2">
        {q.opts.map((opt) => {
          const isSelected = selected === opt
          const isCorrect  = opt === q.correct
          return (
            <motion.button key={opt} whileTap={{ scale: 0.98 }} onClick={() => answer(opt)}
              className={`w-full rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition ${selected ? (isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : isSelected ? 'border-red-400 bg-red-50 text-red-800' : 'border-slate-100 text-slate-400') : 'border-slate-200 bg-white text-slate-800 hover:border-orange-300 hover:bg-orange-50 cursor-pointer'}`}>
              {opt}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  DEFINITION QUIZ
// ─────────────────────────────────────────────────────────────────────────────
const DEF_QUESTIONS = [
  { word: 'Benevolent', def: 'Well meaning and kindly; generous', opts: ['Cruel and selfish','Well meaning and kindly','Extremely tired','Easily frightened'], ans: 1 },
  { word: 'Ephemeral', def: 'Lasting for a very short time', opts: ['Permanent and lasting','Very large in size','Lasting a very short time','Extremely expensive'], ans: 2 },
  { word: 'Eloquent', def: 'Fluent or persuasive in speaking or writing', opts: ['Unable to speak','Fluent and persuasive','Very quiet','Physically strong'], ans: 1 },
  { word: 'Pragmatic', def: 'Dealing with things sensibly and realistically', opts: ['Idealistic and unrealistic','Dealing sensibly with things','Completely irrational','Deeply emotional'], ans: 1 },
  { word: 'Ubiquitous', def: 'Present, appearing, or found everywhere', opts: ['Extremely rare','Very dangerous','Present everywhere','Completely invisible'], ans: 2 },
  { word: 'Tenacious', def: 'Tending to keep a firm hold; persistent', opts: ['Easily giving up','Firm and persistent','Extremely gentle','Very forgetful'], ans: 1 },
  { word: 'Ambiguous', def: 'Open to more than one interpretation', opts: ['Completely clear','Very straightforward','Open to multiple interpretations','Absolutely certain'], ans: 2 },
  { word: 'Meticulous', def: 'Showing great attention to detail; very careful', opts: ['Very careless','Showing great care','Extremely fast','Completely random'], ans: 1 },
]

function DefinitionQuizGame() {
  const qs = shuffle(DEF_QUESTIONS)
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const q = qs[idx]

  function answer(i) {
    if (selected !== null) return
    setSelected(i)
    if (i === q.ans) setScore((s) => s + 15)
    setTimeout(() => {
      if (idx + 1 >= qs.length) { setDone(true); return }
      setIdx((i) => i + 1); setSelected(null)
    }, 1200)
  }

  if (done) return (
    <div className="rounded-3xl bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 p-8 text-center">
      <p className="text-4xl mb-2">📖</p>
      <h3 className="text-2xl font-black text-teal-800">Tayyor!</h3>
      <p className="text-3xl font-black text-slate-900 mt-1">{score}</p>
      <button onClick={() => { setIdx(0); setScore(0); setDone(false); setSelected(null) }} className="mt-4 rounded-2xl bg-teal-600 px-6 py-3 text-sm font-bold text-white">Qayta</button>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Definition Quiz 📖</h2>
        <div className="flex gap-3 text-sm">
          <span className="text-slate-400">{idx + 1}/{qs.length}</span>
          <span className="flex items-center gap-1 font-bold text-teal-700"><Zap size={13} />{score}</span>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-teal-200 bg-teal-50 p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <p className="text-2xl font-black text-teal-900">{q.word}</p>
          <button onClick={() => speak(q.word)} className="text-teal-400 hover:text-teal-600"><Volume2 size={14} /></button>
        </div>
        <p className="text-sm text-teal-700 italic">"{q.def}"</p>
        <p className="text-xs text-teal-500 mt-1">Yuqoridagi ta'rifga mos keladigan ma'noni tanlang</p>
      </div>

      <div className="space-y-2">
        {q.opts.map((opt, i) => {
          const isSelected = selected === i
          const isCorrect  = i === q.ans
          return (
            <motion.button key={i} whileTap={{ scale: 0.98 }} onClick={() => answer(i)}
              className={`w-full rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition ${selected !== null ? (isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : isSelected ? 'border-red-400 bg-red-50 text-red-800' : 'border-slate-100 text-slate-400') : 'border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50 cursor-pointer'}`}>
              <span className="mr-3 opacity-50">{String.fromCharCode(65 + i)}.</span>{opt}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  EXISTING GAMES (preserved)
// ─────────────────────────────────────────────────────────────────────────────
function WordMatchGame() {
  const pairs = shuffle(WORD_PAIRS).slice(0, 8)
  const cards = shuffle([...pairs.map((p, i) => ({ id: `en-${i}`, text: p.en, pairId: i, side: 'en' })), ...pairs.map((p, i) => ({ id: `uz-${i}`, text: p.uz, pairId: i, side: 'uz' }))])
  const [selected, setSelected] = useState([])
  const [matched, setMatched] = useState(new Set())
  const [wrong, setWrong] = useState([])
  const [score, setScore] = useState(0)
  const [errors, setErrors] = useState(0)
  const [done, setDone] = useState(false)

  function select(card) {
    if (matched.has(card.pairId) || wrong.includes(card.id)) return
    if (selected.find((c) => c.id === card.id)) return
    const next = [...selected, card]
    if (next.length === 1) { setSelected(next); return }
    const [a, b] = next
    if (a.pairId === b.pairId && a.side !== b.side) {
      const nm = new Set([...matched, a.pairId]); setMatched(nm); setSelected([]); setScore((s) => s + 10)
      if (nm.size === pairs.length) setDone(true)
    } else { setWrong([a.id, b.id]); setErrors((e) => e + 1); setTimeout(() => { setWrong([]); setSelected([]) }, 900) }
  }
  function restart() { setSelected([]); setMatched(new Set()); setWrong([]); setScore(0); setErrors(0); setDone(false) }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">Word Match 🃏</h2>
        <div className="flex gap-3 text-sm"><span className="font-bold text-indigo-700 flex items-center gap-1"><Zap size={13} />{score}</span><span className="text-red-500 flex items-center gap-1"><X size={13} />{errors}</span></div>
      </div>
      {done ? (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="rounded-3xl bg-emerald-50 border-2 border-emerald-200 p-8 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="text-2xl font-black text-emerald-800">Barakalla!</h3>
          <p className="text-sm text-emerald-600">Ball: {score} · Xato: {errors}</p>
          <button onClick={restart} className="mt-4 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white">Qayta</button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-4 gap-2.5">
          {cards.map((card) => {
            const isMatched = matched.has(card.pairId), isSelected = selected.find((c) => c.id === card.id), isWrong = wrong.includes(card.id)
            return (
              <motion.button key={card.id} onClick={() => select(card)} whileHover={{ scale: isMatched ? 1 : 1.03 }} whileTap={{ scale: 0.97 }}
                className={`relative rounded-2xl border-2 p-3 text-xs font-semibold transition min-h-16 flex items-center justify-center text-center leading-5 ${isMatched ? 'border-emerald-300 bg-emerald-50 text-emerald-700 cursor-default' : isWrong ? 'border-red-400 bg-red-50 text-red-700' : isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-800 shadow-md' : card.side === 'en' ? 'border-indigo-200 bg-white text-slate-800 hover:border-indigo-400' : 'border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-400'}`}>
                {isMatched && <CheckCircle2 size={12} className="absolute top-1.5 right-1.5 text-emerald-500" />}
                {card.text}
              </motion.button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SentenceBuilderGame() {
  const [idx, setIdx] = useState(0)
  const [placed, setPlaced] = useState([])
  const [bank, setBank] = useState([])
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const sentence = SENTENCES[idx]
  useEffect(() => { setBank(shuffle(sentence.words)); setPlaced([]); setResult(null) }, [idx])
  function addWord(w, bankIdx) { setPlaced((p) => [...p, w]); setBank((b) => b.filter((_, i) => i !== bankIdx)) }
  function removeWord(w, pIdx) { setBank((b) => [...b, w]); setPlaced((p) => p.filter((_, i) => i !== pIdx)) }
  function check() { const ok = placed.join(' ') === sentence.correct; setResult(ok ? 'correct' : 'wrong'); if (ok) setScore((s) => s + 15) }
  function next() { if (idx + 1 >= SENTENCES.length) { setDone(true); return } setIdx((i) => i + 1) }
  if (done) return <div className="rounded-3xl bg-violet-50 border-2 border-violet-200 p-8 text-center"><p className="text-4xl mb-2">🏆</p><h3 className="text-2xl font-black text-violet-800">Tayyor!</h3><p className="text-3xl font-black text-slate-900 mt-1">{score}</p><button onClick={() => { setIdx(0); setScore(0); setDone(false) }} className="mt-4 rounded-2xl bg-violet-600 px-6 py-3 text-sm font-bold text-white">Qayta</button></div>
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-lg font-black text-slate-900">Sentence Builder 🔤</h2><span className="flex items-center gap-1 text-sm font-bold text-violet-700"><Zap size={13} />{score}</span></div>
      <div className="min-h-16 rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50 p-3 flex flex-wrap gap-2 items-center">
        {placed.length === 0 && <p className="text-xs text-violet-300 italic w-full text-center">So'zlarni bu yerga tashang...</p>}
        {placed.map((w, i) => <motion.button key={`p-${i}`} onClick={() => removeWord(w, i)} whileTap={{ scale: 0.95 }} className={`rounded-xl border-2 px-3 py-1.5 text-sm font-semibold transition ${result === 'correct' ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : result === 'wrong' ? 'border-red-400 bg-red-50 text-red-800' : 'border-violet-400 bg-white text-violet-800 hover:bg-violet-100'}`}>{w}</motion.button>)}
      </div>
      <div className="flex flex-wrap gap-2">{bank.map((w, i) => <motion.button key={`b-${i}`} onClick={() => addWord(w, i)} whileTap={{ scale: 0.95 }} className="rounded-xl border-2 border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 hover:border-violet-300 hover:bg-violet-50 transition">{w}</motion.button>)}</div>
      {result && <div className={`rounded-2xl p-3 text-sm font-semibold ${result === 'correct' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>{result === 'correct' ? '✅ To\'g\'ri!' : `❌ To\'g\'ri: "${sentence.correct}"`}</div>}
      <div className="flex gap-3">
        <button onClick={() => { setBank(shuffle(sentence.words)); setPlaced([]); setResult(null) }} className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"><RefreshCw size={14} />Qayta</button>
        {!result ? <button onClick={check} disabled={placed.length !== sentence.words.length} className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-bold text-white disabled:opacity-40">Tekshirish</button> : <button onClick={next} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white">Keyingi <ChevronRight size={15} /></button>}
      </div>
    </div>
  )
}

function GrammarQuizGame() {
  const qs = shuffle(GRAMMAR_QUESTIONS)
  const [idx, setIdx] = useState(0); const [selected, setSelected] = useState(null); const [score, setScore] = useState(0); const [streak, setStreak] = useState(0); const [timeLeft, setTimeLeft] = useState(15); const [done, setDone] = useState(false); const timerRef = useRef(null); const q = qs[idx]
  function startTimer() { clearInterval(timerRef.current); setTimeLeft(15); timerRef.current = setInterval(() => setTimeLeft((t) => { if (t <= 1) { clearInterval(timerRef.current); handleAnswer(-1); return 0 } return t - 1 }), 1000) }
  useEffect(() => { if (!done) startTimer(); return () => clearInterval(timerRef.current) }, [idx, done])
  function handleAnswer(i) { clearInterval(timerRef.current); setSelected(i); const ok = i === q.ans; if (ok) { setScore((s) => s + 10 + streak * 2); setStreak((s) => s + 1) } else setStreak(0); setTimeout(() => { if (idx + 1 >= qs.length) { setDone(true); return } setIdx((i) => i + 1); setSelected(null) }, 1000) }
  if (done) return <div className="rounded-3xl bg-amber-50 border-2 border-amber-200 p-8 text-center"><p className="text-4xl mb-2">🎯</p><h3 className="text-2xl font-black text-amber-800">Tayyor!</h3><p className="text-3xl font-black text-slate-900 mt-1">{score}</p><button onClick={() => { setIdx(0); setScore(0); setStreak(0); setDone(false); setSelected(null) }} className="mt-4 rounded-2xl bg-amber-600 px-6 py-3 text-sm font-bold text-white">Qayta</button></div>
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-lg font-black text-slate-900">Grammar Quiz ⚡</h2><div className="flex gap-3">{streak > 1 && <span className="flex items-center gap-1 text-sm font-bold text-orange-500"><Flame size={14} />×{streak}</span>}<span className="flex items-center gap-1 text-sm font-bold text-amber-700"><Zap size={13} />{score}</span></div></div>
      <div><div className={`h-2 rounded-full overflow-hidden ${timeLeft <= 5 ? 'bg-red-100' : 'bg-slate-100'}`}><motion.div className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-amber-500'}`} animate={{ width: `${(timeLeft / 15) * 100}%` }} transition={{ duration: 0.3 }} /></div><div className="flex justify-between text-xs mt-0.5 text-slate-400"><span>{idx + 1}/{qs.length}</span><span className={timeLeft <= 5 ? 'text-red-500 font-bold' : ''}>{timeLeft}s</span></div></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-base font-bold text-slate-900">{q.q}</p></div>
      <div className="grid grid-cols-2 gap-2">{q.opts.map((opt, i) => { const isSel = selected === i; const isCor = i === q.ans; return <motion.button key={i} onClick={() => selected === null && handleAnswer(i)} whileTap={{ scale: 0.97 }} className={`rounded-2xl border-2 py-3 text-sm font-semibold transition ${selected !== null ? (isCor ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : isSel ? 'border-red-400 bg-red-50 text-red-800' : 'border-slate-100 text-slate-400') : 'border-slate-200 bg-white text-slate-800 hover:border-amber-400 hover:bg-amber-50 cursor-pointer'}`}>{opt}</motion.button> })}</div>
      {selected !== null && <div className={`rounded-2xl p-3 text-xs font-semibold ${selected === q.ans ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>💡 {q.exp}</div>}
    </div>
  )
}

function SpellingBeeGame() {
  const words = shuffle(SPELLING_WORDS); const [idx, setIdx] = useState(0); const [input, setInput] = useState(''); const [result, setResult] = useState(null); const [score, setScore] = useState(0); const [done, setDone] = useState(false); const [played, setPlayed] = useState(false); const inputRef = useRef(null); const current = words[idx]
  function playWord() { speak(current.word); setPlayed(true) }
  function check() { const ok = input.trim().toLowerCase() === current.word.toLowerCase(); setResult(ok ? 'correct' : 'wrong'); if (ok) setScore((s) => s + 20); setTimeout(() => { if (idx + 1 >= words.length) { setDone(true); return } setIdx((i) => i + 1); setInput(''); setResult(null); setPlayed(false); setTimeout(() => inputRef.current?.focus(), 100) }, 1200) }
  if (done) return <div className="rounded-3xl bg-sky-50 border-2 border-sky-200 p-8 text-center"><p className="text-4xl mb-2">🐝</p><h3 className="text-2xl font-black text-sky-800">Ajoyib!</h3><p className="text-3xl font-black text-slate-900 mt-1">{score}</p><button onClick={() => { setIdx(0); setScore(0); setInput(''); setResult(null); setPlayed(false); setDone(false) }} className="mt-4 rounded-2xl bg-sky-600 px-6 py-3 text-sm font-bold text-white">Qayta</button></div>
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between"><h2 className="text-lg font-black text-slate-900">Spelling Bee 🐝</h2><div className="flex gap-3"><span className="text-xs text-slate-400">{idx + 1}/{words.length}</span><span className="flex items-center gap-1 text-sm font-bold text-sky-700"><Zap size={13} />{score}</span></div></div>
      <div className="rounded-3xl bg-sky-50 border-2 border-sky-200 p-6 text-center"><p className="text-xs text-sky-500 font-semibold mb-2">Ma'nosi:</p><p className="text-lg font-bold text-sky-900">{current.hint}</p><button onClick={playWord} className={`mt-4 flex items-center gap-2 mx-auto rounded-2xl px-6 py-2.5 text-sm font-bold transition ${played ? 'bg-sky-100 text-sky-700' : 'bg-sky-600 text-white shadow-md'}`}><Volume2 size={16} />{played ? 'Qayta tinglash' : 'So\'zni tinglang'}</button></div>
      <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && check()} placeholder="So'zni yozing..." disabled={result !== null} className={`w-full rounded-2xl border-2 px-5 py-4 text-lg font-bold text-center outline-none transition ${result === 'correct' ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : result === 'wrong' ? 'border-red-400 bg-red-50 text-red-800' : 'border-slate-200 bg-white focus:border-sky-400'}`} />
      {result && <p className={`text-center text-sm font-bold ${result === 'correct' ? 'text-emerald-700' : 'text-red-600'}`}>{result === 'correct' ? '✅ To\'g\'ri!' : `❌ To\'g\'ri: "${current.word}"`}</p>}
      <div className="flex gap-3"><button onClick={() => { setIdx((i) => (i + 1) % words.length); setInput(''); setResult(null); setPlayed(false) }} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600">O'tkazish</button><button onClick={check} disabled={!input.trim() || result !== null} className="flex-1 rounded-xl bg-sky-600 py-2.5 text-sm font-bold text-white disabled:opacity-40">Tekshirish (Enter)</button></div>
    </div>
  )
}

function VocabRaceGame() {
  const [phase, setPhase] = useState('ready'); const [words, setWords] = useState([]); const [idx, setIdx] = useState(0); const [score, setScore] = useState(0); const [timeLeft, setTimeLeft] = useState(60); const timerRef = useRef(null)
  function start() { setWords(shuffle(VOCAB_RACE_WORDS)); setIdx(0); setScore(0); setTimeLeft(60); setPhase('playing'); timerRef.current = setInterval(() => setTimeLeft((t) => { if (t <= 1) { clearInterval(timerRef.current); setPhase('done'); return 0 } return t - 1 }), 1000) }
  function answer(c) { const cur = words[idx]; if (!cur) return; if (c === 'correct') setScore((s) => s + 5); const next = idx + 1; if (next >= words.length) { clearInterval(timerRef.current); setPhase('done'); return } setIdx(next) }
  useEffect(() => () => clearInterval(timerRef.current), [])
  const current = words[idx]
  if (phase === 'ready') return <div className="text-center space-y-4"><p className="text-5xl">🏁</p><h2 className="text-2xl font-black text-slate-900">Vocab Race</h2><p className="text-sm text-slate-500">60 soniya ichida imkoni boricha ko'proq so'z ma'nosini toping!</p><button onClick={start} className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-base font-black text-white shadow-xl"><Flame className="inline mr-2" size={18} />Boshlash!</button></div>
  if (phase === 'done') return <div className="rounded-3xl bg-indigo-50 border-2 border-indigo-200 p-8 text-center"><p className="text-5xl mb-2">🏆</p><h3 className="text-2xl font-black text-indigo-800">Vaqt tugadi!</h3><p className="text-4xl font-black text-slate-900 mt-1">{score}</p><button onClick={() => setPhase('ready')} className="mt-4 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white">Qayta</button></div>
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between"><h2 className="text-lg font-black text-slate-900">Vocab Race 🏁</h2><span className="flex items-center gap-1 text-sm font-bold text-indigo-700"><Zap size={13} />{score}</span></div>
      <div><div className={`h-3 rounded-full overflow-hidden ${timeLeft <= 10 ? 'bg-red-100' : 'bg-slate-100'}`}><motion.div className={`h-full rounded-full ${timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 20 ? 'bg-amber-500' : 'bg-indigo-500'}`} animate={{ width: `${(timeLeft / 60) * 100}%` }} transition={{ duration: 0.5 }} /></div><p className={`text-right text-xs mt-0.5 font-black ${timeLeft <= 10 ? 'text-red-500' : 'text-slate-400'}`}>{timeLeft}s</p></div>
      {current && <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border-2 border-indigo-200 bg-white p-8 text-center shadow-md"><p className="text-xs text-slate-400 mb-2">O'zbek tilida:</p><p className="text-2xl font-black text-slate-900">{current.uz}</p><button onClick={() => speak(current.word)} className="mt-3 text-xs text-indigo-400 hover:text-indigo-600 transition"><Volume2 size={12} className="inline mr-1" />Inglizcha tinglash</button></motion.div>}
      <div className="grid grid-cols-2 gap-3"><motion.button whileTap={{ scale: 0.95 }} onClick={() => answer('wrong')} className="rounded-2xl border-2 border-red-200 bg-red-50 py-4 text-sm font-bold text-red-700 hover:bg-red-100">❌ Bilmayman</motion.button><motion.button whileTap={{ scale: 0.95 }} onClick={() => answer('correct')} className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 py-4 text-sm font-bold text-emerald-700 hover:bg-emerald-100">✅ Bilaman!</motion.button></div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  GAME CATALOG
// ─────────────────────────────────────────────────────────────────────────────
const GAMES = [
  { id: 'word_match',   emoji: '🃏', title: 'Word Match',         desc: 'Inglizcha so\'zlarni o\'zbekcha tarjimasi bilan moslang',          color: 'from-indigo-500 to-violet-600',  bg: 'from-indigo-50 to-violet-50',  border: 'border-indigo-200', diff: 'Oson',    xp: 80,  time: '2-3 daq',  Component: WordMatchGame },
  { id: 'sentence',     emoji: '🔤', title: 'Sentence Builder',   desc: 'Aralashtirilgan so\'zlarni to\'g\'ri tartibda joylashtiring',       color: 'from-violet-500 to-purple-700', bg: 'from-violet-50 to-purple-50', border: 'border-violet-200', diff: 'O\'rta', xp: 120, time: '3-5 daq',  Component: SentenceBuilderGame },
  { id: 'hangman',      emoji: '🎯', title: 'Hangman',            desc: 'So\'zni harf-harf topib oson va qiziqarli o\'yin o\'ynang',         color: 'from-slate-600 to-slate-800',   bg: 'from-slate-50 to-gray-50',    border: 'border-slate-300',  diff: 'O\'rta', xp: 100, time: '3-5 daq',  Component: HangmanGame },
  { id: 'anagram',      emoji: '🔀', title: 'Anagram',            desc: 'Aralashtirilgan harflardan to\'g\'ri so\'zni tuzing',               color: 'from-violet-500 to-indigo-600', bg: 'from-violet-50 to-indigo-50', border: 'border-violet-200', diff: 'O\'rta', xp: 110, time: '2-4 daq',  Component: AnagramGame },
  { id: 'word_snake',   emoji: '🐍', title: 'Word Snake',         desc: 'Oxirgi harfdan boshlanadigan so\'z aytib, zanjirni cho\'zing',      color: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-50',  border: 'border-emerald-200',diff: 'Qiyin',  xp: 130, time: '1 daq',     Component: WordSnakeGame },
  { id: 'fill_blank',   emoji: '✏️', title: 'Fill the Blank',     desc: 'IELTS uslubidagi gaplarga mos so\'zlarni tanlang',                  color: 'from-sky-500 to-blue-600',      bg: 'from-sky-50 to-blue-50',      border: 'border-sky-200',    diff: 'O\'rta', xp: 100, time: '3-4 daq',  Component: FillBlankGame },
  { id: 'idiom_match',  emoji: '💬', title: 'Idiom Match',        desc: 'Inglizcha idiomalarni o\'zbek ma\'nolari bilan moslang',            color: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-50',  border: 'border-amber-200',  diff: 'Qiyin',  xp: 140, time: '3-4 daq',  Component: IdiomMatchGame },
  { id: 'preposition',  emoji: '🎯', title: 'Preposition Hunt',   desc: 'in, on, at, by — to\'g\'ri ko\'makchini tanlang',                  color: 'from-rose-500 to-pink-600',    bg: 'from-rose-50 to-pink-50',     border: 'border-rose-200',   diff: 'O\'rta', xp: 100, time: '3-4 daq',  Component: PrepositionHuntGame },
  { id: 'synonym',      emoji: '🌪️', title: 'Synonym Storm',     desc: '15 soniyada berilgan so\'zning barcha sinonimlarini toping',        color: 'from-violet-500 to-purple-700', bg: 'from-violet-50 to-purple-50', border: 'border-violet-200', diff: 'Qiyin',  xp: 150, time: '2-3 daq',  Component: SynonymStormGame },
  { id: 'category',     emoji: '📦', title: 'Category Sort',      desc: 'So\'zlarni to\'g\'ri kategoriyalar (hayvon, meva, rang) ga joylashtiring', color: 'from-teal-500 to-cyan-600', bg: 'from-teal-50 to-cyan-50', border: 'border-teal-200', diff: 'O\'rta', xp: 110, time: '3-4 daq', Component: CategorySortGame },
  { id: 'tense',        emoji: '⚡', title: 'Tense Transformer',  desc: 'Gaplarni bir zamondan boshqa zamonga o\'tkazing',                   color: 'from-orange-500 to-amber-600', bg: 'from-orange-50 to-amber-50',  border: 'border-orange-200', diff: 'Qiyin',  xp: 120, time: '3-4 daq',  Component: TenseTransformerGame },
  { id: 'definition',   emoji: '📖', title: 'Definition Quiz',    desc: 'Inglizcha ta\'rifga mos keladigan so\'zning ma\'nosini toping',      color: 'from-teal-500 to-emerald-600', bg: 'from-teal-50 to-emerald-50',  border: 'border-teal-200',   diff: 'Qiyin',  xp: 140, time: '3-5 daq',  Component: DefinitionQuizGame },
  { id: 'grammar',      emoji: '📝', title: 'Grammar Quiz',       desc: '15 soniyada to\'g\'ri grammatik variantni tanlang',                 color: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-50',  border: 'border-amber-200',  diff: 'O\'rta', xp: 100, time: '3-4 daq',  Component: GrammarQuizGame },
  { id: 'spelling',     emoji: '🐝', title: 'Spelling Bee',       desc: 'AI so\'z o\'qiydi — siz to\'g\'ri yozasiz',                        color: 'from-sky-500 to-blue-600',     bg: 'from-sky-50 to-blue-50',      border: 'border-sky-200',    diff: 'Qiyin',  xp: 160, time: '4-6 daq',  Component: SpellingBeeGame },
  { id: 'vocab_race',   emoji: '🏁', title: 'Vocab Race',         desc: '60 soniyada imkoni boricha ko\'proq so\'z ma\'nosini toping',       color: 'from-indigo-500 to-violet-600', bg: 'from-indigo-50 to-violet-50', border: 'border-indigo-200', diff: 'O\'rta', xp: 90,  time: '1 daq',    Component: VocabRaceGame },
]

const DIFF_STYLES = {
  'Oson':  { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'O\'rta':{ bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  'Qiyin': { bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-500' },
}

// ─────────────────────────────────────────────────────────────────────────────
//  GAME CARD
// ─────────────────────────────────────────────────────────────────────────────
function GameCard({ game, onClick }) {
  const diff = DIFF_STYLES[game.diff] || DIFF_STYLES['O\'rta']
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-2xl border-2 ${game.border} bg-white text-left shadow-sm transition-all duration-200 hover:shadow-lg`}
    >
      {/* Top gradient bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${game.color}`} />

      <div className="p-4">
        {/* Emoji + diff */}
        <div className="mb-3 flex items-start justify-between">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${game.color} text-3xl shadow-md`}>
            {game.emoji}
          </div>
          <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${diff.bg} ${diff.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${diff.dot}`} />
            {game.diff}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-1 font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
          {game.title}
        </h3>

        {/* Desc */}
        <p className="text-xs leading-5 text-slate-500 line-clamp-2">{game.desc}</p>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><Clock size={10} />{game.time}</span>
            <span className="flex items-center gap-1 font-bold text-indigo-600"><Zap size={10} />+{game.xp} XP</span>
          </div>
          <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${game.color} text-white shadow-sm transition group-hover:scale-110`}>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </motion.button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const FILTERS = ['Hammasi', 'Oson', 'O\'rta', 'Qiyin']

function GamesPage() {
  const navigate = useNavigate()
  const [activeGame, setActiveGame] = useState(null)
  const [filter, setFilter] = useState('Hammasi')
  const [sessionKey, setSessionKey] = useState(0)

  const game = GAMES.find((g) => g.id === activeGame)
  const GameComponent = game?.Component

  const filtered = filter === 'Hammasi' ? GAMES : GAMES.filter((g) => g.diff === filter)

  const totalXP = GAMES.reduce((s, g) => s + g.xp, 0)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <button
            onClick={() => activeGame ? setActiveGame(null) : navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition shrink-0">
            <ArrowLeft size={15} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-slate-900">
              {activeGame ? game?.title : 'O\'yinlar'}
            </p>
            <p className="text-[11px] text-slate-400">
              {activeGame ? game?.desc?.slice(0, 45) + '…' : `${GAMES.length} ta o'yin · ingliz tilini o'rganing`}
            </p>
          </div>
          {activeGame ? (
            <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 px-3 py-1.5 text-xs font-black text-amber-700 shrink-0">
              <Zap size={11} />+{game?.xp} XP
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700">
              <Trophy size={11} />Jami {totalXP} XP
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        <AnimatePresence mode="wait">
          {!activeGame ? (
            <motion.div key={`catalog-${sessionKey}`}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>

              {/* Hero */}
              <div className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-700 to-purple-800 p-7 text-white shadow-2xl">
                <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/5" />
                <div className="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-violet-500/20" />
                <div className="relative grid items-center gap-4 md:grid-cols-[1fr_auto]">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur mb-3">
                      <Gamepad2 size={12} />{GAMES.length} ta o'yin
                    </span>
                    <h1 className="text-3xl font-black leading-tight">
                      O'yin bilan <span className="text-yellow-300">ingliz tili</span>
                    </h1>
                    <p className="mt-2 text-sm text-indigo-200 max-w-lg">
                      Grammar, vocabulary, spelling, idiom, preposition — hammasini qiziqarli o'yinlar orqali o'rganing. Har o'yin uchun XP oling!
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {['🎯 Hangman', '🌪️ Synonym Storm', '🐍 Word Snake', '📦 Category Sort', '⚡ Tense Transformer'].map((t) => (
                        <span key={t} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="hidden text-7xl md:block select-none">🎮</div>
                </div>
              </div>

              {/* Stats bar */}
              <div className="mb-6 grid grid-cols-3 gap-3">
                {[
                  { icon: Gamepad2, label: 'Jami o\'yinlar', value: GAMES.length, color: 'text-indigo-600 bg-indigo-50' },
                  { icon: Star,     label: 'Oson o\'yinlar', value: GAMES.filter((g) => g.diff === 'Oson').length,    color: 'text-emerald-600 bg-emerald-50' },
                  { icon: Trophy,   label: 'Jami XP',        value: totalXP + '+',   color: 'text-amber-600 bg-amber-50' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                    <div className={`mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                      <Icon size={15} />
                    </div>
                    <p className="text-xl font-black text-slate-900">{value}</p>
                    <p className="text-[11px] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>

              {/* Filter tabs */}
              <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-1">
                {FILTERS.map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ${filter === f ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700'}`}>
                    {f} {f !== 'Hammasi' && `(${GAMES.filter((g) => g.diff === f).length})`}
                  </button>
                ))}
              </div>

              {/* Game grid */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((g) => (
                  <GameCard key={g.id} game={g} onClick={() => { setActiveGame(g.id); setSessionKey((k) => k + 1) }} />
                ))}
              </div>

              {/* Tips */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Star,   title: 'XP to\'plang',   desc: 'Har o\'yin uchun XP oling va leaderboard\'da yuqori o\'ringa chiqing' },
                  { icon: Flame,  title: 'Streak saqlang', desc: 'Har kuni o\'yin o\'ynab 🔥 streak\'ingizni saqlab qoling' },
                  { icon: Trophy, title: 'Ustunlikka ering', desc: 'Eng qiyin o\'yinlarni yechib o\'zingizni sinab ko\'ring' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
                      <Icon size={16} className="text-indigo-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">{title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key={`game-${activeGame}-${sessionKey}`}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>

              {/* Game header card */}
              <div className={`mb-5 overflow-hidden rounded-2xl bg-gradient-to-r ${game?.color} p-4 text-white shadow-md`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{game?.emoji}</span>
                  <div>
                    <p className="font-black">{game?.title}</p>
                    <p className="text-[11px] opacity-80">{game?.desc}</p>
                  </div>
                  <div className="ml-auto flex flex-col items-end gap-1">
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold">+{game?.xp} XP</span>
                    <span className="text-[10px] opacity-70">{game?.time}</span>
                  </div>
                </div>
              </div>

              {GameComponent && <GameComponent key={sessionKey} onBack={() => setActiveGame(null)} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default GamesPage
