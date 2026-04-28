import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BookOpenCheck,
  Brain,
  Check,
  ChevronRight,
  Flame,
  FolderPlus,
  Plus,
  Search,
  Star,
  Trash2,
  Volume2,
  X,
  Zap,
} from 'lucide-react'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'
import { useVocabulary } from '../hooks/useVocabulary'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const FOLDER_EMOJIS = ['📚', '📝', '💼', '🔬', '🎯', '⭐', '🌍', '💡', '🎓', '🔥']
const FOLDER_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316']

// ── Add Word Modal ──────────────────────────────────────────────────────────
function AddWordModal({ folders, onAdd, onClose }) {
  const [word, setWord] = useState('')
  const [definition, setDefinition] = useState('')
  const [translation, setTranslation] = useState('')
  const [example, setExample] = useState('')
  const [level, setLevel] = useState('Intermediate')
  const [folderId, setFolderId] = useState('')
  const wordRef = useRef(null)

  function speakPreview() {
    if (!word.trim()) return
    window.speechSynthesis?.cancel()
    const utt = new SpeechSynthesisUtterance(word.trim())
    utt.lang = 'en-US'
    utt.rate = 0.8
    window.speechSynthesis?.speak(utt)
  }

  function handleSubmit() {
    if (!word.trim()) { wordRef.current?.focus(); return }
    onAdd({ word, definition, translation, example, level, folderId: folderId || null })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-slate-900">Yangi so'z qo'shish</h3>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {/* Word */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              So'z (inglizcha) *
            </label>
            <div className="flex gap-2">
              <input
                ref={wordRef}
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="e.g. Meticulous"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="button"
                onClick={speakPreview}
                disabled={!word.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30"
              >
                <Volume2 size={15} />
              </button>
            </div>
          </div>

          {/* Definition */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Ta'rifi (inglizcha)
            </label>
            <textarea
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Showing great attention to detail..."
              rows={2}
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Translation */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              O'zbekcha tarjimasi
            </label>
            <input
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Puxta, e'tiborli..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Example */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Misol gap
            </label>
            <input
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder="She is meticulous in her work."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Level */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Daraja</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
              >
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>

            {/* Folder */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Papka</label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
              >
                <option value="">— Papkasiz —</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.emoji} {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSubmit}
            disabled={!word.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            <Check size={14} />
            Qo'shish
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Add Folder Modal ─────────────────────────────────────────────────────────
function AddFolderModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(FOLDER_COLORS[0])
  const [emoji, setEmoji] = useState(FOLDER_EMOJIS[0])

  function handleSubmit() {
    if (!name.trim()) return
    onAdd(name.trim(), color, emoji)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-slate-900">Yangi papka</h3>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {/* Emoji picker */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-600">Emoji</label>
            <div className="flex flex-wrap gap-2">
              {FOLDER_EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition ${
                    emoji === e ? 'bg-indigo-100 ring-2 ring-indigo-400' : 'hover:bg-slate-100'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-600">Rang</label>
            <div className="flex gap-2">
              {FOLDER_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full transition ${
                    color === c ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={{ background: c, ringColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Papka nomi *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: IELTS So'zlari"
              autoFocus
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Preview */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
            <span className="text-2xl">{emoji}</span>
            <span className="font-semibold text-slate-800">{name || 'Papka nomi'}</span>
            <span
              className="ml-auto h-3 w-3 rounded-full"
              style={{ background: color }}
            />
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            <FolderPlus size={14} />
            Yaratish
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Word Card ────────────────────────────────────────────────────────────────
function WordCard({ word, onDelete, onSpeak }) {
  const [expanded, setExpanded] = useState(false)

  const MASTERY_LABELS = ['Yangi', 'Boshlandi', 'O\'rtacha', 'Yaxshi', 'Zo\'r', 'Mukammal']
  const MASTERY_COLORS = [
    'bg-slate-200 text-slate-600',
    'bg-red-100 text-red-600',
    'bg-amber-100 text-amber-600',
    'bg-sky-100 text-sky-600',
    'bg-indigo-100 text-indigo-600',
    'bg-emerald-100 text-emerald-700',
  ]

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-900">{word.word}</p>
            <button
              type="button"
              onClick={() => onSpeak(word.word)}
              className="text-slate-400 hover:text-indigo-600"
            >
              <Volume2 size={13} />
            </button>
            {word.pronunciation && (
              <span className="text-xs text-slate-400">/{word.pronunciation}/</span>
            )}
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${MASTERY_COLORS[word.mastery || 0]}`}>
              {MASTERY_LABELS[word.mastery || 0]}
            </span>
          </div>

          {word.translation && (
            <p className="mt-1 text-sm font-medium text-emerald-700">🇺🇿 {word.translation}</p>
          )}

          {word.definition && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">{word.definition}</p>
          )}
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <ChevronRight size={14} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(word.id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {expanded && word.example && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 rounded-xl bg-slate-50 px-3 py-2"
        >
          <p className="text-xs font-medium text-slate-500">Misol:</p>
          <p className="mt-0.5 text-xs italic text-slate-700">"{word.example}"</p>
        </motion.div>
      )}

      <div className="mt-3 flex gap-1">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i < (word.mastery || 0) ? 'bg-indigo-500' : 'bg-slate-100'}`}
          />
        ))}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
function VocabularyPage() {
  const navigate = useNavigate()
  const {
    words,
    folders,
    addWord,
    deleteWord,
    addFolder,
    speakWord,
    totalWords,
    masteredWords,
    dueCount,
  } = useVocabulary()

  const [search, setSearch] = useState('')
  const [activeFolder, setActiveFolder] = useState('all')
  const [showAddWord, setShowAddWord] = useState(false)
  const [showAddFolder, setShowAddFolder] = useState(false)

  const filteredWords = useMemo(() => {
    let result = words
    if (activeFolder !== 'all') {
      result = result.filter((w) => w.folderId === activeFolder)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.definition?.toLowerCase().includes(q) ||
          w.translation?.toLowerCase().includes(q),
      )
    }
    return result
  }, [words, activeFolder, search])

  const stats = [
    { title: 'Jami So\'zlar', value: totalWords, note: 'Lug\'atingizda', icon: BookOpenCheck },
    { title: 'Takrorlash kerak', value: dueCount, note: 'Bugungi rejada', icon: Brain },
    { title: 'Streak', value: '12 kun', note: 'Davom eting! 🔥', icon: Flame },
    { title: 'O\'zlashtirildi', value: masteredWords, note: '5/5 darajada', icon: Star },
  ]

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      {/* Modals */}
      <AnimatePresence>
        {showAddWord && (
          <AddWordModal
            folders={folders}
            onAdd={addWord}
            onClose={() => setShowAddWord(false)}
          />
        )}
        {showAddFolder && (
          <AddFolderModal
            onAdd={(name, color, emoji) => { addFolder(name, color, emoji); setShowAddFolder(false) }}
            onClose={() => setShowAddFolder(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex w-full gap-5">
        <Sidebar />

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <Header title="Lug'at" subtitle="So'zlaringizni saqlang, o'rganing va takrorlang." />
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setShowAddFolder(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <FolderPlus size={13} />
                Papka
              </button>
              <button
                onClick={() => setShowAddWord(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-3 py-2 text-xs font-semibold text-white shadow-sm"
              >
                <Plus size={13} />
                So'z qo'shish
              </button>
            </div>
          </div>

          {/* Stats */}
          <section className="mb-4 grid gap-3 sm:grid-cols-4">
            {stats.map(({ title, value, note, icon: Icon }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-slate-400">
                  <Icon size={13} />
                  <p className="text-xs">{title}</p>
                </div>
                <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{note}</p>
              </article>
            ))}
          </section>

          {/* Flashcard CTA */}
          {dueCount > 0 && (
            <section className="mb-4 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-500 to-violet-600 p-5 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-100">Bugungi takrorlash</p>
                  <h3 className="mt-1 text-2xl font-bold">{dueCount} ta so'z tayyor</h3>
                  <p className="mt-1 text-sm text-indigo-200">Flashcard sessiyasini boshlang</p>
                </div>
                <button
                  onClick={() => navigate('/flashcards')}
                  className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 shadow-md transition hover:shadow-lg"
                >
                  <Zap size={14} />
                  Boshlash
                </button>
              </div>
            </section>
          )}

          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
            {/* Sidebar: folders */}
            <aside>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">Papkalar</h3>
                <button
                  onClick={() => setShowAddFolder(true)}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  + Yangi
                </button>
              </div>

              <div className="space-y-1.5">
                <button
                  onClick={() => setActiveFolder('all')}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    activeFolder === 'all'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">📖</span>
                  <span className="flex-1 text-left">Barcha so'zlar</span>
                  <span className="text-xs text-slate-400">{totalWords}</span>
                </button>

                {folders.map((folder) => {
                  const count = words.filter((w) => w.folderId === folder.id).length
                  return (
                    <button
                      key={folder.id}
                      onClick={() => setActiveFolder(folder.id)}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        activeFolder === folder.id
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-base">{folder.emoji}</span>
                      <span className="flex-1 truncate text-left">{folder.name}</span>
                      <span className="text-xs text-slate-400">{count}</span>
                    </button>
                  )
                })}
              </div>

              {/* Flashcard by folder */}
              {activeFolder !== 'all' && (
                <button
                  onClick={() => navigate(`/flashcards?folder=${activeFolder}`)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                >
                  <Brain size={14} />
                  Bu papkani o'rganish
                </button>
              )}
            </aside>

            {/* Main: words list */}
            <div>
              {/* Search */}
              <div className="relative mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="So'z qidirish..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-indigo-300"
                />
              </div>

              {/* Word count */}
              <p className="mb-3 text-xs text-slate-400">
                {filteredWords.length} ta so'z
              </p>

              {/* Words */}
              {filteredWords.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center text-slate-400">
                  <BookOpenCheck size={40} className="mb-3 opacity-30" />
                  {search ? (
                    <p>"{search}" bo'yicha so'z topilmadi</p>
                  ) : (
                    <>
                      <p>Hali so'z qo'shilmagan</p>
                      <button
                        onClick={() => setShowAddWord(true)}
                        className="mt-3 flex items-center gap-1 text-sm font-medium text-indigo-600"
                      >
                        <Plus size={14} />
                        Birinchi so'zni qo'shing
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid gap-3 pb-16 sm:grid-cols-2 xl:pb-0">
                  {filteredWords.map((word) => (
                    <WordCard
                      key={word.id}
                      word={word}
                      onDelete={deleteWord}
                      onSpeak={speakWord}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}

export default VocabularyPage
