import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpenCheck, CalendarDays, CheckCircle2, Flame,
  Headphones, Mic, PenLine, Trophy, Zap,
} from 'lucide-react'
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'
import { useUser } from '../context/UserContext'
import { useLessonProgress, useVocabulary } from '../hooks/useVocabulary'
import { getTestResults } from '../data/mockTests'
import { curriculum, LEVEL_LABELS } from '../data/curriculum'

const TABS       = ['Umumiy', 'Ko\'nikmalar', 'Mock Testlar', 'Darslar', 'Yutuqlar']
const LEVEL_ORDER = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1']
const SKILL_COLORS = { Listening: '#6366f1', Reading: '#10b981', Writing: '#f59e0b', Speaking: '#8b5cf6' }

// ── date helpers ──────────────────────────────────────────────────────────────
function getMondayOfWeek(date) {
  const d = new Date(date); d.setHours(0, 0, 0, 0)
  const day = d.getDay() || 7; d.setDate(d.getDate() - day + 1); return d
}
function getISOWeekString(monday) {
  const d = new Date(monday)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const year = d.getFullYear(), jan4 = new Date(year, 0, 4)
  const weekNum = 1 + Math.round(((d - jan4) / 86400000 - 3 + ((jan4.getDay() + 6) % 7)) / 7)
  return `${year}-W${String(weekNum).padStart(2, '0')}`
}
function weekStringToMonday(weekStr) {
  const [yearStr, wStr] = weekStr.split('-W')
  const year = Number(yearStr), week = Number(wStr)
  const jan4 = new Date(year, 0, 4), jan4Day = jan4.getDay() || 7
  const week1Monday = new Date(jan4); week1Monday.setDate(jan4.getDate() - jan4Day + 1)
  const monday = new Date(week1Monday); monday.setDate(week1Monday.getDate() + (week - 1) * 7); return monday
}
function formatWeekRange(start, end) {
  const fmt = (d) => d.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })
  return `${fmt(start)} – ${fmt(end)}, ${end.getFullYear()}`
}

// ── Achievements ──────────────────────────────────────────────────────────────
function getAchievements(done, totalWords, testCount, streak) {
  return [
    { id: 'a1', icon: '📖', title: 'Birinchi qadam',   desc: 'Birinchi darsni tugatdingiz',       earned: done >= 1 },
    { id: 'a2', icon: '🎯', title: 'Izchil o\'quvchi', desc: '5 ta darsni tugatdingiz',           earned: done >= 5 },
    { id: 'a3', icon: '🏅', title: 'O\'n dars',        desc: '10 ta darsni tugatdingiz',          earned: done >= 10 },
    { id: 'a4', icon: '📝', title: 'Lug\'atchi',       desc: '10 ta so\'z qo\'shdingiz',          earned: totalWords >= 10 },
    { id: 'a5', icon: '📚', title: 'So\'z ustasi',     desc: '50 ta so\'z to\'pladingiz',         earned: totalWords >= 50 },
    { id: 'a6', icon: '📋', title: 'Test botiri',      desc: 'Birinchi mock testni topshirdingiz', earned: testCount >= 1 },
    { id: 'a7', icon: '🏆', title: 'Tajribali',        desc: '3 ta mock test topshirdingiz',      earned: testCount >= 3 },
    { id: 'a8', icon: '🔥', title: '3 kunlik streak',  desc: '3 kun ketma-ket o\'qidingiz',       earned: streak >= 3 },
    { id: 'a9', icon: '⚡', title: 'Haftalik streak',  desc: '7 kun uzluksiz o\'qidingiz',        earned: streak >= 7 },
    { id:'a10', icon: '💎', title: 'Oylik streak',     desc: '30 kun uzluksiz o\'qidingiz',       earned: streak >= 30 },
  ]
}

// ── Main ──────────────────────────────────────────────────────────────────────
function ProgressPage() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { progress, getTotalXP, getCompletedCount } = useLessonProgress()
  const { totalWords, masteredWords } = useVocabulary()
  const testResults = getTestResults()

  const [activeTab, setActiveTab] = useState(0)
  const [dateRange, setDateRange] = useState(() => {
    const monday = getMondayOfWeek(new Date())
    const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6)
    return { start: monday, end: sunday }
  })

  const totalXP   = getTotalXP()
  const completed = getCompletedCount()
  const streak    = user?.streak || 0

  const levelProgress = useMemo(() =>
    LEVEL_ORDER.map((lvl) => {
      const inLevel = curriculum.filter((l) => l.level === lvl)
      const done = inLevel.filter((l) => progress[l.id]?.completed).length
      return { level: lvl, score: inLevel.length ? Math.round((done / inLevel.length) * 100) : 0 }
    }), [progress])

  const weeklyData = useMemo(() => {
    const DAYS = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya']
    return DAYS.map((day, i) => {
      const d = new Date(dateRange.start); d.setDate(d.getDate() + i)
      const dayStart = d.getTime(), dayEnd = dayStart + 86400000
      const xp = Object.values(progress)
        .filter((p) => p.completedAt >= dayStart && p.completedAt < dayEnd)
        .reduce((sum, p) => sum + (p.xp || 0), 0)
      return { day, xp }
    })
  }, [progress, dateRange])

  const vocabData = useMemo(() => [
    { name: 'O\'zlashtirildi', value: masteredWords,                           fill: '#10b981' },
    { name: 'O\'rganilmoqda',  value: Math.max(0, totalWords - masteredWords), fill: '#6366f1' },
  ], [masteredWords, totalWords])

  const recentActivity = useMemo(() => {
    const lessonActs = Object.entries(progress).map(([id, p]) => {
      const l = curriculum.find((x) => x.id === id)
      return l ? { title: l.title, meta: `+${p.xp} XP`, time: p.completedAt, type: 'lesson' } : null
    }).filter(Boolean)
    const testActs = testResults.slice(0, 3).map((r) => ({
      title: r.testTitle || 'Mock Test',
      meta:  r.band ? `Band: ${r.band}` : `${r.correct || 0}/${r.total || 0}`,
      time:  r.takenAt, type: 'test',
    }))
    return [...lessonActs, ...testActs].sort((a, b) => b.time - a.time).slice(0, 6)
  }, [progress, testResults])

  const bestBand = testResults.length
    ? testResults.reduce((b, r) => ((r.band || 0) > (b?.band || 0) ? r : b), null)?.band
    : null

  const achievements = getAchievements(completed, totalWords, testResults.length, streak)
  const earnedCount  = achievements.filter((a) => a.earned).length

  const topStats = [
    { title: 'Jami XP',         value: totalXP.toLocaleString(), note: 'Toplangan',      icon: Zap,           color: 'text-indigo-600 bg-indigo-50' },
    { title: 'O\'rganish',      value: `${completed * 15}daq`,   note: 'Taxminiy vaqt',  icon: CalendarDays,  color: 'text-sky-600 bg-sky-50' },
    { title: 'Darslar',         value: completed,                 note: `${curriculum.length} tadan`, icon: BookOpenCheck, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Mock testlar',    value: testResults.length,        note: 'Topshirilgan',   icon: Trophy,        color: 'text-violet-600 bg-violet-50' },
    { title: 'Streak',          value: `${streak} kun`,           note: 'Uzluksiz',       icon: Flame,         color: 'text-orange-600 bg-orange-50' },
  ]

  const skillData = [
    { title: 'Listening', score: Math.min(9, 4.0 + testResults.filter((r) => r.testType === 'IELTS').length * 0.3), avg: 7.0, icon: Headphones },
    { title: 'Reading',   score: Math.min(9, bestBand || 4.5), avg: 6.8, icon: BookOpenCheck },
    { title: 'Writing',   score: 5.0, avg: 6.2, icon: PenLine },
    { title: 'Speaking',  score: 5.0, avg: 6.7, icon: Mic },
  ]

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar />
        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title="Progress" subtitle="O'rganish sayohatingizni kuzating va har kuni rivojlaning." />

          {/* Tabs */}
          <section className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {TABS.map((tab, i) => (
                <button key={tab} onClick={() => setActiveTab(i)}
                  className={`whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-medium transition ${
                    activeTab === i ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
              <CalendarDays size={14} className="shrink-0 text-slate-400" />
              <input type="week" value={getISOWeekString(dateRange.start)}
                onChange={(e) => {
                  if (!e.target.value) return
                  const monday = weekStringToMonday(e.target.value)
                  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6)
                  setDateRange({ start: monday, end: sunday })
                }}
                className="border-none bg-transparent text-sm text-slate-700 outline-none" />
            </label>
          </section>

          {/* Stat cards */}
          <section className="mb-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {topStats.map(({ title, value, note, icon: Icon, color }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                  <Icon size={14} />
                </div>
                <p className="text-2xl font-bold leading-none text-slate-900">{value}</p>
                <p className="mt-1 text-xs text-slate-400">{note}</p>
              </article>
            ))}
          </section>

          {/* ── Umumiy ── */}
          {activeTab === 0 && (
            <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-1 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Haftalik XP</h3>
                      <p className="mt-0.5 text-xs text-slate-400">{formatWeekRange(dateRange.start, dateRange.end)}</p>
                    </div>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                      {weeklyData.reduce((s, d) => s + d.xp, 0)} XP
                    </span>
                  </div>
                  <div className="h-52">
                    <ResponsiveContainer>
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2ff" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip formatter={(v) => [`${v} XP`, 'XP']} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
                        <Bar dataKey="xp" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="mb-1 text-lg font-semibold text-slate-900">Lug'at holati</h3>
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="h-44 w-44">
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={vocabData} cx="50%" cy="50%" innerRadius={52} outerRadius={72}
                            dataKey="value" startAngle={90} endAngle={-270}>
                            {vocabData.map((e) => <Cell key={e.name} fill={e.fill} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex gap-4 text-sm">
                      {vocabData.map((d) => (
                        <div key={d.name} className="flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-full" style={{ background: d.fill }} />
                          <span className="text-slate-600 text-xs">{d.name}: <strong>{d.value}</strong></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </div>

              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">Darajalar bo'yicha progress</h3>
                <div className="h-52">
                  <ResponsiveContainer>
                    <LineChart data={levelProgress}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2ff" />
                      <XAxis dataKey="level" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip formatter={(v) => [`${v}%`, 'Bajarildi']} />
                      <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3}
                        dot={{ fill: '#6366f1', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">So'nggi faollik</h3>
                {recentActivity.length === 0 ? (
                  <p className="py-6 text-center text-sm text-slate-400">Hali faollik yo'q. Birinchi darsni boshlang!</p>
                ) : (
                  <div className="space-y-2">
                    {recentActivity.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
                        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                          item.type === 'test' ? 'bg-violet-100 text-violet-600' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          {item.type === 'test' ? <Trophy size={14} /> : <CheckCircle2 size={14} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.meta}</p>
                        </div>
                        <span className="shrink-0 text-xs text-slate-400">
                          {item.time ? new Date(item.time).toLocaleDateString('uz-UZ') : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </div>
          )}

          {/* ── Ko'nikmalar ── */}
          {activeTab === 1 && (
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-5 text-lg font-semibold text-slate-900">Ko'nikmalar holati</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {skillData.map(({ title, score, avg, icon: Icon }) => (
                  <div key={title} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Icon size={15} className="text-slate-400" />{title}
                      </span>
                      <span className="text-lg font-bold text-slate-900">{score.toFixed(1)}<span className="ml-1 text-xs text-slate-400">/ 9.0</span></span>
                    </div>
                    <div className="relative h-3 rounded-full bg-slate-100">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${(score / 9) * 100}%`, background: SKILL_COLORS[title] }} />
                      <div className="absolute top-0 h-full w-0.5 bg-slate-400/60"
                        style={{ left: `${(avg / 9) * 100}%` }} title={`O'rtacha: ${avg}`} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Sizning: <strong className="text-slate-700">{score.toFixed(1)}</strong></span>
                      <span>O'rtacha: <strong className="text-slate-700">{avg}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {[
                  { label: 'Listening mashqi', path: '/mock-test/ielts-listening-1' },
                  { label: 'Reading mashqi',   path: '/mock-test/ielts-reading-1' },
                  { label: 'Flashcard',        path: '/flashcards' },
                  { label: 'Yangi dars',       path: '/online-lessons' },
                ].map(({ label, path }) => (
                  <button key={label} onClick={() => navigate(path)}
                    className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5 text-left text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition">
                    {label} <span>→</span>
                  </button>
                ))}
              </div>
            </article>
          )}

          {/* ── Mock Testlar ── */}
          {activeTab === 2 && (
            <div className="space-y-4">
              {testResults.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center text-slate-400">
                  <Trophy size={40} className="mb-3 opacity-30" />
                  <p className="font-medium">Hali mock test topshirilmagan</p>
                  <button onClick={() => navigate('/mock-exam')}
                    className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white">
                    Mock testga o'tish
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { label: 'Topshirilgan', value: testResults.length },
                      { label: 'Eng yuqori', value: bestBand ?? '—' },
                      { label: "O'rtacha", value: (testResults.reduce((s, r) => s + (r.band || 0), 0) / testResults.length).toFixed(1) },
                    ].map(({ label, value }) => (
                      <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                        <p className="text-3xl font-bold text-slate-900">{value}</p>
                        <p className="mt-1 text-xs text-slate-500">{label}</p>
                      </article>
                    ))}
                  </div>
                  <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {testResults.map((r, i) => (
                      <div key={r.id} className={`flex items-center gap-3 px-4 py-3 ${i < testResults.length - 1 ? 'border-b border-slate-100' : ''}`}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
                          {r.band ?? `${r.correct}/${r.total}`}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">{r.testTitle}</p>
                          <p className="text-xs text-slate-500">{r.testType} · {r.correct}/{r.total} to'g'ri</p>
                        </div>
                        <span className="shrink-0 text-xs text-slate-400">
                          {r.takenAt ? new Date(r.takenAt).toLocaleDateString('uz-UZ') : ''}
                        </span>
                      </div>
                    ))}
                  </article>
                </>
              )}
            </div>
          )}

          {/* ── Darslar ── */}
          {activeTab === 3 && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Tugatilgan', value: completed, color: 'border-emerald-100 bg-emerald-50 text-emerald-800' },
                  { label: 'Qolgan', value: curriculum.length - completed, color: 'border-slate-200 bg-white text-slate-900' },
                  { label: 'Progress', value: `${Math.round((completed / curriculum.length) * 100)}%`, color: 'border-indigo-100 bg-indigo-50 text-indigo-800' },
                ].map(({ label, value, color }) => (
                  <article key={label} className={`rounded-2xl border p-4 text-center shadow-sm ${color}`}>
                    <p className="text-3xl font-bold">{value}</p>
                    <p className="mt-1 text-xs opacity-70">{label}</p>
                  </article>
                ))}
              </div>
              {LEVEL_ORDER.map((lvl) => {
                const lvlLessons = curriculum.filter((l) => l.level === lvl)
                const lvlDone = lvlLessons.filter((l) => progress[l.id]?.completed).length
                const pct = lvlLessons.length ? Math.round((lvlDone / lvlLessons.length) * 100) : 0
                return (
                  <article key={lvl} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">{lvl}</span>
                        <span className="text-sm font-medium text-slate-700">{LEVEL_LABELS[lvl]}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{lvlDone}/{lvlLessons.length}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1 text-right text-[11px] text-slate-400">{pct}%</p>
                  </article>
                )
              })}
              <button onClick={() => navigate('/online-lessons')}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 py-3 text-sm font-bold text-white shadow-md">
                Darslarga o'tish →
              </button>
            </div>
          )}

          {/* ── Yutuqlar ── */}
          {activeTab === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-amber-800">Qo'lga kiritilgan yutuqlar</p>
                  <p className="mt-1 text-3xl font-black text-amber-900">{earnedCount}/{achievements.length}</p>
                </div>
                <span className="text-5xl">🏆</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {achievements.map((b) => (
                  <div key={b.id} className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                    b.earned ? 'border-indigo-100 bg-indigo-50' : 'border-slate-100 bg-slate-50 opacity-40 grayscale'
                  }`}>
                    <span className="text-3xl">{b.icon}</span>
                    <div>
                      <p className={`text-xs font-semibold ${b.earned ? 'text-indigo-800' : 'text-slate-500'}`}>{b.title}</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">{b.desc}</p>
                    </div>
                    {b.earned && <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">✓ Qo'lga kiritildi</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pb-16 xl:pb-0" />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default ProgressPage
