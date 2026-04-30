import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, ChevronRight, RefreshCw, Volume2, Zap } from 'lucide-react'

const WORD_POOL = [
  { word:'Serendipity',  ipa:'/ˌserənˈdɪpɪti/',  uz:'Tasodifiy baxt',        def:'The occurrence of events by chance in a happy way.',        ex:'It was pure serendipity that we met.' },
  { word:'Ephemeral',   ipa:'/ɪˈfemərəl/',       uz:'Qisqa muddatli',        def:'Lasting for a very short time.',                           ex:'Fame can be ephemeral.' },
  { word:'Resilient',   ipa:'/rɪˈzɪliənt/',      uz:'Chidamli, tez tiklanadigan', def:'Able to recover quickly from difficulties.',          ex:'She is a resilient person who never gives up.' },
  { word:'Perspicacious',ipa:'/ˌpɜːspɪˈkeɪʃəs/', uz:'Zukko, o\'tkir zehnli',  def:'Having a ready insight into things; shrewdly clever.',     ex:'A perspicacious analyst spotted the trend early.' },
  { word:'Ubiquitous',  ipa:'/juːˈbɪkwɪtəs/',    uz:'Hamma joyda uchraydigan',def:'Present, appearing, or found everywhere.',                 ex:'Smartphones have become ubiquitous.' },
  { word:'Mellifluous', ipa:'/meˈlɪfluəs/',      uz:'Ohangli, yoqimli (ovoz)',def:'Sweet or musical; pleasant to hear.',                       ex:'Her mellifluous voice captivated the audience.' },
  { word:'Tenacious',   ipa:'/tɪˈneɪʃəs/',      uz:'Qat\'iyatli, islovsiz',  def:'Tending to keep a firm hold; persistent.',                  ex:'A tenacious fighter who never surrenders.' },
  { word:'Eloquent',    ipa:'/ˈeləkwənt/',       uz:'Notiq, ravon so\'zlovchi',def:'Fluent or persuasive in speaking or writing.',             ex:'She gave an eloquent speech.' },
  { word:'Pragmatic',   ipa:'/præɡˈmætɪk/',     uz:'Amaliy, hayotiy',        def:'Dealing with things sensibly and realistically.',           ex:'We need a pragmatic solution.' },
  { word:'Luminous',    ipa:'/ˈluːmɪnəs/',       uz:'Yaltiroq, ravshan',      def:'Full of or shedding light; bright or shining.',             ex:'The luminous moon lit the path.' },
  { word:'Cogent',      ipa:'/ˈkəʊdʒənt/',       uz:'Mantiqiy, ishonchli',    def:'Clear, logical, and convincing.',                           ex:'He made a cogent argument.' },
  { word:'Versatile',   ipa:'/ˈvɜːsətaɪl/',      uz:'Ko\'p qirrali',          def:'Able to adapt or be adapted to many functions.',            ex:'She is a versatile athlete.' },
  { word:'Profound',    ipa:'/prəˈfaʊnd/',        uz:'Chuqur, o\'tkir',        def:'Very great or intense; showing intellectual depth.',         ex:'The book had a profound effect on me.' },
  { word:'Eloquence',   ipa:'/ˈeləkwəns/',        uz:'Notiqlik',               def:'Fluent or persuasive speaking or writing.',                  ex:'His eloquence won the debate.' },
]

const WOTD_KEY = 'lingify_word_of_day'

function getWordOfDay() {
  const today = new Date().toISOString().slice(0,10)
  try {
    const saved = JSON.parse(localStorage.getItem(WOTD_KEY)||'{}')
    if (saved.date === today) return saved
  } catch {}
  const dayNum = Math.floor(Date.now() / 86400000)
  const word = WORD_POOL[dayNum % WORD_POOL.length]
  const data = { date: today, ...word, learned: false }
  localStorage.setItem(WOTD_KEY, JSON.stringify(data))
  return data
}

export function WordOfTheDay() {
  const navigate = useNavigate()
  const [word, setWord] = useState(getWordOfDay)
  const [learned, setLearned] = useState(word.learned)
  const [flipped, setFlipped] = useState(false)

  function speakWord() {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(word.word)
    u.lang = 'en-US'; u.rate = 0.82
    window.speechSynthesis.speak(u)
  }

  function markLearned() {
    setLearned(true)
    const updated = { ...word, learned: true }
    localStorage.setItem(WOTD_KEY, JSON.stringify(updated))
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100">
            <BookOpen size={15} className="text-amber-600" />
          </div>
          <p className="text-sm font-black text-slate-900">Kunlik so'z</p>
        </div>
        <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
          {new Date().toLocaleDateString('uz-UZ', { day:'numeric', month:'short' })}
        </span>
      </div>

      {/* Word card (flip) */}
      <motion.div
        style={{ perspective: 800 }}
        className="cursor-pointer"
        onClick={() => setFlipped((v) => !v)}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', minHeight: 100 }}
        >
          {/* Front */}
          <div style={{ backfaceVisibility: 'hidden' }}
            className="rounded-2xl border border-amber-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-2xl font-black text-slate-900">{word.word}</h3>
              <button onClick={(e) => { e.stopPropagation(); speakWord() }}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 hover:bg-amber-200 transition shrink-0">
                <Volume2 size={15} />
              </button>
            </div>
            <p className="text-xs font-mono text-slate-400 mb-2">{word.ipa}</p>
            <p className="text-sm font-bold text-emerald-700">🇺🇿 {word.uz}</p>
            <p className="mt-1 text-[11px] text-slate-400">Orqasini ko'rish uchun bosing →</p>
          </div>

          {/* Back */}
          <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0 }}
            className="rounded-2xl border border-amber-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-500 mb-1">Ta'rif:</p>
            <p className="text-sm text-slate-800 font-medium leading-5">{word.def}</p>
            <p className="mt-2 text-xs font-semibold text-slate-500">Misol:</p>
            <p className="text-xs italic text-slate-600">"{word.ex}"</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        {!learned ? (
          <button onClick={markLearned}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2 text-xs font-bold text-white hover:bg-amber-600 transition">
            <Zap size={12} />O'rgandim! +10 XP
          </button>
        ) : (
          <div className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-100 py-2 text-xs font-bold text-emerald-700">
            ✅ Bugun o'rganildi
          </div>
        )}
        <button onClick={() => navigate('/vocabulary')}
          className="flex items-center gap-1 rounded-xl border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition">
          Lug'at <ChevronRight size={12} />
        </button>
      </div>
    </div>
  )
}

export default WordOfTheDay
