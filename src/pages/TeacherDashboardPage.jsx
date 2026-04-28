import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen, ChevronRight, DollarSign, MessageSquare,
  Play, Plus, Star, TrendingUp, Upload, Users, Video,
} from 'lucide-react'
import {
  Bar, BarChart, CartesianGrid,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'
import { useUser } from '../context/UserContext'

const MENU = ['Umumiy', 'Kurslarim', 'Talabalar', 'Daromad', 'Sharh va Feedback']

const myCourses = [
  { id: 'c1', title: 'IELTS 7.0+ Masterclass', students: 1240, revenue: 5800000, rating: 4.9, reviews: 328, lessons: 48, status: 'published' },
  { id: 'c2', title: 'IELTS Speaking Strategy', students: 890, revenue: 2100000, rating: 4.7, reviews: 215, lessons: 24, status: 'published' },
  { id: 'c3', title: 'Advanced Grammar', students: 0, revenue: 0, rating: 0, reviews: 0, lessons: 12, status: 'draft' },
]

const enrollmentData = [
  { month: 'Yan', students: 45 },
  { month: 'Fev', students: 62 },
  { month: 'Mar', students: 89 },
  { month: 'Apr', students: 124 },
  { month: 'May', students: 108 },
  { month: 'Iyu', students: 156 },
]

const myStudents = [
  { name: 'Asadbek Y.', course: 'IELTS 7.0+', progress: 68, lastSeen: '2 soat', grade: 'B+' },
  { name: 'Malika T.', course: 'IELTS 7.0+', progress: 92, lastSeen: '1 kun', grade: 'A' },
  { name: 'Jasur K.', course: 'Speaking', progress: 45, lastSeen: '3 soat', grade: 'B' },
  { name: 'Dilnoza X.', course: 'IELTS 7.0+', progress: 31, lastSeen: 'Bugun', grade: 'C+' },
  { name: 'Bobur R.', course: 'Speaking', progress: 78, lastSeen: '2 kun', grade: 'B+' },
]

const feedbacks = [
  { student: 'Malika T.', course: 'IELTS 7.0+', rating: 5, comment: 'Juda yaxshi kurs! Tushuntirish aniq va sodda.', time: '2 kun oldin' },
  { student: 'Jasur K.', course: 'Speaking', rating: 5, comment: 'Speaking bo\'yicha juda foydali edi. Tavsiya qilaman!', time: '4 kun oldin' },
  { student: 'Aziza N.', course: 'IELTS 7.0+', rating: 4, comment: 'Ko\'proq practice exercises bo\'lsa yaxshi bo\'lardi.', time: '1 hafta oldin' },
]

function AddCourseModal({ onClose }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('IELTS')
  const [price, setPrice] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="mb-4 font-bold text-slate-900">Yangi kurs yaratish</h3>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Kurs nomi *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: IELTS Academic Writing"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Kategoriya</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400">
              {['IELTS', 'TOEFL', 'SAT', 'Speaking', 'Grammar', 'Writing', 'Beginner'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Narx (UZS)</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)}
              placeholder="249000"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Qisqa tavsif</label>
            <textarea rows={3} placeholder="Kurs haqida qisqa ma'lumot..."
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700">
            Bekor
          </button>
          <button onClick={onClose}
            className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white">
            Yaratish
          </button>
        </div>
      </div>
    </div>
  )
}

function TeacherDashboardPage() {
  const navigate = useNavigate()
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState(0)
  const [showAddCourse, setShowAddCourse] = useState(false)

  const totalStudents = myCourses.reduce((s, c) => s + c.students, 0)
  const totalRevenue  = myCourses.reduce((s, c) => s + c.revenue, 0)
  const avgRating     = myCourses.filter((c) => c.rating > 0).reduce((s, c, _, a) => s + c.rating / a.length, 0)

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      {showAddCourse && <AddCourseModal onClose={() => setShowAddCourse(false)} />}

      <div className="flex w-full gap-5">
        <Sidebar />
        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <Header
              title="O'qituvchi paneli"
              subtitle={`Salom, ${user?.name?.split(' ')[0] || 'Ustoz'}! Kurslaringizni boshqaring.`}
            />
            <button onClick={() => setShowAddCourse(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-md">
              <Plus size={14} />
              Yangi kurs
            </button>
          </div>

          {/* KPI strip */}
          <div className="mb-4 grid gap-3 sm:grid-cols-4">
            {[
              { label: 'Jami talabalar', value: totalStudents.toLocaleString(), icon: Users, color: 'text-indigo-600 bg-indigo-50' },
              { label: 'Jami daromad', value: `${(totalRevenue / 1000000).toFixed(1)}M UZS`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
              { label: "O'rtacha reyting", value: avgRating.toFixed(1), icon: Star, color: 'text-amber-600 bg-amber-50' },
              { label: 'Faol kurslar', value: myCourses.filter((c) => c.status === 'published').length, icon: Video, color: 'text-violet-600 bg-violet-50' },
            ].map(({ label, value, icon: Icon, color }) => (
              <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                  <Icon size={14} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="mt-0.5 text-xs text-slate-400">{label}</p>
              </article>
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-4 flex gap-3 overflow-x-auto border-b border-slate-200 pb-0">
            {MENU.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                className={`whitespace-nowrap border-b-2 pb-3 pr-1 text-sm font-medium transition ${
                  activeTab === i ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}>
                {tab}
              </button>
            ))}
          </div>

          {/* ── Umumiy ── */}
          {activeTab === 0 && (
            <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="mb-3 font-semibold text-slate-900">Oylik obunalar</h3>
                  <div className="h-52">
                    <ResponsiveContainer>
                      <BarChart data={enrollmentData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2ff" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip formatter={(v) => [v, 'Talaba']} />
                        <Bar dataKey="students" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="mb-3 font-semibold text-slate-900">Tezkor amallar</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Kurs darsini yuklash', icon: Upload, action: () => {} },
                      { label: 'Talabaga feedback', icon: MessageSquare, action: () => setActiveTab(4) },
                      { label: 'Kurs nashr qilish', icon: Play, action: () => setActiveTab(1) },
                      { label: 'Marketplace ko\'rish', icon: BookOpen, action: () => navigate('/teachers') },
                    ].map(({ label, icon: Icon, action }) => (
                      <button key={label} onClick={action}
                        className="flex w-full items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm hover:bg-slate-50 transition">
                        <span className="flex items-center gap-2 font-medium text-slate-700">
                          <Icon size={15} className="text-indigo-500" />{label}
                        </span>
                        <ChevronRight size={14} className="text-slate-300" />
                      </button>
                    ))}
                  </div>
                </article>
              </div>

              {/* Recent feedback */}
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 font-semibold text-slate-900">So'nggi sharhlar</h3>
                <div className="space-y-3">
                  {feedbacks.slice(0, 2).map((f, i) => (
                    <div key={i} className="rounded-xl border border-slate-100 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                            {f.student[0]}
                          </div>
                          <span className="text-sm font-semibold text-slate-800">{f.student}</span>
                          <span className="text-xs text-slate-400">· {f.course}</span>
                        </div>
                        <div className="flex gap-0.5 text-amber-400">
                          {Array.from({ length: f.rating }).map((_, i) => <Star key={i} size={11} fill="currentColor" />)}
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-slate-600">"{f.comment}"</p>
                      <p className="mt-1 text-[11px] text-slate-400">{f.time}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          )}

          {/* ── Kurslarim ── */}
          {activeTab === 1 && (
            <div className="space-y-3">
              {myCourses.map((course) => (
                <article key={course.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                      <Video size={20} className="text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{course.title}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          course.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {course.status === 'published' ? '● Nashr etilgan' : '✏️ Qoralama'}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Users size={11} />{course.students} talaba</span>
                        <span className="flex items-center gap-1"><BookOpen size={11} />{course.lessons} dars</span>
                        {course.rating > 0 && <span className="flex items-center gap-1 text-amber-500"><Star size={11} fill="currentColor" />{course.rating} ({course.reviews})</span>}
                        {course.revenue > 0 && <span className="flex items-center gap-1 text-emerald-600"><DollarSign size={11} />{(course.revenue / 1000000).toFixed(1)}M UZS</span>}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                        Tahrirlash
                      </button>
                      {course.status === 'draft' && (
                        <button className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white">
                          Nashr etish
                        </button>
                      )}
                    </div>
                  </div>
                  {course.status === 'published' && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Talabalar progres</span>
                        <span>{Math.round((course.students * 0.6))} / {course.students} tugatgan</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100">
                        <div className="h-full w-[60%] rounded-full bg-indigo-500" />
                      </div>
                    </div>
                  )}
                </article>
              ))}
              <button onClick={() => setShowAddCourse(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-200 py-4 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition">
                <Plus size={16} />
                Yangi kurs qo'shish
              </button>
            </div>
          )}

          {/* ── Talabalar ── */}
          {activeTab === 2 && (
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="font-semibold text-slate-900">Mening talabalarim ({myStudents.length})</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500">
                      {['Talaba', 'Kurs', 'Progress', 'So\'ngi faollik', 'Baho', 'Amal'].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {myStudents.map((s, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                              {s.name[0]}
                            </div>
                            <span className="font-medium text-slate-800">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{s.course}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 rounded-full bg-slate-100">
                              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${s.progress}%` }} />
                            </div>
                            <span className="text-xs text-slate-500">{s.progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{s.lastSeen}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                            s.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                            s.grade.startsWith('B') ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                          }`}>{s.grade}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="flex items-center gap-1 rounded-lg border border-indigo-200 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-50 transition">
                            <MessageSquare size={11} />Feedback
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          )}

          {/* ── Daromad ── */}
          {activeTab === 3 && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Bu oy', value: `${(totalRevenue * 0.3 / 1000000).toFixed(1)}M UZS` },
                  { label: 'Jami', value: `${(totalRevenue / 1000000).toFixed(1)}M UZS` },
                  { label: 'Platformaga ulush', value: '20%' },
                ].map(({ label, value }) => (
                  <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                    <p className="mt-1 text-xs text-slate-500">{label}</p>
                  </article>
                ))}
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-emerald-800">Keyingi to'lov</p>
                    <p className="text-sm text-emerald-600 mt-1">Har oyning 1-sanasida Payme/Click orqali</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-emerald-900">
                      {(totalRevenue * 0.24 / 1000000).toFixed(2)}M
                    </p>
                    <p className="text-xs text-emerald-600">UZS (80% ulush)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Sharh va Feedback ── */}
          {activeTab === 4 && (
            <div className="space-y-3">
              {feedbacks.map((f, i) => (
                <article key={i} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                        {f.student[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-800">{f.student}</p>
                          <span className="text-xs text-slate-400">· {f.course}</span>
                        </div>
                        <div className="flex gap-0.5 text-amber-400 mt-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} size={11} fill={j < f.rating ? 'currentColor' : 'none'} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">{f.time}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2">"{f.comment}"</p>
                  <div className="mt-3">
                    <textarea rows={2} placeholder="Javob yozing..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-300" />
                    <button className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white">
                      Javob yuborish
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="pb-16 xl:pb-0" />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default TeacherDashboardPage
