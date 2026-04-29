import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, ChevronRight, Clock, FileCheck2,
  Gamepad2, Search, Sparkles, Trophy, Volume2,
  X, Zap,
} from 'lucide-react'
import { curriculum } from '../data/curriculum'
import { TEST_CATALOG } from '../data/mockTests'
import { useVocabulary } from '../hooks/useVocabulary'

// ── Category colors ────────────────────────────────────────────────────────────
const CATEGORY_META = {
  lesson:  { icon: BookOpen,    color: 'text-indigo-600 bg-indigo-100', label: 'Dars',       path: (id) => `/lessons/${id}` },
  vocab:   { icon: Sparkles,    color: 'text-emerald-600 bg-emerald-100', label: 'So\'z',   path: (id) => `/vocabulary` },
  test:    { icon: FileCheck2,  color: 'text-violet-600 bg-violet-100',  label: 'Mock Test', path: (id) => `/mock-exam` },
  game:    { icon: Gamepad2,    color: 'text-amber-600 bg-amber-100',    label: 'O\'yin',    path: (id) => `/games` },
}

const LEVEL_COLORS = {
  A0:'bg-slate-100 text-slate-600', A1:'bg-emerald-100 text-emerald-700',
  A2:'bg-sky-100 text-sky-700',     B1:'bg-indigo-100 text-indigo-700',
  B2:'bg-violet-100 text-violet-700',C1:'bg-amber-100 text-amber-700',
}

const GAMES_LIST = [
  { id:'word_match',  title:'Word Match',         desc:'Inglizcha so\'zlarni o\'zbekcha bilan moslang' },
  { id:'hangman',     title:'Hangman',             desc:'Harf-harf topib so\'zni toping' },
  { id:'grammar',     title:'Grammar Quiz',        desc:'15 soniyada grammatika savollari' },
  { id:'anagram',     title:'Anagram',             desc:'Aralashtirilgan harflardan so\'z tuzing' },
  { id:'spelling',    title:'Spelling Bee',        desc:'AI so\'z aytadi, siz yozasiz' },
  { id:'fill_blank',  title:'Fill the Blank',      desc:'Bo\'sh joyga mos so\'zni tanlang' },
  { id:'idiom',       title:'Idiom Match',         desc:'Idiomalarni ma\'nosi bilan moslang' },
  { id:'preposition', title:'Preposition Hunt',    desc:'In/on/at — to\'g\'ri ko\'makchini toping' },
  { id:'synonym',     title:'Synonym Storm',       desc:'15 soniyada barcha sinonimlarni toping' },
  { id:'category',    title:'Category Sort',       desc:'So\'zlarni to\'g\'ri kategoriyaga joylashtiring' },
  { id:'tense',       title:'Tense Transformer',   desc:'Gaplarni bir zamondan boshqasiga o\'tkazing' },
  { id:'definition',  title:'Definition Quiz',     desc:'Ta\'rifga mos keladigan so\'zni toping' },
  { id:'sentence',    title:'Sentence Builder',    desc:'Aralashtirilgan so\'zlarni tartibga soling' },
  { id:'word_snake',  title:'Word Snake',          desc:'Oxirgi harfdan boshlanadigan so\'z aytib ketaylik' },
  { id:'vocab_race',  title:'Vocab Race',          desc:'60 soniyada so\'z ma\'nolarini toping' },
]

// ── Recent searches ────────────────────────────────────────────────────────────
const RECENT_KEY = 'lingify_recent_searches'
function getRecent() { try { return JSON.parse(localStorage.getItem(RECENT_KEY)||'[]') } catch { return [] } }
function saveRecent(term) {
  const prev = getRecent().filter((r) => r !== term)
  localStorage.setItem(RECENT_KEY, JSON.stringify([term, ...prev].slice(0,8)))
}
function clearRecent() { localStorage.removeItem(RECENT_KEY) }

// ── Result item ────────────────────────────────────────────────────────────────
function ResultItem({ item, query, onClick }) {
  const meta = CATEGORY_META[item.type] || CATEGORY_META.lesson
  const Icon = meta.icon

  function highlight(text = '', q = '') {
    if (!q.trim()) return text
    const idx = text.toLowerCase().indexOf(q.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <mark className="rounded bg-yellow-200 px-0.5 text-yellow-900 not-italic">{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    )
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 3 }}
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3.5 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.color}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-slate-900">{highlight(item.title, query)}</p>
          {item.level && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${LEVEL_COLORS[item.level] || 'bg-slate-100 text-slate-500'}`}>
              {item.level}
            </span>
          )}
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.color}`}>
            {meta.label}
          </span>
        </div>
        {item.desc && (
          <p className="mt-0.5 truncate text-xs text-slate-500">{highlight(item.desc, query)}</p>
        )}
      </div>
      {item.xp && (
        <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-indigo-600">
          <Zap size={11} />+{item.xp}
        </span>
      )}
      <ChevronRight size={15} className="shrink-0 text-slate-300" />
    </motion.button>
  )
}

// ── Quick suggestions ──────────────────────────────────────────────────────────
const QUICK_TOPICS = [
  { label: '📚 IELTS testlar',       query: 'IELTS' },
  { label: '🔤 Present Perfect',     query: 'Present Perfect' },
  { label: '💬 Speaking mashq',      query: 'speaking' },
  { label: '🎮 Grammar Quiz',        query: 'Grammar Quiz' },
  { label: '📝 Vocabulary',          query: 'vocabulary' },
  { label: '⚡ Past Simple',        query: 'Past Simple' },
  { label: '🏆 Cambridge IELTS 11', query: 'Cambridge' },
  { label: '🌪️ Synonym',           query: 'Synonym' },
]

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────────────────────────────────────────
function SearchPage() {
  const navigate      = useNavigate()
  const [params, setParams] = useSearchParams()
  const inputRef      = useRef(null)
  const { words }     = useVocabulary()

  const [query,   setQuery]   = useState(params.get('q') || '')
  const [recent,  setRecent]  = useState(getRecent)
  const [activeFilter, setFilter] = useState('Hammasi')

  useEffect(() => { inputRef.current?.focus() }, [])

  // Sync URL
  useEffect(() => {
    if (query.trim()) setParams({ q: query }, { replace: true })
    else setParams({}, { replace: true })
  }, [query])

  // Build search index
  const searchIndex = useMemo(() => {
    const items = []

    // Lessons
    curriculum.forEach((l) => items.push({
      id:    l.id,
      type:  'lesson',
      title: l.title,
      desc:  `${l.level} · ${l.unitTitle} · ${l.duration}`,
      level: l.level,
      xp:    l.xp,
      path:  `/lessons/${l.id}`,
      searchText: `${l.title} ${l.description || ''} ${l.unitTitle} ${l.level}`.toLowerCase(),
    }))

    // Vocabulary words
    words.slice(0, 300).forEach((w) => items.push({
      id:    w.id,
      type:  'vocab',
      title: w.word,
      desc:  w.translation ? `🇺🇿 ${w.translation}` : w.definition?.slice(0, 60),
      level: w.level,
      xp:    null,
      path:  '/vocabulary',
      searchText: `${w.word} ${w.translation || ''} ${w.definition || ''}`.toLowerCase(),
    }))

    // Tests
    TEST_CATALOG.forEach((t) => items.push({
      id:    t.id,
      type:  'test',
      title: t.title,
      desc:  `${t.type} · ${t.level} · ${t.totalTime} daqiqa`,
      level: null,
      xp:    50,
      path:  t.available ? `/mock-test/${t.id}` : '/mock-exam',
      searchText: `${t.title} ${t.type} ${t.level}`.toLowerCase(),
    }))

    // Games
    GAMES_LIST.forEach((g) => items.push({
      id:    g.id,
      type:  'game',
      title: g.title,
      desc:  g.desc,
      level: null,
      xp:    80,
      path:  '/games',
      searchText: `${g.title} ${g.desc}`.toLowerCase(),
    }))

    return items
  }, [words])

  // Filter results
  const FILTER_TYPES = { 'Hammasi': null, 'Darslar': 'lesson', 'So\'zlar': 'vocab', 'Testlar': 'test', 'O\'yinlar': 'game' }

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    let res = searchIndex.filter((item) => item.searchText.includes(q))
    if (FILTER_TYPES[activeFilter]) res = res.filter((item) => item.type === FILTER_TYPES[activeFilter])
    return res.slice(0, 30)
  }, [query, searchIndex, activeFilter])

  // Group by type
  const grouped = useMemo(() => {
    const g = {}
    results.forEach((r) => { if (!g[r.type]) g[r.type] = []; g[r.type].push(r) })
    return g
  }, [results])

  const TYPE_LABELS = { lesson:'Darslar', vocab:'So\'zlar', test:'Testlar', game:'O\'yinlar' }

  function handleSelect(item) {
    saveRecent(query)
    setRecent(getRecent())
    navigate(item.path)
  }

  function handleRecentClick(term) {
    setQuery(term)
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top search bar ── */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 transition">
            <X size={16} className="text-slate-500" />
          </button>

          {/* Search input */}
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') { setQuery(''); navigate(-1) } }}
              placeholder="Dars, so'z, test, o'yin qidirish..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm font-medium outline-none focus:border-indigo-400 focus:bg-white transition"
            />
            {query && (
              <button onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Filter pills — only when results */}
        {query && (
          <div className="mx-auto mt-3 flex max-w-3xl gap-2 overflow-x-auto pb-0.5">
            {Object.keys(FILTER_TYPES).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeFilter === f ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
                }`}>
                {f}
                {f !== 'Hammasi' && (
                  <span className="ml-1 opacity-60">
                    ({results.filter((r) => r.type === FILTER_TYPES[f]).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6">

        {/* ── No query: show recent + suggestions ── */}
        {!query && (
          <div className="space-y-6">
            {/* Recent searches */}
            {recent.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-black text-slate-700">
                    <Clock size={14} className="text-slate-400" />So'nggi qidiruvlar
                  </h3>
                  <button onClick={() => { clearRecent(); setRecent([]) }}
                    className="text-xs text-slate-400 hover:text-red-500 transition">Tozalash</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <button key={r} onClick={() => handleRecentClick(r)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700 transition shadow-sm">
                      <Clock size={11} className="text-slate-300" />{r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick topics */}
            <div>
              <h3 className="mb-3 text-sm font-black text-slate-700">Mashhur qidiruvlar</h3>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {QUICK_TOPICS.map(({ label, query: q }) => (
                  <motion.button key={q} whileHover={{ y:-1 }}
                    onClick={() => setQuery(q)}
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 shadow-sm hover:border-indigo-300 hover:text-indigo-700 transition">
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content overview */}
            <div>
              <h3 className="mb-3 text-sm font-black text-slate-700">Nima qidirishingiz mumkin?</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { type:'lesson', count: curriculum.length, label: 'Ta\'lim darslari', Icon: BookOpen, color:'indigo' },
                  { type:'vocab',  count: '500+',            label: 'Vocabulary so\'zlari', Icon: Sparkles, color:'emerald' },
                  { type:'test',   count: TEST_CATALOG.length, label: 'Mock testlar',    Icon: Trophy, color:'violet' },
                  { type:'game',   count: GAMES_LIST.length, label: 'O\'yin turlari',   Icon: Gamepad2, color:'amber' },
                ].map(({ type, count, label, Icon, color }) => (
                  <button key={type} onClick={() => { setFilter(Object.keys(FILTER_TYPES).find((k) => FILTER_TYPES[k] === type) || 'Hammasi'); setQuery('a') }}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-slate-300 hover:shadow-md transition">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-${color}-100 text-${color}-600`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-900">{count}</p>
                      <p className="text-xs text-slate-500">{label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {query && (
          <div>
            <p className="mb-4 text-xs text-slate-400">
              {results.length > 0
                ? <><span className="font-bold text-slate-700">{results.length}</span> ta natija — "<span className="text-indigo-600">{query}</span>"</>
                : `"${query}" bo'yicha natija topilmadi`}
            </p>

            {results.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <Search size={48} className="mb-4 text-slate-200" />
                <p className="text-lg font-bold text-slate-600">Natija topilmadi</p>
                <p className="mt-1 text-sm text-slate-400">Boshqa kalit so'z bilan urinib ko'ring</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {['grammar','ielts','speaking','vocabulary'].map((s) => (
                    <button key={s} onClick={() => setQuery(s)}
                      className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : activeFilter !== 'Hammasi' ? (
              /* Filtered: flat list */
              <div className="space-y-2">
                {results.map((item) => (
                  <ResultItem key={item.id + item.type} item={item} query={query} onClick={() => handleSelect(item)} />
                ))}
              </div>
            ) : (
              /* Grouped by type */
              <div className="space-y-6">
                {Object.entries(grouped).map(([type, items]) => (
                  <div key={type}>
                    <h3 className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                      {(() => { const Icon = CATEGORY_META[type]?.icon || BookOpen; return <Icon size={13} /> })()}
                      {TYPE_LABELS[type] || type}
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{items.length}</span>
                    </h3>
                    <div className="space-y-2">
                      {items.slice(0, 5).map((item) => (
                        <ResultItem key={item.id + item.type} item={item} query={query} onClick={() => handleSelect(item)} />
                      ))}
                      {items.length > 5 && (
                        <button onClick={() => setFilter(Object.keys(FILTER_TYPES).find((k) => FILTER_TYPES[k] === type) || 'Hammasi')}
                          className="w-full rounded-xl border border-dashed border-slate-200 py-2 text-xs font-semibold text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition">
                          + {items.length - 5} ta ko'proq ko'rish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
