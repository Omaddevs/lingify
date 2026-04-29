import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Award, BookOpen, Brain, Calendar, ChevronRight,
  Crown, Edit3, Flame, GraduationCap, MessageSquare,
  Settings, Star, Trophy, Users, Zap,
} from 'lucide-react'
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import Sidebar from '../components/Sidebar'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import { useUser } from '../context/UserContext'
import { useLessonProgress, useVocabulary } from '../hooks/useVocabulary'
import { getTestResults } from '../data/mockTests'
import { curriculum, LEVEL_LABELS } from '../data/curriculum'

// ── Level colors ─────────────────────────────────────────────────────────────
const LEVEL_COLORS = {
  A0: 'from-slate-400 to-slate-600',
  A1: 'from-emerald-400 to-emerald-600',
  A2: 'from-sky-400 to-sky-600',
  B1: 'from-indigo-500 to-indigo-700',
  B2: 'from-violet-500 to-violet-700',
  C1: 'from-amber-500 to-amber-700',
  C2: 'from-rose-500 to-rose-700',
}

// ── Avatar initials ───────────────────────────────────────────────────────────
function BigAvatar({ name, avatar, size = 80 }) {
  const colors = ['from-indigo-500 to-violet-600', 'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600', 'from-rose-500 to-pink-600']
  const grad = colors[(name?.charCodeAt(0) || 0) % colors.length]

  if (avatar) return (
    <img src={avatar} alt={name}
      className="rounded-full object-cover shadow-xl ring-4 ring-white"
      style={{ width: size, height: size }} />
  )

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br ${grad} font-black text-white shadow-xl ring-4 ring-white`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {name?.[0]?.toUpperCase() || 'U'}
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, onClick }) {
  return (
    <motion.div whileHover={{ y: -2 }} onClick={onClick}
      className={`cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md`}>
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
        <Icon size={16} />
      </div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      <p className="text-xs font-semibold text-slate-700">{label}</p>
      {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
    </motion.div>
  )
}

// ── Achievement badge ─────────────────────────────────────────────────────────
function AchievementBadge({ badge }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }}
      className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 text-center transition ${
        badge.earned ? 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50' : 'border-slate-100 bg-slate-50 opacity-40 grayscale'
      }`}>
      <span className="text-2xl">{badge.icon}</span>
      <div>
        <p className={`text-[11px] font-bold ${badge.earned ? 'text-indigo-800' : 'text-slate-500'}`}>
          {badge.title}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">{badge.desc}</p>
      </div>
      {badge.earned && (
        <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[9px] font-black text-white">Qo'lga kiritildi</span>
      )}
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
function ProfilePage() {
  const navigate   = useNavigate()
  const { user }   = useUser()
  const { progress, getTotalXP, getCompletedCount } = useLessonProgress()
  const { words, totalWords, masteredWords, dueCount } = useVocabulary()
  const testResults = getTestResults()

  const totalXP         = getTotalXP()
  const completedLessons = getCompletedCount()
  const streak          = user?.streak || 0

  // Level progress
  const LEVELS = ['A0','A1','A2','B1','B2','C1']
  const levelProgress = LEVELS.map((lvl) => {
    const inLevel = curriculum.filter((l) => l.level === lvl)
    const done    = inLevel.filter((l) => progress[l.id]?.completed).length
    return { level: lvl, done, total: inLevel.length, pct: inLevel.length ? Math.round((done/inLevel.length)*100) : 0 }
  })

  // Weekly XP (last 7 days)
  const weeklyXP = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6-i))
    const dayName = d.toLocaleDateString('uz-UZ', { weekday: 'short' })
    const start = d.setHours(0,0,0,0), end = start + 86400000
    const xp = Object.values(progress)
      .filter((p) => p.completedAt >= start && p.completedAt < end)
      .reduce((s, p) => s + (p.xp||0), 0)
    return { day: dayName, xp }
  })

  // Achievements
  const bestBand = testResults.length
    ? testResults.reduce((b,r) => ((r.band||0) > (b?.band||0) ? r : b), null)?.band
    : null

  const achievements = [
    { icon:'📖', title:'Birinchi dars',    desc:'Birinchi darsni tugatdingiz',       earned: completedLessons >= 1 },
    { icon:'🎯', title:'5 ta dars',        desc:'5 ta darsni tugatdingiz',            earned: completedLessons >= 5 },
    { icon:'🏅', title:'10 ta dars',       desc:'10 ta darsni tugatdingiz',           earned: completedLessons >= 10 },
    { icon:'🔥', title:'3 kun streak',     desc:'3 kun ketma-ket o\'qidingiz',        earned: streak >= 3 },
    { icon:'⚡', title:'7 kun streak',     desc:'7 kun uzluksiz o\'qidingiz',         earned: streak >= 7 },
    { icon:'💎', title:'30 kun streak',    desc:'30 kun uzluksiz o\'qidingiz',        earned: streak >= 30 },
    { icon:'📝', title:'10 ta so\'z',      desc:'10 ta so\'z qo\'shdingiz',           earned: totalWords >= 10 },
    { icon:'📚', title:'100 ta so\'z',     desc:'100 ta so\'z to\'pladingiz',         earned: totalWords >= 100 },
    { icon:'💡', title:'500 ta so\'z',     desc:'500 ta so\'z to\'pladingiz',         earned: totalWords >= 500 },
    { icon:'📋', title:'Birinchi test',    desc:'Birinchi mock testni topshirdingiz', earned: testResults.length >= 1 },
    { icon:'🏆', title:'3 ta test',        desc:'3 ta mock test topshirdingiz',       earned: testResults.length >= 3 },
    { icon:'⭐', title:'Band 6.5+',       desc:'IELTS Band 6.5 va undan yuqori',     earned: (bestBand||0) >= 6.5 },
    { icon:'🌟', title:'Band 7+',         desc:'IELTS Band 7.0 va undan yuqori',     earned: (bestBand||0) >= 7.0 },
    { icon:'🚀', title:'500 XP',          desc:'500 XP to\'pladingiz',               earned: totalXP >= 500 },
    { icon:'💫', title:'1000 XP',         desc:'1000 XP to\'pladingiz',              earned: totalXP >= 1000 },
  ]
  const earnedCount = achievements.filter((a) => a.earned).length

  // Test history
  const recentTests = testResults.slice(0, 5)

  const isPremium = user?.plan === 'premium'
  const levelGrad = LEVEL_COLORS[user?.level] || LEVEL_COLORS.B1

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar />

        <main className="min-h-[calc(100vh-40px)] w-full overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-md">

          {/* ── Hero banner ── */}
          <div className={`relative overflow-hidden bg-gradient-to-br ${levelGrad} px-6 py-8`}>
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-white/5" />

            <div className="relative flex flex-wrap items-end gap-5">
              <BigAvatar name={user?.name} avatar={user?.avatar} size={80} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white">{user?.name || 'Foydalanuvchi'}</h1>
                  {isPremium && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-black text-white">
                      <Crown size={11} />PRO
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/70">{user?.email || 'demo@lingify.uz'}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    📚 {LEVEL_LABELS[user?.level] || 'Intermediate'} — {user?.level || 'B1'}
                  </span>
                  {streak > 0 && (
                    <span className="flex items-center gap-1 rounded-full bg-orange-500/80 px-3 py-1 text-xs font-bold text-white">
                      <Flame size={11} />{streak} kun streak
                    </span>
                  )}
                  <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    <Zap size={11} />{totalXP.toLocaleString()} XP
                  </span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => navigate('/settings')}
                  className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-white/30 transition">
                  <Edit3 size={13} />Tahrirlash
                </button>
                <button onClick={() => navigate('/certificate')}
                  className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition shadow-md">
                  <Award size={13} />Sertifikat
                </button>
              </div>
            </div>

            {/* Achievement count */}
            <div className="relative mt-5 flex items-center gap-1">
              {achievements.filter((a) => a.earned).slice(0, 8).map((a, i) => (
                <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}
                  className="text-xl" title={a.title}>
                  {a.icon}
                </motion.span>
              ))}
              {earnedCount > 8 && (
                <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold text-white">
                  +{earnedCount - 8}
                </span>
              )}
            </div>
          </div>

          <div className="p-5 md:p-6 space-y-6">

            {/* ── Stats grid ── */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard icon={BookOpen}   label="Tugatilgan darslar" value={completedLessons}
                sub={`${curriculum.length} tadan`} color="text-indigo-600 bg-indigo-50"
                onClick={() => navigate('/progress')} />
              <StatCard icon={Brain}      label="Lug'at so'zlari"    value={totalWords}
                sub={`${masteredWords} o'zlashtirildi`} color="text-emerald-600 bg-emerald-50"
                onClick={() => navigate('/vocabulary')} />
              <StatCard icon={Trophy}     label="Mock testlar"       value={testResults.length}
                sub={bestBand ? `Eng yuqori: ${bestBand}` : 'Hali yo\'q'} color="text-violet-600 bg-violet-50"
                onClick={() => navigate('/mock-exam')} />
              <StatCard icon={Zap}        label="Jami XP"            value={totalXP.toLocaleString()}
                sub="Leaderboard bali" color="text-amber-600 bg-amber-50"
                onClick={() => navigate('/leaderboard')} />
            </div>

            {/* ── Weekly XP chart ── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-black text-slate-900">Haftalik XP</h3>
                <span className="text-xs font-bold text-indigo-600">
                  {weeklyXP.reduce((s,d) => s+d.xp, 0)} XP bu hafta
                </span>
              </div>
              <div className="h-40">
                <ResponsiveContainer>
                  <BarChart data={weeklyXP}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2ff" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#64748b' }} />
                    <Tooltip cursor={{ fill:'rgba(99,102,241,0.08)' }} formatter={(v) => [`${v} XP`,'XP']} />
                    <Bar dataKey="xp" fill="#6366f1" radius={[6,6,0,0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Level progress ── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-black text-slate-900">Darajalar bo'yicha progress</h3>
                <button onClick={() => navigate('/online-lessons')}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline">
                  Darslarga o'tish <ChevronRight size={12} />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {levelProgress.map(({ level, done, total, pct }) => {
                  const isCurrent = level === user?.level
                  return (
                    <div key={level} className={`rounded-xl p-3 transition ${isCurrent ? 'border-2 border-indigo-300 bg-indigo-50' : 'border border-slate-100 bg-slate-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ${isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{level}</span>
                          <span className="text-xs text-slate-500">{LEVEL_LABELS[level]}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{done}/{total}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all"
                          style={{ width:`${pct}%` }} />
                      </div>
                      <p className="mt-1 text-right text-[10px] text-slate-400">{pct}%</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Achievements ── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-black text-slate-900">Yutuqlar</h3>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                  🏆 {earnedCount}/{achievements.length} qo'lga kiritildi
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
                {achievements.map((b) => (
                  <AchievementBadge key={b.title} badge={b} />
                ))}
              </div>
            </div>

            {/* ── Test history ── */}
            {recentTests.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-black text-slate-900">So'nggi testlar</h3>
                  <button onClick={() => navigate('/progress')}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline">
                    Hammasi <ChevronRight size={12} />
                  </button>
                </div>
                <div className="space-y-2">
                  {recentTests.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-black text-indigo-700">
                        {r.band ?? `${r.correct}/${r.total}`}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">{r.testTitle}</p>
                        <p className="text-xs text-slate-400">{r.testType} · {r.correct}/{r.total} to'g'ri</p>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">
                        {r.takenAt ? new Date(r.takenAt).toLocaleDateString('uz-UZ') : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Quick actions ── */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { icon: BookOpen,      label: 'Darslar',          path: '/online-lessons', color: 'from-indigo-500 to-violet-600' },
                { icon: Trophy,        label: 'Mock Test',         path: '/mock-exam',       color: 'from-emerald-500 to-teal-600' },
                { icon: MessageSquare, label: 'Speaking',          path: '/speaking-practice',color:'from-violet-500 to-purple-600'},
                { icon: Settings,      label: 'Sozlamalar',        path: '/settings',        color: 'from-slate-500 to-slate-700' },
              ].map(({ icon: Icon, label, path, color }) => (
                <motion.button key={path} whileHover={{ y:-2 }} onClick={() => navigate(path)}
                  className={`flex items-center gap-3 rounded-2xl bg-gradient-to-br ${color} p-4 text-white shadow-md transition hover:shadow-lg`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <Icon size={18} />
                  </div>
                  <span className="font-bold">{label}</span>
                  <ChevronRight size={16} className="ml-auto opacity-60" />
                </motion.button>
              ))}
            </div>

            <div className="pb-16 xl:pb-0" />
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default ProfilePage
