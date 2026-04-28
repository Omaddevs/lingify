import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check, Clock, Filter, Flame, Globe, MessageCircleMore,
  Mic, Search, SlidersHorizontal, Star, UserCheck,
  UserMinus, UserPlus, Users, Video, X, Zap,
} from 'lucide-react'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'
import { useUser } from '../context/UserContext'

// ── Mock partner data ─────────────────────────────────────────────────────────
const ALL_PARTNERS = [
  { id: 1,  name: 'Malika Tosheva',   level: 'B2', goal: 'IELTS',    streak: 45, country: '🇺🇿', online: true,  languages: 'O\'zbek, Rus', availability: 'Evening', rating: 4.9, sessions: 34, bio: 'IELTS 7.5 maqsad. Har kuni 1 soat inglizcha gaplashaman.', age: 22 },
  { id: 2,  name: 'Jasur Karimov',    level: 'C1', goal: 'Speaking', streak: 89, country: '🇺🇿', online: true,  languages: 'O\'zbek',     availability: 'Morning', rating: 4.8, sessions: 67, bio: 'C2 darajasiga intilaman. Business English ustida ishlayapman.', age: 25 },
  { id: 3,  name: 'Dilnoza Xasanova', level: 'B1', goal: 'TOEFL',   streak: 12, country: '🇺🇿', online: false, languages: 'O\'zbek, Rus', availability: 'Afternoon', rating: 4.7, sessions: 18, bio: 'TOEFL 100+ olish uchun tayyorlanayapman. Reading bo\'limim zaif.', age: 20 },
  { id: 4,  name: 'Bobur Rahimov',    level: 'A2', goal: 'General', streak: 7,  country: '🇺🇿', online: true,  languages: 'O\'zbek',     availability: 'Evening', rating: 4.5, sessions: 9,  bio: 'Ingliz tilini noldan boshladim. Sabr bilan o\'rganaman.', age: 19 },
  { id: 5,  name: 'Zulfiya Azimova',  level: 'B2', goal: 'IELTS',   streak: 21, country: '🇺🇿', online: false, languages: 'O\'zbek, Eng', availability: 'Morning', rating: 4.9, sessions: 42, bio: 'IELTS 7.0 bor. Endi 8.0 ga intilaman. Speaking mashq qilaman.', age: 23 },
  { id: 6,  name: 'Kamol Umarov',     level: 'B1', goal: 'SAT',     streak: 33, country: '🇺🇿', online: true,  languages: 'O\'zbek, Rus', availability: 'Evening', rating: 4.6, sessions: 25, bio: 'SAT 1400+ maqsad. Math kuchli, Reading ustida ishlayapman.', age: 18 },
  { id: 7,  name: 'Feruza Nazarova',  level: 'A1', goal: 'General', streak: 5,  country: '🇺🇿', online: false, languages: 'O\'zbek',     availability: 'Afternoon', rating: 4.4, sessions: 4, bio: 'Yangi boshlandim. Sabr bilan qo\'llab-quvvatlash kerak.', age: 17 },
  { id: 8,  name: 'Sardor Mirzayev',  level: 'B2', goal: 'IELTS',  streak: 60, country: '🇺🇿', online: true,  languages: 'O\'zbek, Eng', availability: 'Morning', rating: 4.8, sessions: 55, bio: 'IELTS examiner bilan ishlagan. Yozish va gapirish bo\'yicha yordam beraman.', age: 27 },
  { id: 9,  name: 'Nilufar Xolova',   level: 'A2', goal: 'General', streak: 3,  country: '🇺🇿', online: false, languages: 'O\'zbek',     availability: 'Evening', rating: 4.3, sessions: 6, bio: 'Inglizchani professional maqsadda o\'rganmoqchiman.', age: 21 },
  { id: 10, name: 'Otabek Ismoilov',  level: 'C1', goal: 'TOEFL',  streak: 75, country: '🇺🇿', online: true,  languages: 'O\'zbek, Eng', availability: 'Morning', rating: 5.0, sessions: 89, bio: 'TOEFL 115 ball bor. Endi PhD uchun academic writing ustida.', age: 28 },
  { id: 11, name: 'Shaxlo Yusupova',  level: 'B1', goal: 'IELTS',  streak: 14, country: '🇺🇿', online: true,  languages: 'O\'zbek, Rus', availability: 'Afternoon', rating: 4.6, sessions: 21, bio: 'IELTS 6.5 maqsad. Listening va reading bo\'yicha yordam kerak.', age: 20 },
  { id: 12, name: 'Umid Toshmatov',   level: 'B2', goal: 'Speaking', streak: 28, country: '🇺🇿', online: false, languages: 'O\'zbek', availability: 'Evening', rating: 4.7, sessions: 38, bio: 'Xorijda o\'qish uchun inglizchani mukammal qilmoqchiman.', age: 24 },
]

const LEVELS   = ['Barchasi', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const GOALS    = ['Barchasi', 'IELTS', 'TOEFL', 'SAT', 'Speaking', 'General']
const TIMES    = ['Barchasi', 'Morning', 'Afternoon', 'Evening']
const TABS     = ['Partner topish', 'Mening partnerlarim', 'Kutilayotgan']

const LEVEL_COLORS = {
  A1: 'bg-emerald-100 text-emerald-700', A2: 'bg-sky-100 text-sky-700',
  B1: 'bg-indigo-100 text-indigo-700',   B2: 'bg-violet-100 text-violet-700',
  C1: 'bg-amber-100 text-amber-700',     C2: 'bg-red-100 text-red-700',
}

// ── localStorage helpers ──────────────────────────────────────────────────────
const CONNECTED_KEY = 'lingify_partners_connected'
const PENDING_KEY   = 'lingify_partners_pending'

function loadIds(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function saveIds(key, ids) { localStorage.setItem(key, JSON.stringify(ids)) }

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, online, size = 44 }) {
  const colors = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#f97316']
  const bg = colors[name.charCodeAt(0) % colors.length]
  return (
    <div className="relative shrink-0">
      <div className="flex items-center justify-center rounded-full font-bold text-white"
        style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}>
        {name[0]}
      </div>
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${online ? 'bg-emerald-400' : 'bg-slate-300'}`} />
      )}
    </div>
  )
}

// ── Partner Detail Modal ──────────────────────────────────────────────────────
function PartnerModal({ partner, connected, pending, onConnect, onDisconnect, onMessage, onClose }) {
  if (!partner) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        {/* Header gradient */}
        <div className="relative h-28 bg-gradient-to-br from-indigo-500 to-violet-600">
          <button onClick={onClose} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30">
            <X size={15} />
          </button>
          <div className="absolute -bottom-8 left-6">
            <Avatar name={partner.name} online={partner.online} size={64} />
          </div>
        </div>

        <div className="px-6 pb-6 pt-12">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">{partner.name}</h3>
                <span className="text-lg">{partner.country}</span>
              </div>
              <p className="text-xs text-slate-400">
                {partner.online ? '🟢 Hozir onlayn' : '⚫ Oflayn'}
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              <Star size={11} fill="currentColor" className="text-amber-400" />
              {partner.rating}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEVEL_COLORS[partner.level]}`}>{partner.level}</span>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">{partner.goal}</span>
            <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700">
              <Flame size={10} />{partner.streak} kun streak
            </span>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600 bg-slate-50 rounded-xl p-3">{partner.bio}</p>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
            {[
              { label: 'Sessiyalar', value: `${partner.sessions} ta` },
              { label: 'Vaqt', value: partner.availability },
              { label: 'Til', value: partner.languages },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-slate-50 p-2.5">
                <p className="font-bold text-slate-900">{value}</p>
                <p className="text-slate-400">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            {connected ? (
              <>
                <button onClick={() => { onMessage(partner); onClose() }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white">
                  <MessageCircleMore size={15} />Xabar yuborish
                </button>
                <button onClick={() => onDisconnect(partner.id)}
                  className="flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
                  <UserMinus size={14} />Uzish
                </button>
              </>
            ) : pending ? (
              <button disabled className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 py-2.5 text-sm font-semibold text-amber-700">
                <Clock size={15} />So'rov yuborildi
              </button>
            ) : (
              <button onClick={() => onConnect(partner.id)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 py-2.5 text-sm font-bold text-white shadow-md">
                <UserPlus size={15} />Ulanish so'rovi
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ── Partner Card ──────────────────────────────────────────────────────────────
function PartnerCard({ partner, connected, pending, onView, onConnect, onDisconnect, onMessage }) {
  return (
    <motion.article whileHover={{ y: -2 }} transition={{ duration: 0.15 }}
      className={`cursor-pointer overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
        connected ? 'border-emerald-200' : pending ? 'border-amber-100' : 'border-slate-200'
      }`}>
      <div className="flex items-start gap-3">
        <Avatar name={partner.name} online={partner.online} size={46} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-semibold text-slate-900">{partner.name}</p>
            <span className="text-base">{partner.country}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${LEVEL_COLORS[partner.level]}`}>{partner.level}</span>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600">{partner.goal}</span>
          </div>
        </div>
        {connected && <Check size={16} className="shrink-0 text-emerald-500" />}
        {pending  && <Clock size={16} className="shrink-0 text-amber-400" />}
      </div>

      <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">{partner.bio}</p>

      <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400">
        <span className="flex items-center gap-1"><Flame size={10} className="text-orange-400" />{partner.streak} kun</span>
        <span className="flex items-center gap-1"><Star size={10} className="text-amber-400" fill="currentColor" />{partner.rating}</span>
        <span className="flex items-center gap-1"><Users size={10} />{partner.sessions} sessiya</span>
        <span className="ml-auto flex items-center gap-1"><Clock size={10} />{partner.availability}</span>
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={() => onView(partner)}
          className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
          Profil
        </button>
        {connected ? (
          <>
            <button onClick={() => onMessage(partner)}
              className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white">
              <MessageCircleMore size={12} />Xabar
            </button>
            <button onClick={() => onDisconnect(partner.id)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-100 text-red-400 hover:bg-red-50 transition">
              <UserMinus size={13} />
            </button>
          </>
        ) : pending ? (
          <button disabled className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-amber-200 bg-amber-50 py-2 text-xs font-semibold text-amber-700">
            <Clock size={12} />Kutilmoqda
          </button>
        ) : (
          <button onClick={() => onConnect(partner.id)}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 py-2 text-xs font-bold text-white">
            <UserPlus size={12} />Ulanish
          </button>
        )}
      </div>
    </motion.article>
  )
}

// ── Matching animation ────────────────────────────────────────────────────────
function MatchingOverlay({ onFound, onCancel }) {
  const [phase, setPhase] = useState('searching') // searching | found
  const found = ALL_PARTNERS.find((p) => p.online && p.id === 1)

  useState(() => {
    const t = setTimeout(() => setPhase('found'), 3000)
    return () => clearTimeout(t)
  })

  if (phase === 'found') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <UserCheck size={36} className="text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Partner topildi! 🎉</h3>
          <div className="my-4 flex items-center justify-center gap-3">
            <Avatar name={found?.name || 'M'} online size={52} />
            <div className="text-left">
              <p className="font-bold text-slate-900">{found?.name}</p>
              <p className="text-xs text-slate-500">{found?.level} · {found?.goal}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700">
              Keyinroq
            </button>
            <button onClick={() => onFound(found)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white">
              <Check size={15} />Qabul qilish
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div className="relative mx-auto mb-6 h-32 w-32">
          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 rounded-full bg-indigo-100" />
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
            className="absolute inset-4 rounded-full bg-indigo-200" />
          <div className="absolute inset-8 flex items-center justify-center rounded-full bg-indigo-600">
            <Search size={24} className="text-white" />
          </div>
          {[...Array(4)].map((_, i) => (
            <motion.div key={i} className="absolute h-8 w-8 rounded-full border-2 border-white shadow-sm overflow-hidden"
              style={{ top: ['-4px','-4px','auto','auto'][i], bottom: ['auto','auto','-4px','-4px'][i],
                       left: ['auto','60px','-4px','60px'][i], right: ['60px','auto','60px','auto'][i] }}
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}>
              <div className="h-full w-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-500">
                {['M','J','D','B'][i]}
              </div>
            </motion.div>
          ))}
        </div>
        <h3 className="text-xl font-bold text-slate-900">Partner qidirilmoqda...</h3>
        <p className="mt-2 text-sm text-slate-500">Sizga mos partner topilmoqda</p>
        <motion.div className="mx-auto mt-4 h-1 w-48 overflow-hidden rounded-full bg-slate-100">
          <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            className="h-full w-1/2 rounded-full bg-indigo-500" />
        </motion.div>
        <button onClick={onCancel} className="mt-6 text-sm text-slate-400 hover:text-slate-600 hover:underline">
          Bekor qilish
        </button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function PartnerPage() {
  const navigate = useNavigate()
  const { user } = useUser()

  const [activeTab,     setActiveTab]     = useState(0)
  const [connectedIds,  setConnectedIds]  = useState(() => loadIds(CONNECTED_KEY))
  const [pendingIds,    setPendingIds]    = useState(() => loadIds(PENDING_KEY))
  const [selectedPartner, setSelected]   = useState(null)
  const [matching,      setMatching]      = useState(false)
  const [search,        setSearch]        = useState('')
  const [showFilters,   setShowFilters]   = useState(false)
  const [filters,       setFilters]       = useState({ level: 'Barchasi', goal: 'Barchasi', time: 'Barchasi', onlineOnly: false })
  const [toast,         setToast]         = useState('')

  function fireToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const connect = useCallback((id) => {
    setPendingIds((prev) => { const n = [...prev, id]; saveIds(PENDING_KEY, n); return n })
    fireToast('Ulanish so\'rovi yuborildi!')
  }, [])

  const disconnect = useCallback((id) => {
    setConnectedIds((prev) => { const n = prev.filter((x) => x !== id); saveIds(CONNECTED_KEY, n); return n })
    setPendingIds((prev) => { const n = prev.filter((x) => x !== id); saveIds(PENDING_KEY, n); return n })
    fireToast('Aloqa uzildi')
  }, [])

  function handleMatchFound(partner) {
    setMatching(false)
    setConnectedIds((prev) => { const n = [...new Set([...prev, partner.id])]; saveIds(CONNECTED_KEY, n); return n })
    setPendingIds((prev) => { const n = prev.filter((x) => x !== partner.id); saveIds(PENDING_KEY, n); return n })
    fireToast(`${partner.name} bilan ulangingiz! 🎉`)
  }

  function handleMessage(partner) {
    navigate('/messages')
  }

  const filtered = useMemo(() => {
    let list = ALL_PARTNERS
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.bio.toLowerCase().includes(search.toLowerCase()))
    if (filters.level !== 'Barchasi') list = list.filter((p) => p.level === filters.level)
    if (filters.goal  !== 'Barchasi') list = list.filter((p) => p.goal  === filters.goal)
    if (filters.time  !== 'Barchasi') list = list.filter((p) => p.availability === filters.time)
    if (filters.onlineOnly)           list = list.filter((p) => p.online)
    return list
  }, [search, filters])

  const connectedPartners = ALL_PARTNERS.filter((p) => connectedIds.includes(p.id))
  const pendingPartners   = ALL_PARTNERS.filter((p) => pendingIds.includes(p.id) && !connectedIds.includes(p.id))

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      {/* Matching overlay */}
      <AnimatePresence>
        {matching && (
          <MatchingOverlay
            onFound={handleMatchFound}
            onCancel={() => setMatching(false)}
          />
        )}
      </AnimatePresence>

      {/* Partner detail modal */}
      <AnimatePresence>
        {selectedPartner && (
          <PartnerModal
            partner={selectedPartner}
            connected={connectedIds.includes(selectedPartner.id)}
            pending={pendingIds.includes(selectedPartner.id)}
            onConnect={(id) => { connect(id); setSelected(null) }}
            onDisconnect={(id) => { disconnect(id); setSelected(null) }}
            onMessage={handleMessage}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-5 z-50 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex w-full gap-5">
        <Sidebar />
        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title="Partner" subtitle="Siz bilan bir xil maqsaddagi o'rganuvchilarni toping" />

          {/* Stats strip */}
          <div className="mb-4 grid gap-3 sm:grid-cols-4">
            {[
              { label: 'Onlayn',       value: ALL_PARTNERS.filter((p) => p.online).length, icon: Globe,       color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Jami partner', value: ALL_PARTNERS.length, icon: Users,       color: 'text-indigo-600 bg-indigo-50' },
              { label: 'Ulanganlar',   value: connectedIds.length, icon: UserCheck,   color: 'text-violet-600 bg-violet-50' },
              { label: 'Kutilmoqda',   value: pendingIds.length,   icon: Clock,       color: 'text-amber-600 bg-amber-50' },
            ].map(({ label, value, icon: Icon, color }) => (
              <article key={label} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className={`mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg ${color}`}>
                  <Icon size={13} />
                </div>
                <p className="text-xl font-bold text-slate-900">{value}</p>
                <p className="text-[11px] text-slate-400">{label}</p>
              </article>
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-4 flex items-center justify-between border-b border-slate-200">
            <div className="flex gap-1">
              {TABS.map((tab, i) => (
                <button key={tab} onClick={() => setActiveTab(i)}
                  className={`relative px-3 pb-3 text-sm font-medium transition ${activeTab === i ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                  {tab}
                  {i === 1 && connectedIds.length > 0 && (
                    <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                      {connectedIds.length}
                    </span>
                  )}
                  {i === 2 && pendingIds.length > 0 && (
                    <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                      {pendingIds.length}
                    </span>
                  )}
                  {activeTab === i && (
                    <motion.span layoutId="partner-tab"
                      className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-indigo-600" />
                  )}
                </button>
              ))}
            </div>
            <button onClick={() => navigate('/speaking-practice')}
              className="mb-2 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
              <Mic size={13} />AI Speaking
            </button>
          </div>

          {/* ── TAB 0: Partner topish ── */}
          {activeTab === 0 && (
            <div className="space-y-4">
              {/* Hero CTA */}
              <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-5 text-white">
                <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
                  <div>
                    <h2 className="text-xl font-bold">O'zingizga mos speaking partnerni toping</h2>
                    <p className="mt-1 text-sm text-indigo-200">
                      Bir xil daraja va maqsaddagi o'rganuvchi bilan kunlik mashq qiling
                    </p>
                  </div>
                  <button onClick={() => setMatching(true)}
                    className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg transition hover:shadow-xl whitespace-nowrap">
                    <Zap size={15} />
                    Tezkor matching
                  </button>
                </div>
              </section>

              {/* Search + Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-48">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Ism yoki bio bo'yicha qidirish..."
                    className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-indigo-300" />
                </div>
                <button onClick={() => setShowFilters((v) => !v)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                    showFilters ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}>
                  <SlidersHorizontal size={13} />Filter
                  {showFilters && <X size={11} />}
                </button>
                <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                  <input type="checkbox" checked={filters.onlineOnly}
                    onChange={(e) => setFilters((f) => ({ ...f, onlineOnly: e.target.checked }))}
                    className="h-3 w-3 rounded accent-indigo-600" />
                  🟢 Faqat onlayn
                </label>
              </div>

              {/* Filter panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
                      {[
                        { label: 'Daraja', key: 'level', options: LEVELS },
                        { label: 'Maqsad', key: 'goal',  options: GOALS },
                        { label: 'Vaqt',   key: 'time',  options: TIMES },
                      ].map(({ label, key, options }) => (
                        <div key={key}>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label>
                          <select value={filters[key]}
                            onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
                            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400">
                            {options.map((o) => <option key={o}>{o}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Partner grid */}
              <p className="text-xs text-slate-400">{filtered.length} ta partner topildi</p>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center text-slate-400">
                  <Users size={36} className="mb-3 opacity-30" />
                  <p>Mezon bo'yicha partner topilmadi</p>
                </div>
              ) : (
                <div className="grid gap-3 pb-16 sm:grid-cols-2 xl:grid-cols-3 xl:pb-0">
                  {filtered.map((p) => (
                    <PartnerCard key={p.id} partner={p}
                      connected={connectedIds.includes(p.id)}
                      pending={pendingIds.includes(p.id) && !connectedIds.includes(p.id)}
                      onView={setSelected}
                      onConnect={connect}
                      onDisconnect={disconnect}
                      onMessage={handleMessage} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 1: Mening partnerlarim ── */}
          {activeTab === 1 && (
            <div className="space-y-4">
              {connectedPartners.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center text-slate-400">
                  <UserCheck size={40} className="mb-3 opacity-30" />
                  <p className="font-medium">Hali ulangan partner yo'q</p>
                  <p className="mt-1 text-sm">«Partner topish» bo'limiga o'ting</p>
                  <button onClick={() => setActiveTab(0)}
                    className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white">
                    Partner topish →
                  </button>
                </div>
              ) : (
                <div className="grid gap-3 pb-16 sm:grid-cols-2 xl:grid-cols-3 xl:pb-0">
                  {connectedPartners.map((p) => (
                    <PartnerCard key={p.id} partner={p} connected pending={false}
                      onView={setSelected} onConnect={connect} onDisconnect={disconnect} onMessage={handleMessage} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 2: Kutilayotgan ── */}
          {activeTab === 2 && (
            <div className="space-y-4">
              {pendingPartners.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center text-slate-400">
                  <Clock size={40} className="mb-3 opacity-30" />
                  <p>Hech qanday kutilayotgan so'rov yo'q</p>
                </div>
              ) : (
                <div className="grid gap-3 pb-16 sm:grid-cols-2 xl:grid-cols-3 xl:pb-0">
                  {pendingPartners.map((p) => (
                    <PartnerCard key={p.id} partner={p} connected={false} pending
                      onView={setSelected} onConnect={connect} onDisconnect={disconnect} onMessage={handleMessage} />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default PartnerPage
