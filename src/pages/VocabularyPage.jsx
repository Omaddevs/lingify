import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BookOpenCheck, Brain, Check, ChevronDown, ChevronLeft,
  ChevronRight, Flame, FolderPlus, GraduationCap, List,
  Plus, RotateCcw, Search, SlidersHorizontal, Star,
  Trash2, Volume2, X, Zap, LayoutGrid,
} from 'lucide-react'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'
import { useVocabulary } from '../hooks/useVocabulary'

const LEVELS_FILTER = ['Hammasi', 'Beginner', 'Intermediate', 'Advanced', 'C1']
const MASTERY_FILTER = ['Hammasi', 'Yangi', 'O\'rganilmoqda', 'O\'zlashtirildi']
const SORT_OPTIONS   = ['A→Z', 'Z→A', 'Yangi birinchi', 'Eski birinchi', 'Daraja bo\'yicha']
const WORDS_PER_PAGE = 24

const MASTERY_META = [
  { label: 'Yangi',          bg: 'bg-slate-100',   text: 'text-slate-600',   dot: 'bg-slate-400' },
  { label: 'Boshlandi',      bg: 'bg-red-100',     text: 'text-red-600',     dot: 'bg-red-400' },
  { label: 'O\'rtacha',      bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-400' },
  { label: 'Yaxshi',         bg: 'bg-sky-100',     text: 'text-sky-700',     dot: 'bg-sky-400' },
  { label: 'Zo\'r',          bg: 'bg-indigo-100',  text: 'text-indigo-700',  dot: 'bg-indigo-400' },
  { label: 'Mukammal',       bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
]

const FOLDER_EMOJIS = ['📚', '📝', '💼', '🔬', '🎯', '⭐', '🌍', '💡', '🎓', '🔥', '🌿', '💎']
const FOLDER_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#f97316','#84cc16','#14b8a6']

// ── Reset seed helper ─────────────────────────────────────────────────────────
function resetAndReload() {
  localStorage.removeItem('lingify_vocabulary')
  localStorage.removeItem('lingify_vocab_folders')
  localStorage.removeItem('lingify_vocab_seeded_v2')
  window.location.reload()
}

// ── Add Word Modal ────────────────────────────────────────────────────────────
function AddWordModal({ folders, onAdd, onClose }) {
  const [word,         setWord]       = useState('')
  const [definition,   setDef]        = useState('')
  const [translation,  setTrans]      = useState('')
  const [example,      setEx]         = useState('')
  const [pronunciation,setPron]       = useState('')
  const [level,        setLevel]      = useState('Intermediate')
  const [folderId,     setFolderId]   = useState('')
  const wordRef = useRef(null)

  function speakPreview() {
    if (!word.trim()) return
    window.speechSynthesis?.cancel()
    const u = new SpeechSynthesisUtterance(word.trim())
    u.lang = 'en-US'; u.rate = 0.82
    window.speechSynthesis?.speak(u)
  }

  function submit() {
    if (!word.trim()) { wordRef.current?.focus(); return }
    onAdd({ word, definition, translation, example, pronunciation, level, folderId: folderId || null })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100">
              <Plus size={15} className="text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-900">Yangi so'z qo'shish</h3>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"><X size={16} /></button>
        </div>

        <div className="space-y-3.5 px-6 py-5">
          {/* Word */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">So'z (inglizcha) *</label>
            <div className="flex gap-2">
              <input ref={wordRef} value={word} onChange={(e) => setWord(e.target.value)}
                placeholder="e.g. Meticulous"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
              <button onClick={speakPreview} disabled={!word.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 transition">
                <Volume2 size={15} />
              </button>
            </div>
          </div>

          {/* Pronunciation */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">Talaffuz (IPA, ixtiyoriy)</label>
            <input value={pronunciation} onChange={(e) => setPron(e.target.value)}
              placeholder="e.g. mɪˈtɪkjʊləs"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-mono outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
          </div>

          {/* Translation */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">O'zbekcha tarjimasi</label>
            <input value={translation} onChange={(e) => setTrans(e.target.value)}
              placeholder="Puxta, e'tiborli..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
          </div>

          {/* Definition */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">Ta'rifi (inglizcha)</label>
            <textarea value={definition} onChange={(e) => setDef(e.target.value)}
              placeholder="Showing great attention to detail..."
              rows={2} className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
          </div>

          {/* Example */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">Misol gap</label>
            <input value={example} onChange={(e) => setEx(e.target.value)}
              placeholder="She was meticulous in her work."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-600">Daraja</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400">
                {['Beginner','Intermediate','Advanced','C1'].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-600">Papka</label>
              <select value={folderId} onChange={(e) => setFolderId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400">
                <option value="">— Papkasiz —</option>
                {folders.map((f) => <option key={f.id} value={f.id}>{f.emoji} {f.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Bekor</button>
          <button onClick={submit} disabled={!word.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 py-2.5 text-sm font-bold text-white disabled:opacity-40">
            <Check size={14} />Qo'shish
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Add Folder Modal ──────────────────────────────────────────────────────────
function AddFolderModal({ onAdd, onClose }) {
  const [name,  setName]  = useState('')
  const [color, setColor] = useState(FOLDER_COLORS[0])
  const [emoji, setEmoji] = useState(FOLDER_EMOJIS[0])

  function submit() { if (!name.trim()) return; onAdd(name.trim(), color, emoji); onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
        className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-slate-900">Yangi papka</h3>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X size={16} /></button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-2 block text-xs font-bold text-slate-600">Emoji</label>
            <div className="flex flex-wrap gap-2">
              {FOLDER_EMOJIS.map((e) => (
                <button key={e} onClick={() => setEmoji(e)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg transition ${emoji === e ? 'bg-indigo-100 ring-2 ring-indigo-400' : 'hover:bg-slate-100'}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold text-slate-600">Rang</label>
            <div className="flex flex-wrap gap-2">
              {FOLDER_COLORS.map((c) => (
                <button key={c} onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition ${color === c ? 'ring-2 ring-offset-2' : 'hover:scale-110'}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">Papka nomi *</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: IELTS So'zlari" autoFocus
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
            <span className="text-2xl">{emoji}</span>
            <span className="font-semibold text-slate-800">{name || 'Papka nomi'}</span>
            <span className="ml-auto h-3 w-3 rounded-full" style={{ background: color }} />
          </div>
        </div>
        <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700">Bekor</button>
          <button onClick={submit} disabled={!name.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 py-2.5 text-sm font-bold text-white disabled:opacity-40">
            <FolderPlus size={14} />Yaratish
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Word Card ─────────────────────────────────────────────────────────────────
function WordCard({ word, onDelete, onSpeak, view = 'grid' }) {
  const [expanded, setExpanded] = useState(false)
  const m = MASTERY_META[word.mastery || 0]

  if (view === 'list') {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 transition hover:border-indigo-200 hover:shadow-sm">
        {/* Progress dots */}
        <div className="flex shrink-0 gap-0.5">
          {[0,1,2,3,4,5].map((i) => (
            <span key={i} className={`h-2 w-2 rounded-full ${i < (word.mastery||0) ? 'bg-indigo-500' : 'bg-slate-100'}`} />
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-slate-900">{word.word}</p>
            {word.pronunciation && (
              <span className="text-[11px] text-slate-400 font-mono">/{word.pronunciation}/</span>
            )}
            <button onClick={() => onSpeak(word.word)} className="text-slate-300 hover:text-indigo-500 transition">
              <Volume2 size={12} />
            </button>
          </div>
          {word.translation && <p className="text-xs font-semibold text-emerald-700">🇺🇿 {word.translation}</p>}
        </div>

        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${m.bg} ${m.text}`}>
          {m.label}
        </span>

        <div className="flex shrink-0 items-center gap-1">
          <span className="text-[10px] text-slate-300">{word.level}</span>
          <button onClick={() => onDelete(word.id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="font-bold text-slate-900">{word.word}</p>
            <button onClick={() => onSpeak(word.word)} className="text-slate-300 hover:text-indigo-500 transition">
              <Volume2 size={12} />
            </button>
          </div>
          {word.pronunciation && (
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">/{word.pronunciation}/</p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${m.bg} ${m.text}`}>{m.label}</span>
          <button onClick={() => onDelete(word.id)}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-200 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition">
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Translation */}
      {word.translation && (
        <p className="text-xs font-semibold text-emerald-700 mb-1">🇺🇿 {word.translation}</p>
      )}

      {/* Definition */}
      {word.definition && (
        <p className="text-xs text-slate-500 leading-5 line-clamp-2">{word.definition}</p>
      )}

      {/* Example (expand) */}
      {word.example && (
        <button onClick={() => setExpanded((v) => !v)}
          className="mt-2 flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-600 transition">
          <ChevronRight size={10} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
          Misol
        </button>
      )}

      <AnimatePresence>
        {expanded && word.example && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
            className="overflow-hidden">
            <p className="mt-1.5 rounded-xl bg-slate-50 px-3 py-2 text-xs italic text-slate-600">
              "{word.example}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level + mastery bar */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] font-semibold text-slate-300">{word.level}</span>
        <div className="flex flex-1 gap-0.5">
          {[0,1,2,3,4,5].map((i) => (
            <span key={i} className={`h-1 flex-1 rounded-full ${i < (word.mastery||0) ? 'bg-indigo-400' : 'bg-slate-100'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function VocabularyPage() {
  const navigate = useNavigate()
  const { words, folders, addWord, deleteWord, addFolder, speakWord, totalWords, masteredWords, dueCount } = useVocabulary()

  const [search,        setSearch]       = useState('')
  const [activeFolder,  setActiveFolder] = useState('all')
  const [levelFilter,   setLevelFilter]  = useState('Hammasi')
  const [masteryFilter, setMasteryFilter]= useState('Hammasi')
  const [sortBy,        setSortBy]       = useState('Yangi birinchi')
  const [page,          setPage]         = useState(1)
  const [viewMode,      setViewMode]     = useState('grid')   // grid | list
  const [showAddWord,   setShowAddWord]  = useState(false)
  const [showAddFolder, setShowAddFolder]= useState(false)
  const [showFilters,   setShowFilters]  = useState(false)

  // Reset page on filter change
  useEffect(() => setPage(1), [search, activeFolder, levelFilter, masteryFilter, sortBy])

  const MASTERY_GROUP = { 'Yangi': [0], 'O\'rganilmoqda': [1,2,3], 'O\'zlashtirildi': [4,5] }

  const filtered = useMemo(() => {
    let res = [...words]
    if (activeFolder !== 'all') res = res.filter((w) => w.folderId === activeFolder)
    if (levelFilter !== 'Hammasi') res = res.filter((w) => w.level === levelFilter)
    if (masteryFilter !== 'Hammasi') {
      const mg = MASTERY_GROUP[masteryFilter] || []
      res = res.filter((w) => mg.includes(w.mastery || 0))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      res = res.filter((w) =>
        w.word.toLowerCase().includes(q) ||
        w.translation?.toLowerCase().includes(q) ||
        w.definition?.toLowerCase().includes(q)
      )
    }
    switch (sortBy) {
      case 'A→Z':              res.sort((a,b) => a.word.localeCompare(b.word)); break
      case 'Z→A':              res.sort((a,b) => b.word.localeCompare(a.word)); break
      case 'Yangi birinchi':   res.sort((a,b) => (b.createdAt||0) - (a.createdAt||0)); break
      case 'Eski birinchi':    res.sort((a,b) => (a.createdAt||0) - (b.createdAt||0)); break
      case 'Daraja bo\'yicha': res.sort((a,b) => (a.mastery||0) - (b.mastery||0)); break
    }
    return res
  }, [words, activeFolder, levelFilter, masteryFilter, search, sortBy])

  const totalPages  = Math.ceil(filtered.length / WORDS_PER_PAGE)
  const paginated   = filtered.slice((page-1)*WORDS_PER_PAGE, page*WORDS_PER_PAGE)

  // Folder stats
  const folderStats = useMemo(() => {
    const map = {}
    folders.forEach((f) => {
      const fWords = words.filter((w) => w.folderId === f.id)
      map[f.id] = {
        total:    fWords.length,
        mastered: fWords.filter((w) => (w.mastery||0) >= 4).length,
        pct:      fWords.length ? Math.round((fWords.filter((w) => (w.mastery||0) >= 4).length / fWords.length) * 100) : 0,
      }
    })
    return map
  }, [words, folders])

  const overallPct = totalWords ? Math.round((masteredWords / totalWords) * 100) : 0

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <AnimatePresence>
        {showAddWord   && <AddWordModal   folders={folders} onAdd={addWord}  onClose={() => setShowAddWord(false)} />}
        {showAddFolder && <AddFolderModal onAdd={(n,c,e) => { addFolder(n,c,e); setShowAddFolder(false) }} onClose={() => setShowAddFolder(false)} />}
      </AnimatePresence>

      <div className="flex w-full gap-5">
        <Sidebar />

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">

          {/* ── Header ── */}
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <Header title="Lug'at" subtitle="500+ so'z · 5 ta papka · O'zbek tilida izohlar" />
            <div className="flex shrink-0 gap-2">
              <button onClick={() => setShowAddFolder(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                <FolderPlus size={13} />Papka
              </button>
              <button onClick={() => setShowAddWord(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-3 py-2 text-xs font-bold text-white shadow-sm hover:shadow-md transition">
                <Plus size={13} />So'z qo'shish
              </button>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Jami so\'zlar',    value: totalWords,    sub: '5 ta papka', icon: BookOpenCheck, color: 'bg-indigo-50 text-indigo-600' },
              { label: 'O\'zlashtirildi',  value: `${masteredWords}`,sub: `${overallPct}% daraja`, icon: Star,         color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Bugun takrorlash', value: dueCount,      sub: 'SM-2 algoritm', icon: Brain,     color: 'bg-amber-50 text-amber-600' },
              { label: 'Barcha kategoriya',value: folders.length,sub: 'faol papka', icon: GraduationCap,color: 'bg-violet-50 text-violet-600' },
            ].map(({ label, value, sub, icon: Icon, color }) => (
              <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
                  <Icon size={16} />
                </div>
                <p className="text-2xl font-black text-slate-900">{value}</p>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-[11px] text-slate-300">{sub}</p>
              </article>
            ))}
          </div>

          {/* ── Progress bar overall ── */}
          <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-800">Umumiy progress</span>
              <span className="font-black text-indigo-700">{overallPct}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <motion.div initial={{ width:0 }} animate={{ width:`${overallPct}%`}} transition={{ duration:0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600" />
            </div>
            <p className="mt-1.5 text-xs text-slate-400">{masteredWords} ta o'zlashtirildi · {totalWords - masteredWords} ta qoldi</p>
          </div>

          {/* ── Flashcard CTA ── */}
          {dueCount > 0 && (
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
              className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 p-4 shadow-md">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-indigo-200">SM-2 Spaced Repetition</p>
                  <p className="mt-0.5 text-lg font-black text-white">
                    🧠 {dueCount} ta so'z takrorlashni kutmoqda
                  </p>
                </div>
                <button onClick={() => navigate('/flashcards')}
                  className="flex shrink-0 items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-black text-indigo-700 shadow-md hover:shadow-lg transition">
                  <Zap size={13} />Boshlash
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Body: Folders + Words ── */}
          <div className="grid gap-5 lg:grid-cols-[280px_1fr]">

            {/* ── Folders sidebar ── */}
            <aside className="space-y-2">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-700">Papkalar</h3>
                <button onClick={() => setShowAddFolder(true)} className="text-xs font-semibold text-indigo-600 hover:underline">+ Yangi</button>
              </div>

              {/* All words */}
              <button onClick={() => setActiveFolder('all')}
                className={`flex w-full items-center gap-2.5 rounded-2xl px-3 py-3 text-left transition ${activeFolder === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50'}`}>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-lg">📖</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">Barcha so'zlar</p>
                  <p className={`text-[11px] ${activeFolder === 'all' ? 'text-indigo-200' : 'text-slate-400'}`}>{totalWords} ta so'z</p>
                </div>
                <span className={`text-sm font-black ${activeFolder === 'all' ? 'text-white' : 'text-slate-400'}`}>{totalWords}</span>
              </button>

              {/* Folder items */}
              {folders.map((folder) => {
                const fs = folderStats[folder.id] || { total:0, mastered:0, pct:0 }
                const isActive = activeFolder === folder.id
                return (
                  <button key={folder.id} onClick={() => setActiveFolder(folder.id)}
                    className={`flex w-full items-center gap-2.5 rounded-2xl px-3 py-3 text-left transition ${isActive ? 'text-white shadow-md' : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50'}`}
                    style={isActive ? { background: folder.color } : {}}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
                      {folder.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-bold">{folder.name}</p>
                      <div className={`mt-1 h-1.5 w-full overflow-hidden rounded-full ${isActive ? 'bg-white/25' : 'bg-slate-100'}`}>
                        <div className={`h-full rounded-full ${isActive ? 'bg-white' : 'bg-indigo-400'}`} style={{ width:`${fs.pct}%` }} />
                      </div>
                    </div>
                    <span className={`shrink-0 text-sm font-black ${isActive ? 'text-white' : 'text-slate-400'}`}>{fs.total}</span>
                  </button>
                )
              })}

              {/* Study this folder */}
              {activeFolder !== 'all' && (
                <button onClick={() => navigate(`/flashcards?folder=${activeFolder}`)}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-100 transition">
                  <Brain size={14} />Bu papkani o'rganish
                </button>
              )}

              {/* Reset seed */}
              <button onClick={resetAndReload}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-200 py-2 text-[11px] text-slate-400 hover:border-slate-300 hover:text-slate-600 transition">
                <RotateCcw size={11} />So'zlarni qayta yuklash
              </button>
            </aside>

            {/* ── Words area ── */}
            <div>
              {/* Search + Filter + Sort toolbar */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="So'z, tarjima yoki ta'rif bo'yicha..."
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-indigo-300 focus:bg-white" />
                    {search && (
                      <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Filter toggle */}
                  <button onClick={() => setShowFilters((v) => !v)}
                    className={`flex h-10 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition ${showFilters ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    <SlidersHorizontal size={13} />Filter
                    {(levelFilter !== 'Hammasi' || masteryFilter !== 'Hammasi') && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-black text-white">!</span>
                    )}
                  </button>

                  {/* Sort */}
                  <div className="relative">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                      className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-7 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-300">
                      {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>

                  {/* View mode */}
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                    <button onClick={() => setViewMode('grid')}
                      className={`flex h-10 w-10 items-center justify-center transition ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
                      <LayoutGrid size={14} />
                    </button>
                    <button onClick={() => setViewMode('list')}
                      className={`flex h-10 w-10 items-center justify-center transition ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
                      <List size={14} />
                    </button>
                  </div>
                </div>

                {/* Filter pills */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Daraja</p>
                          <div className="flex flex-wrap gap-1.5">
                            {LEVELS_FILTER.map((l) => (
                              <button key={l} onClick={() => setLevelFilter(l)}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${levelFilter === l ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-300'}`}>
                                {l}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Holat</p>
                          <div className="flex flex-wrap gap-1.5">
                            {MASTERY_FILTER.map((f) => (
                              <button key={f} onClick={() => setMasteryFilter(f)}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${masteryFilter === f ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-300'}`}>
                                {f}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      {(levelFilter !== 'Hammasi' || masteryFilter !== 'Hammasi') && (
                        <button onClick={() => { setLevelFilter('Hammasi'); setMasteryFilter('Hammasi') }}
                          className="mt-3 text-xs font-semibold text-red-500 hover:underline flex items-center gap-1">
                          <X size={11} />Filterlarni tozalash
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Result count */}
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  <span className="font-bold text-slate-700">{filtered.length}</span> ta so'z topildi
                  {search && <span> · "<span className="text-indigo-600">{search}</span>" qidiruvi</span>}
                </p>
                {totalPages > 1 && (
                  <p className="text-xs text-slate-400">
                    Sahifa <span className="font-bold text-slate-700">{page}</span> / {totalPages}
                  </p>
                )}
              </div>

              {/* Words grid/list */}
              {paginated.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center text-slate-400">
                  <BookOpenCheck size={40} className="mb-3 opacity-30" />
                  <p className="font-semibold">So'z topilmadi</p>
                  {search && <p className="mt-1 text-sm">"{search}" bo'yicha natija yo'q</p>}
                  <button onClick={() => setShowAddWord(true)}
                    className="mt-4 flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white">
                    <Plus size={13} />Yangi so'z qo'shish
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid'
                  ? 'grid gap-3 sm:grid-cols-2 xl:grid-cols-3'
                  : 'space-y-2'}>
                  {paginated.map((word) => (
                    <WordCard key={word.id} word={word} view={viewMode}
                      onDelete={deleteWord} onSpeak={speakWord} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page === 1}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition">
                    <ChevronLeft size={15} />
                  </button>

                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p = totalPages <= 7 ? i+1 : page <= 4 ? i+1 : page >= totalPages-3 ? totalPages-6+i : page-3+i
                    return (
                      <button key={p} onClick={() => setPage(p)}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition ${page === p ? 'bg-indigo-600 text-white shadow-md' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {p}
                      </button>
                    )
                  })}

                  <button onClick={() => setPage((p) => Math.min(totalPages, p+1))} disabled={page === totalPages}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition">
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}

              <div className="pb-16 xl:pb-0" />
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default VocabularyPage
