import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart3, BookOpen, CheckCircle2, Crown, DollarSign,
  FileCheck2, GraduationCap, LayoutDashboard, Settings,
  ShieldCheck, Trash2, TrendingUp, UserCheck, Users, Zap,
} from 'lucide-react'
import {
  Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import MobileBottomNav from '../components/Cards/MobileBottomNav'

const MENU = [
  { id: 'overview',  label: 'Umumiy',        icon: LayoutDashboard },
  { id: 'users',     label: 'Foydalanuvchilar', icon: Users },
  { id: 'content',   label: 'Kontent',        icon: BookOpen },
  { id: 'tests',     label: 'Testlar',         icon: FileCheck2 },
  { id: 'teachers',  label: 'O\'qituvchilar',  icon: GraduationCap },
  { id: 'revenue',   label: 'Daromad',         icon: DollarSign },
  { id: 'settings',  label: 'Sozlamalar',      icon: Settings },
]

const revenueData = [
  { month: 'Yan', revenue: 1200000, users: 45 },
  { month: 'Fev', revenue: 1800000, users: 62 },
  { month: 'Mar', revenue: 2400000, users: 89 },
  { month: 'Apr', revenue: 3100000, users: 124 },
  { month: 'May', revenue: 2900000, users: 108 },
  { month: 'Iyu', revenue: 3800000, users: 156 },
]

const registrationData = [
  { day: 'Du', count: 12 },
  { day: 'Se', count: 19 },
  { day: 'Cho', count: 8 },
  { day: 'Pa', count: 24 },
  { day: 'Ju', count: 31 },
  { day: 'Sha', count: 17 },
  { day: 'Ya', count: 9 },
]

const MOCK_USERS = [
  { id: 1, name: 'Asadbek Yusupov', email: 'asadbek@lingify.uz', level: 'B1', plan: 'free',    streak: 12, joined: '2024-01-15', status: 'active' },
  { id: 2, name: 'Malika Tosheva',   email: 'malika@gmail.com',   level: 'B2', plan: 'premium', streak: 45, joined: '2023-12-01', status: 'active' },
  { id: 3, name: 'Jasur Karimov',    email: 'jasur@mail.ru',      level: 'C1', plan: 'premium', streak: 89, joined: '2023-11-10', status: 'active' },
  { id: 4, name: 'Dilnoza Xasanova', email: 'dilnoza@yahoo.com',  level: 'A2', plan: 'free',    streak: 3,  joined: '2024-02-20', status: 'active' },
  { id: 5, name: 'Bobur Rahimov',    email: 'bobur@gmail.com',    level: 'A1', plan: 'free',    streak: 0,  joined: '2024-03-05', status: 'inactive' },
  { id: 6, name: 'Zulfiya Azimova',  email: 'zulfiya@lingify.uz', level: 'B1', plan: 'premium', streak: 21, joined: '2024-01-28', status: 'active' },
]

const MOCK_TEACHERS = [
  { id: 1, name: 'Jasur Karimov',    courses: 3, students: 1240, revenue: 5800000, rating: 4.9, status: 'verified' },
  { id: 2, name: 'Malika Toshmatova', courses: 2, students: 3420, revenue: 9200000, rating: 4.8, status: 'verified' },
  { id: 3, name: 'Nilufar Xasanova', courses: 1, students: 567,  revenue: 2100000, rating: 4.6, status: 'verified' },
  { id: 4, name: 'Kamol Umarov',     courses: 1, students: 2100, revenue: 0,       rating: 4.5, status: 'pending' },
]

// ── Sub-sections ──────────────────────────────────────────────────────────────
function OverviewSection() {
  const kpis = [
    { label: 'Jami foydalanuvchilar', value: '5,284', change: '+12%', icon: Users,        color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Premium obunalar',      value: '1,142', change: '+8%',  icon: Crown,        color: 'text-amber-600 bg-amber-50' },
    { label: 'Bugungi daromad',       value: '3.8M UZS', change: '+23%', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Faol o\'qituvchilar',   value: '24',    change: '+3',   icon: GraduationCap, color: 'text-violet-600 bg-violet-50' },
    { label: 'Topshirilgan testlar',  value: '8,920', change: '+340', icon: FileCheck2,   color: 'text-sky-600 bg-sky-50' },
    { label: 'Tugatilgan darslar',    value: '24,180', change: '+2.1K', icon: BookOpen,   color: 'text-rose-600 bg-rose-50' },
  ]

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map(({ label, value, change, icon: Icon, color }) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
                <Icon size={16} />
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                <TrendingUp size={10} />{change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="mt-0.5 text-xs text-slate-400">{label}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-semibold text-slate-900">Oylik daromad (UZS)</h3>
          <div className="h-52">
            <ResponsiveContainer>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2ff" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v) => [`${(v / 1000000).toFixed(2)}M UZS`, 'Daromad']} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-semibold text-slate-900">Haftalik ro'yxatdan o'tish</h3>
          <div className="h-52">
            <ResponsiveContainer>
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2ff" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip formatter={(v) => [v, 'Yangi user']} />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Free', value: '4,142', pct: 78, color: 'bg-slate-400' },
          { label: 'Premium', value: '1,142', pct: 22, color: 'bg-indigo-500' },
          { label: 'Konversiya', value: '21.6%', pct: 21.6, color: 'bg-emerald-500' },
        ].map(({ label, value, pct, color }) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function UsersSection() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Hammasi')

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Hammasi' || u.plan === filter.toLowerCase() || u.status === filter.toLowerCase()
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Ism yoki email qidirish..."
          className="h-9 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-indigo-300 min-w-48" />
        {['Hammasi', 'free', 'premium', 'active', 'inactive'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
              filter === f ? 'bg-indigo-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
            {f === 'Hammasi' ? 'Hammasi' : f}
          </button>
        ))}
      </div>

      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-sm font-semibold text-slate-700">{filtered.length} ta foydalanuvchi</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500">
                {['Ism', 'Email', 'Daraja', 'Plan', 'Streak', 'Qo\'shilgan', 'Holat', 'Amal'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} className={`border-b border-slate-50 hover:bg-slate-50 ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                        {u.name[0]}
                      </div>
                      <span className="font-medium text-slate-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">{u.level}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      u.plan === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.plan === 'premium' ? '👑 Premium' : 'Free'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">🔥 {u.streak}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{u.joined}</td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 text-xs font-medium ${
                      u.status === 'active' ? 'text-emerald-600' : 'text-slate-400'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      {u.status === 'active' ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="rounded-lg border border-red-100 p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  )
}

function TeachersSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">O'qituvchilar ro'yxati</h3>
        <button className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white">
          + Yangi o'qituvchi
        </button>
      </div>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500">
                {['O\'qituvchi', 'Kurslar', 'Talabalar', 'Daromad', 'Reyting', 'Holat', 'Amal'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_TEACHERS.map((t, i) => (
                <tr key={t.id} className={`border-b border-slate-50 hover:bg-slate-50 ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                        {t.name[0]}
                      </div>
                      <span className="font-medium text-slate-800">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{t.courses} ta kurs</td>
                  <td className="px-4 py-3 text-slate-600">{t.students.toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">
                    {t.revenue ? `${(t.revenue / 1000000).toFixed(1)}M UZS` : 'Bepul'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-amber-600">⭐ {t.rating}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      t.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {t.status === 'verified' ? <><CheckCircle2 size={10} /> Tasdiqlangan</> : '⏳ Kutilmoqda'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {t.status === 'pending' && (
                        <button className="rounded-lg border border-emerald-200 p-1.5 text-emerald-500 hover:bg-emerald-50 transition">
                          <CheckCircle2 size={13} />
                        </button>
                      )}
                      <button className="rounded-lg border border-red-100 p-1.5 text-red-400 hover:bg-red-50 transition">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  )
}

function RevenueSection() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Bu oy daromad', value: '3.8M UZS', change: '+23%', icon: DollarSign },
          { label: 'Premium obunalar', value: '1,142', change: '+8%', icon: Crown },
          { label: "O'rtacha ARPU", value: '3,328 UZS', change: '+5%', icon: BarChart3 },
        ].map(({ label, value, change, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <Icon size={16} className="text-indigo-500" />
              <span className="text-xs font-semibold text-emerald-600">{change}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="mt-0.5 text-xs text-slate-400">{label}</p>
          </article>
        ))}
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-slate-900">Daromad manbalari</h3>
        <div className="space-y-3">
          {[
            { label: 'Premium oylik obuna', amount: '2,140,000 UZS', pct: 56, color: 'bg-indigo-500' },
            { label: 'Premium yillik obuna', amount: '980,000 UZS', pct: 26, color: 'bg-violet-500' },
            { label: 'Kurs sotuvlari', amount: '440,000 UZS', pct: 12, color: 'bg-emerald-500' },
            { label: 'Boshqalar', amount: '240,000 UZS', pct: 6, color: 'bg-amber-500' },
          ].map(({ label, amount, pct, color }) => (
            <div key={label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-slate-700">{label}</span>
                <div className="flex gap-3">
                  <span className="font-semibold text-slate-900">{amount}</span>
                  <span className="text-slate-400">{pct}%</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}

function ContentSection() {
  const items = [
    { title: 'Curriculum darslar', count: 15, type: 'Dars', action: 'Online Lessons' },
    { title: 'Mock test savollar', count: 42, type: 'Savol', action: 'Mock Testlar' },
    { title: 'O\'qituvchi kurslari', count: 8, type: 'Kurs', action: 'Marketplace' },
    { title: 'Placement test', count: 15, type: 'Savol', action: 'Test' },
  ]
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(({ title, count, type, action }) => (
          <article key={title} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <p className="font-semibold text-slate-800">{title}</p>
              <p className="text-2xl font-bold text-indigo-700 mt-1">{count} <span className="text-sm font-normal text-slate-400">{type}</span></p>
            </div>
            <button className="rounded-xl border border-indigo-200 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50 transition">
              Tahrirlash
            </button>
          </article>
        ))}
      </div>
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-800">⚠️ Diqqat</p>
        <p className="mt-1 text-xs text-amber-700">
          Kontent boshqaruv paneli hozirda demo rejimda. Supabase ulagandan so'ng to'liq ishlaydi.
        </p>
      </div>
    </div>
  )
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
function AdminPage() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('overview')

  const sections = { overview: OverviewSection, users: UsersSection, content: ContentSection, teachers: TeachersSection, revenue: RevenueSection }
  const ActiveComponent = sections[activeSection] || OverviewSection

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <ShieldCheck size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Lingify Admin</p>
              <p className="text-[10px] text-slate-400">Boshqaruv paneli</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              ● Demo rejim
            </span>
            <button
              onClick={() => navigate('/')}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              ← Platformaga qaytish
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-5 px-4 py-5">
        {/* Sidebar */}
        <aside className="sticky top-20 hidden h-fit w-56 shrink-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm xl:block">
          <nav>
            <ul className="space-y-1">
              {MENU.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    onClick={() => setActiveSection(id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      activeSection === id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile tab bar */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 xl:hidden w-full">
          {MENU.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveSection(id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                activeSection === id ? 'bg-indigo-600 text-white' : 'border border-slate-200 text-slate-600'
              }`}>
              <Icon size={13} />{label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">
              {MENU.find((m) => m.id === activeSection)?.label}
            </h1>
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-indigo-500" />
              <span className="text-xs text-slate-500">Real vaqt ma'lumotlari (demo)</span>
            </div>
          </div>
          <ActiveComponent />
        </main>
      </div>
    </div>
  )
}

export default AdminPage
