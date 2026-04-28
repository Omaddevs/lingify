import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Award,
  ChartNoAxesColumn,
  Crown,
  Flame,
  Medal,
  Search,
  TrendingUp,
  Zap,
} from 'lucide-react'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'
import { useUser } from '../context/UserContext'

const FILTERS = ['Haftalik', 'Oylik', 'Barcha vaqt']
const LEVELS = ['Hammasi', 'A0', 'A1', 'A2', 'B1', 'B2', 'C1']

const LEVEL_COLORS = {
  A0: 'bg-slate-100 text-slate-600',
  A1: 'bg-emerald-100 text-emerald-700',
  A2: 'bg-sky-100 text-sky-700',
  B1: 'bg-indigo-100 text-indigo-700',
  B2: 'bg-violet-100 text-violet-700',
  C1: 'bg-amber-100 text-amber-700',
}

const allUsers = [
  { rank: 1,  name: 'Shahriyor N.',   avatar: null, level: 'C1', xp: 12480, streak: 89, country: '🇺🇿', badge: 'crown' },
  { rank: 2,  name: 'Dilnoza M.',     avatar: null, level: 'B2', xp: 11250, streak: 72, country: '🇺🇿', badge: 'silver' },
  { rank: 3,  name: 'Jasur K.',       avatar: null, level: 'B2', xp: 10890, streak: 61, country: '🇺🇿', badge: 'bronze' },
  { rank: 4,  name: 'Malika T.',      avatar: null, level: 'B1', xp: 9740,  streak: 55, country: '🇺🇿' },
  { rank: 5,  name: 'Bobur R.',       avatar: null, level: 'B1', xp: 8920,  streak: 48, country: '🇺🇿' },
  { rank: 6,  name: 'Zulfiya A.',     avatar: null, level: 'B1', xp: 8240,  streak: 43, country: '🇺🇿' },
  { rank: 7,  name: 'Kamol U.',       avatar: null, level: 'A2', xp: 7650,  streak: 38, country: '🇺🇿' },
  { rank: 8,  name: 'Sarvar B.',      avatar: null, level: 'A2', xp: 7120,  streak: 31, country: '🇺🇿' },
  { rank: 9,  name: 'Lola Q.',        avatar: null, level: 'A2', xp: 6890,  streak: 29, country: '🇺🇿' },
  { rank: 10, name: 'Otabek I.',      avatar: null, level: 'A1', xp: 6400,  streak: 25, country: '🇺🇿' },
  { rank: 11, name: 'Mohira S.',      avatar: null, level: 'A1', xp: 5980,  streak: 21, country: '🇺🇿' },
  { rank: 12, name: 'Sanjar D.',      avatar: null, level: 'A1', xp: 5540,  streak: 18, country: '🇺🇿' },
  { rank: 13, name: 'Feruza N.',      avatar: null, level: 'A0', xp: 4820,  streak: 14, country: '🇺🇿' },
  { rank: 14, name: 'Nodir P.',       avatar: null, level: 'A0', xp: 4240,  streak: 11, country: '🇺🇿' },
  { rank: 15, name: 'Aziza X.',       avatar: null, level: 'A0', xp: 3890,  streak: 8,  country: '🇺🇿' },
]

const myRank = {
  rank: 47,
  name: 'Asadbek',
  level: 'B1',
  xp: 2840,
  streak: 12,
  country: '🇺🇿',
  isMe: true,
}

function Avatar({ name, size = 40 }) {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full text-white font-bold"
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}
    >
      {name[0]}
    </div>
  )
}

function RankBadge({ rank }) {
  if (rank === 1) return <Crown size={20} className="text-yellow-500" />
  if (rank === 2) return <Medal size={20} className="text-slate-400" />
  if (rank === 3) return <Medal size={20} className="text-amber-600" />
  return (
    <span className="flex h-8 w-8 items-center justify-center text-sm font-bold text-slate-500">
      {rank}
    </span>
  )
}

function UserRow({ user, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
        user.isMe
          ? 'border-2 border-indigo-300 bg-indigo-50 shadow-sm'
          : 'border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
      }`}
    >
      {/* Rank */}
      <div className="flex w-10 shrink-0 justify-center">
        <RankBadge rank={user.rank} />
      </div>

      {/* Avatar */}
      <Avatar name={user.name} size={40} />

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={`truncate text-sm font-semibold ${user.isMe ? 'text-indigo-800' : 'text-slate-800'}`}>
            {user.name}
            {user.isMe && (
              <span className="ml-1.5 text-xs font-medium text-indigo-500">(siz)</span>
            )}
          </p>
          <span className="text-sm">{user.country}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${LEVEL_COLORS[user.level]}`}>
            {user.level}
          </span>
          <span className="flex items-center gap-0.5 text-[11px] text-orange-500">
            <Flame size={10} />
            {user.streak} kun
          </span>
        </div>
      </div>

      {/* XP */}
      <div className="text-right">
        <div className="flex items-center gap-1 text-sm font-bold text-indigo-700">
          <Zap size={13} />
          {user.xp.toLocaleString()}
        </div>
        <p className="text-[11px] text-slate-400">XP</p>
      </div>
    </motion.div>
  )
}

function TopThreePodium({ users }) {
  const [first, second, third] = users

  return (
    <div className="relative mb-8 flex items-end justify-center gap-4">
      {/* 2nd place */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center"
      >
        <Avatar name={second.name} size={52} />
        <div className="mt-2 text-center">
          <p className="text-xs font-semibold text-slate-700">{second.name}</p>
          <p className="text-[11px] text-slate-400">{second.xp.toLocaleString()} XP</p>
        </div>
        <div className="mt-2 flex h-20 w-20 flex-col items-center justify-center rounded-t-2xl bg-slate-200">
          <Medal size={22} className="text-slate-400" />
          <p className="text-lg font-bold text-slate-600">2</p>
        </div>
      </motion.div>

      {/* 1st place */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col items-center"
      >
        <div className="mb-1">
          <Crown size={22} className="text-yellow-500" />
        </div>
        <Avatar name={first.name} size={64} />
        <div className="mt-2 text-center">
          <p className="text-sm font-bold text-slate-900">{first.name}</p>
          <p className="text-xs text-slate-400">{first.xp.toLocaleString()} XP</p>
        </div>
        <div className="mt-2 flex h-28 w-24 flex-col items-center justify-center rounded-t-2xl bg-gradient-to-t from-amber-400 to-yellow-300 shadow-lg">
          <Crown size={22} className="text-white" />
          <p className="text-xl font-bold text-white">1</p>
        </div>
      </motion.div>

      {/* 3rd place */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col items-center"
      >
        <Avatar name={third.name} size={48} />
        <div className="mt-2 text-center">
          <p className="text-xs font-semibold text-slate-700">{third.name}</p>
          <p className="text-[11px] text-slate-400">{third.xp.toLocaleString()} XP</p>
        </div>
        <div className="mt-2 flex h-14 w-20 flex-col items-center justify-center rounded-t-2xl bg-amber-100">
          <Medal size={20} className="text-amber-600" />
          <p className="text-lg font-bold text-amber-700">3</p>
        </div>
      </motion.div>
    </div>
  )
}

function LeaderboardPage() {
  const { user } = useUser()
  const [activeFilter, setActiveFilter] = useState(0)
  const [activeLevel, setActiveLevel] = useState('Hammasi')
  const [search, setSearch] = useState('')

  const filtered = allUsers.filter((u) => {
    const matchLevel = activeLevel === 'Hammasi' || u.level === activeLevel
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase())
    return matchLevel && matchSearch
  })

  const topThree = allUsers.slice(0, 3)
  const rest = filtered.slice(3)

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar />

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header
            title="Reyting"
            subtitle="O'zingizni boshqa o'rganuvchilar bilan solishtiring"
          />

          {/* Stats strip */}
          <div className="mb-5 grid gap-3 sm:grid-cols-4">
            {[
              { icon: Award,             label: 'Sizning o\'rningiz', value: `#${myRank.rank}` },
              { icon: Zap,               label: 'Sizning XP',         value: `${myRank.xp.toLocaleString()}` },
              { icon: Flame,             label: 'Streak',             value: `${myRank.streak} kun` },
              { icon: TrendingUp,        label: 'Bu hafta',           value: '+340 XP' },
            ].map(({ icon: Icon, label, value }) => (
              <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-slate-400">
                  <Icon size={14} />
                  <p className="text-xs">{label}</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
            {/* Left: main leaderboard */}
            <div>
              {/* Filters */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  {FILTERS.map((f, i) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(i)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        activeFilter === i
                          ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Foydalanuvchi qidirish..."
                    className="h-8 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs outline-none focus:border-indigo-300"
                  />
                </div>
              </div>

              {/* Level filter pills */}
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setActiveLevel(l)}
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition ${
                      activeLevel === l
                        ? 'bg-indigo-600 text-white'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Podium (only when no filter/search) */}
              {activeLevel === 'Hammasi' && !search && (
                <TopThreePodium users={topThree} />
              )}

              {/* Rest of list */}
              <div className="space-y-2">
                {(activeLevel === 'Hammasi' && !search ? rest : filtered).map((u, i) => (
                  <UserRow key={u.rank} user={u} index={i} />
                ))}
              </div>

              {/* My rank if not in top */}
              {myRank.rank > filtered.length && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="flex-1 border-t border-dashed border-slate-200" />
                    <span>...</span>
                    <div className="flex-1 border-t border-dashed border-slate-200" />
                  </div>
                  <UserRow user={{ ...myRank, isMe: true, name: user?.name || 'Siz' }} index={0} />
                </div>
              )}
            </div>

            {/* Right: info panel */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-5">
                <h3 className="mb-3 font-semibold text-slate-900">XP qanday to'planadi?</h3>
                <div className="space-y-2.5 text-sm text-slate-700">
                  {[
                    { label: 'Dars tugatish',      xp: '+20 XP' },
                    { label: 'Mock test topshirish',xp: '+50 XP' },
                    { label: 'Speaking sessiya',    xp: '+40 XP' },
                    { label: 'Flashcard sessiya',   xp: '+15 XP' },
                    { label: 'Kunlik streak',       xp: '+10 XP' },
                    { label: 'Quiz 100%',           xp: '+30 XP' },
                  ].map(({ label, xp }) => (
                    <div key={label} className="flex justify-between">
                      <span>{label}</span>
                      <span className="font-semibold text-indigo-700">{xp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="mb-3 font-semibold text-slate-900">Level bo'yicha top</h3>
                <div className="space-y-3">
                  {['B2', 'B1', 'A2', 'A1'].map((lvl) => {
                    const top = allUsers.find((u) => u.level === lvl)
                    if (!top) return null
                    return (
                      <div key={lvl} className="flex items-center gap-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${LEVEL_COLORS[lvl]}`}>
                          {lvl}
                        </span>
                        <Avatar name={top.name} size={30} />
                        <span className="flex-1 truncate text-sm text-slate-700">{top.name}</span>
                        <span className="text-xs font-semibold text-indigo-600">{top.xp.toLocaleString()} XP</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
                <div className="flex items-center gap-2">
                  <ChartNoAxesColumn size={18} className="text-amber-600" />
                  <h3 className="font-semibold text-slate-900">Sizning holatingiz</h3>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Joriy o'rin</span>
                    <span className="font-bold text-slate-900">#{myRank.rank}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Keyingi o'ringa</span>
                    <span className="font-semibold text-amber-700">+160 XP kerak</span>
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-amber-100">
                  <div className="h-full w-[64%] rounded-full bg-amber-400" />
                </div>
                <p className="mt-1 text-right text-[11px] text-amber-600">64% — #46 ga qadar</p>
              </div>
            </div>
          </div>

          <div className="pb-16 xl:pb-0" />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default LeaderboardPage
