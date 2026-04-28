import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Flame,
  Headphones,
  Mic,
  PenLine,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'
import { useUser } from '../context/UserContext'

// ── date helpers ────────────────────────────────────────────────────────────

function getMondayOfWeek(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() || 7 // Sun → 7
  d.setDate(d.getDate() - day + 1)
  return d
}

function getISOWeekString(monday) {
  // Returns "YYYY-Www" for use as <input type="week"> value
  const d = new Date(monday)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7)) // nearest Thursday
  const year = d.getFullYear()
  const jan4 = new Date(year, 0, 4)
  const weekNum =
    1 +
    Math.round(
      ((d - jan4) / 86400000 - 3 + ((jan4.getDay() + 6) % 7)) / 7,
    )
  return `${year}-W${String(weekNum).padStart(2, '0')}`
}

function weekStringToMonday(weekStr) {
  // Parses "YYYY-Www" → Monday Date
  const [yearStr, wStr] = weekStr.split('-W')
  const year = Number(yearStr)
  const week = Number(wStr)
  const jan4 = new Date(year, 0, 4)
  const jan4Day = jan4.getDay() || 7
  const week1Monday = new Date(jan4)
  week1Monday.setDate(jan4.getDate() - jan4Day + 1)
  const monday = new Date(week1Monday)
  monday.setDate(week1Monday.getDate() + (week - 1) * 7)
  return monday
}

function formatWeekRange(start, end) {
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(start)} – ${fmt(end)}, ${end.getFullYear()}`
}

// ── static chart / stat data ────────────────────────────────────────────────

const tabs = ['Overview', 'Skills', 'Mock Exams', 'Lessons', 'Achievements']

const weeklyData = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.8 },
  { day: 'Wed', hours: 3.2 },
  { day: 'Thu', hours: 4.3 },
  { day: 'Fri', hours: 4.0 },
  { day: 'Sat', hours: 3.4 },
  { day: 'Sun', hours: 1.1 },
]

const levelData = [
  { level: 'A1', score: 10 },
  { level: 'A2', score: 25 },
  { level: 'B1', score: 60 },
  { level: 'B2', score: 75 },
  { level: 'C1', score: 85 },
  { level: 'C2', score: 90 },
]

const skills = [
  { title: 'Listening', score: 7.5, avg: 7.0, icon: Headphones, color: 'bg-indigo-500' },
  { title: 'Reading',   score: 7.0, avg: 6.8, icon: BookOpenCheck, color: 'bg-emerald-500' },
  { title: 'Writing',   score: 6.5, avg: 6.2, icon: PenLine, color: 'bg-amber-500' },
  { title: 'Speaking',  score: 7.0, avg: 6.7, icon: Mic, color: 'bg-violet-500' },
]

const activities = [
  { title: 'Completed IELTS Full Mock Test 2', meta: 'Score: 6.5', time: '2h ago' },
  { title: 'Finished Listening Practice', meta: 'Unit 12: Short Conversations', time: '5h ago' },
  { title: 'Completed Writing Task 1', meta: 'Academic: Line Graph', time: '1d ago' },
  { title: 'Watched Speaking Lesson', meta: 'Tips for Part 2', time: '2d ago' },
]

// ── component ────────────────────────────────────────────────────────────────

function ProgressPage() {
  const { user } = useUser()

  // FIXED: [3] tab state replaces hardcoded index === 0
  const [activeTab, setActiveTab] = useState(0)

  // TASK 4: date range — initialised to the current ISO week
  const [dateRange, setDateRange] = useState(() => {
    const monday = getMondayOfWeek(new Date())
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    return { start: monday, end: sunday }
  })

  const weekInputValue = getISOWeekString(dateRange.start)

  const handleWeekChange = (e) => {
    if (!e.target.value) return
    const monday = weekStringToMonday(e.target.value)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    setDateRange({ start: monday, end: sunday })
  }

  // TASK 1: streak driven by UserContext
  const topStats = [
    { title: 'Overall Progress', value: '68%', note: "Keep it up! You're doing great." },
    { title: 'Study Time', value: '18h 45m', note: '+12% this week' },
    { title: 'Lessons Completed', value: '24', note: '+6 this week' },
    { title: 'Mock Tests Taken', value: '8', note: '+2 this week' },
    { title: 'Current Streak', value: String(user.streak), note: 'days', icon: Flame },
  ]

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar />

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title="Progress" subtitle="Track your learning journey and improve every day." />

          {/* tabs + TASK 4: week picker */}
          <section className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  className={`whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-medium transition ${
                    activeTab === index
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TASK 4: controlled week input replaces static "May 12 - May 18, 2024" */}
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
              <CalendarDays size={14} className="shrink-0 text-slate-400" />
              <input
                type="week"
                value={weekInputValue}
                onChange={handleWeekChange}
                className="border-none bg-transparent text-sm text-slate-700 outline-none"
              />
            </label>
          </section>

          {/* stat cards */}
          <section className="grid gap-3 md:grid-cols-5">
            {topStats.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs text-slate-500">{item.title}</p>
                <div className="mt-2 flex items-end justify-between">
                  <p className="text-3xl font-bold leading-none text-slate-900">{item.value}</p>
                  {item.icon ? <item.icon size={22} className="text-orange-500" /> : null}
                </div>
                <p className="mt-2 text-xs text-slate-500">{item.note}</p>
              </article>
            ))}
          </section>

          <section className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            {/* TASK 4: formatted week range shown above the bar chart */}
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Weekly Study Time</h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {formatWeekRange(dateRange.start, dateRange.end)}
                  </p>
                </div>
              </div>
              <div className="h-56">
                <ResponsiveContainer>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2ff" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
                    <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Skills Progress</h3>
              <div className="space-y-4">
                {skills.map(({ title, score, avg, icon: Icon, color }) => (
                  <div key={title}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <Icon size={14} className="text-slate-400" />
                        {title}
                      </span>
                      <span className="text-sm font-semibold text-slate-800">{score}</span>
                    </div>
                    <div className="relative h-2 rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${(score / 10) * 100}%` }} />
                      <div
                        className="absolute top-0 h-full w-0.5 bg-slate-400/70"
                        style={{ left: `${(avg / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="mt-4 grid gap-4 pb-16 lg:grid-cols-[1.1fr_1fr] xl:pb-0">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-slate-900">Progress by Level</h3>
              <div className="h-56">
                <ResponsiveContainer>
                  <LineChart data={levelData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2ff" />
                    <XAxis dataKey="level" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                <Link to="/progress/activity" className="text-sm font-medium text-indigo-600 hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {activities.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-100 text-indigo-600">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.meta}</p>
                    </div>
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default ProgressPage
