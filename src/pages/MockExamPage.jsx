import { useState } from 'react' // FIXED: [3] added useState for tab management
import {
  AlarmClock,
  BarChart3,
  BookCheck,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Headphones,
  Mic,
  PenLine,
} from 'lucide-react'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'

const examTabs = ['IELTS', 'TOEFL', 'SAT', 'PTE']

const statItems = [
  { label: 'Tests Taken', value: '12', icon: ClipboardCheck },
  { label: 'Best Score', value: '7.0', icon: BookCheck },
  { label: 'Average Score', value: '6.5', icon: BarChart3 },
  { label: 'Total Time', value: '18h 30m', icon: AlarmClock },
]

const examTypes = [
  { title: 'Listening', questions: '40 Questions', time: '30 min', icon: Headphones },
  { title: 'Reading', questions: '40 Questions', time: '60 min', icon: BookCheck },
  { title: 'Writing', questions: '2 Tasks', time: '60 min', icon: PenLine },
  { title: 'Speaking', questions: '3 Parts', time: '11-14 min', icon: Mic },
]

const fullMockTests = [
  { title: 'IELTS Full Mock Test 1', sections: '4 Sections - 2h 45m', level: 'B1 - C2', best: '7.0', taken: '2 days ago', action: 'Review Result' },
  { title: 'IELTS Full Mock Test 2', sections: '4 Sections - 2h 45m', level: 'B1 - C2', best: '6.5', taken: '1 week ago', action: 'Review Result' },
  { title: 'IELTS Full Mock Test 3', sections: '4 Sections - 2h 45m', level: 'B1 - C2', best: '-', taken: 'Not taken', action: 'Start Test' },
]

const performanceRows = [
  { label: 'Listening', score: '7.5', color: 'bg-emerald-500' },
  { label: 'Reading', score: '7.0', color: 'bg-sky-500' },
  { label: 'Writing', score: '6.5', color: 'bg-amber-500' },
  { label: 'Speaking', score: '7.0', color: 'bg-violet-500' },
]

function MockExamPage() {
  const [activeTab, setActiveTab] = useState(0) // FIXED: [3] tab state replaces hardcoded index === 0

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar /> {/* FIXED: [2] activeItem prop removed */}

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title="Mock Exam" subtitle="Simulate real tests and track your performance" />

          <section className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {examTabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(index)} // FIXED: [3] onClick updates active tab
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    activeTab === index // FIXED: [3] activeTab state replaces hardcoded index === 0
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
              All Levels
              <ChevronDown size={14} />
            </button>
          </section>

          <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <article className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-6 shadow-sm">
              <div className="grid items-center gap-4 md:grid-cols-[1fr_210px]">
                <div>
                  <h2 className="text-4xl font-bold leading-tight tracking-tight text-slate-900">Take a full-length mock exam</h2>
                  <p className="mt-3 max-w-md text-sm text-slate-600">
                    Experience the real test environment and improve your band score.
                  </p>
                  <button className="mt-5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.03] hover:shadow-lg">
                    Start Full Mock Test
                  </button>
                </div>
                <div className="relative hidden h-36 md:block">
                  <div className="absolute inset-0 rounded-full bg-indigo-200/50 blur-xl" />
                  <div className="absolute right-6 top-2 h-24 w-24 rounded-2xl border border-indigo-200 bg-white shadow-sm" />
                  <div className="absolute right-0 top-10 h-20 w-20 rounded-full border-8 border-indigo-300" />
                  <div className="absolute left-6 top-6 h-24 w-20 rounded-xl bg-gradient-to-b from-indigo-400 to-indigo-700" />
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-base font-semibold text-slate-900">Your Mock Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {statItems.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="mb-2 flex items-center gap-2 text-slate-500">
                      <Icon size={14} />
                      <span className="text-[11px]">{label}</span>
                    </div>
                    <p className="text-xl font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="mt-5 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900">Mock Exam Types</h3>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {examTypes.map(({ title, questions, time, icon: Icon }) => (
                  <article key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                      <Icon size={17} />
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-xs text-slate-500">{questions}</p>
                    <p className="text-xs text-slate-500">{time}</p>
                    <button className="mt-4 w-full rounded-lg border border-indigo-200 py-2 text-xs font-medium text-indigo-700 transition hover:bg-indigo-50">
                      Start Test
                    </button>
                  </article>
                ))}
              </div>

              <h3 className="mb-3 mt-5 text-xl font-semibold text-slate-900">Full Length Mock Tests</h3>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {fullMockTests.map((test, index) => (
                  <div
                    key={test.title}
                    className={`grid grid-cols-[1.8fr_0.7fr_0.6fr_0.8fr_auto] items-center gap-3 px-4 py-3 ${
                      index !== fullMockTests.length - 1 ? 'border-b border-slate-100' : ''
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{test.title}</p>
                      <p className="text-xs text-slate-500">{test.sections}</p>
                    </div>
                    <div className="text-xs text-slate-500">
                      <p>Level</p>
                      <p className="font-medium text-slate-700">{test.level}</p>
                    </div>
                    <div className="text-xs text-slate-500">
                      <p>Best</p>
                      <p className="font-medium text-slate-700">{test.best}</p>
                    </div>
                    <div className="text-xs text-slate-500">
                      <p>Taken</p>
                      <p className="font-medium text-slate-700">{test.taken}</p>
                    </div>
                    <button className="rounded-lg border border-indigo-200 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50">
                      {test.action}
                    </button>
                  </div>
                ))}
                <button className="w-full border-t border-slate-100 py-2 text-sm font-medium text-indigo-600 hover:bg-slate-50">
                  View All Mock Tests
                </button>
              </div>
            </div>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">Overall Performance</h3>
              <div className="mx-auto mt-4 grid h-40 w-40 place-items-center rounded-full bg-[conic-gradient(#4f46e5_72%,#e8eafc_72%)]">
                <div className="grid h-28 w-28 place-items-center rounded-full bg-white">
                  <p className="text-4xl font-bold text-slate-900">7.0</p>
                  <p className="text-xs text-slate-500">Overall Band</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {performanceRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2 text-slate-600">
                      <span className={`h-2 w-2 rounded-full ${row.color}`} />
                      {row.label}
                    </span>
                    <span className="font-semibold text-slate-800">{row.score}</span>
                  </div>
                ))}
              </div>
              <button className="mt-5 w-full rounded-xl border border-indigo-200 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50">
                See Detailed Report
              </button>
            </article>
          </section>
          <div className="pb-16 xl:pb-0" />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default MockExamPage
