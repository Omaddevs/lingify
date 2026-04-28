import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlarmClock,
  BarChart3,
  BookCheck,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Crown,
  Headphones,
  Lock,
  Mic,
  PenLine,
  Trophy,
} from 'lucide-react'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'
import { PremiumModal, usePremium } from '../components/PremiumModal'
import { TEST_CATALOG, getTestResults, calculateBandScore } from '../data/mockTests'

const examTabs = ['IELTS', 'TOEFL', 'SAT', 'PTE']

const examTypesMeta = {
  IELTS: [
    { title: 'Listening', questions: '40 Savol', time: '30 daq', icon: Headphones, testId: 'ielts-cambridge-library-listening' },
    { title: 'Reading',   questions: '40 Savol', time: '60 daq', icon: BookCheck,  testId: 'ielts-cambridge-library-reading' },
    { title: 'Writing',   questions: '2 Topshiriq', time: '60 daq', icon: PenLine, testId: 'ielts-writing-1', premium: true },
    { title: 'Speaking',  questions: '3 Qism', time: '11-14 daq', icon: Mic, testId: null },
  ],
  TOEFL: [
    { title: 'Reading',   questions: '36-56 Savol', time: '54-72 daq', icon: BookCheck, testId: 'toefl-reading-1' },
    { title: 'Listening', questions: '28-39 Savol', time: '41-57 daq', icon: Headphones, testId: null },
    { title: 'Speaking',  questions: '4 Topshiriq', time: '17 daq', icon: Mic, testId: null },
    { title: 'Writing',   questions: '2 Topshiriq', time: '50 daq', icon: PenLine, testId: null, premium: true },
  ],
  SAT: [
    { title: 'Math (No Calc)', questions: '20 Savol', time: '25 daq', icon: BookCheck, testId: 'sat-math-1' },
    { title: 'Math (Calc)',    questions: '38 Savol', time: '55 daq', icon: BookCheck, testId: null },
    { title: 'Reading',        questions: '52 Savol', time: '65 daq', icon: BookCheck, testId: null },
    { title: 'Writing/Lang',   questions: '44 Savol', time: '35 daq', icon: PenLine,   testId: null },
  ],
  PTE: [
    { title: 'Speaking & Writing', questions: 'Aralash', time: '77-93 daq', icon: Mic, testId: null },
    { title: 'Reading',             questions: 'Aralash', time: '32-41 daq', icon: BookCheck, testId: null },
    { title: 'Listening',           questions: 'Aralash', time: '45-57 daq', icon: Headphones, testId: null },
  ],
}

function MockExamPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const { isOpen: premiumOpen, featureName, openPremium, closePremium } = usePremium()

  const results = getTestResults()
  const bestResult = results.length > 0
    ? results.reduce((best, r) => (!best || (r.band || 0) > (best.band || 0) ? r : best), null)
    : null

  const activeExam = examTabs[activeTab]
  const currentTypes = examTypesMeta[activeExam] || []

  const fullTests = TEST_CATALOG.filter((t) => t.type === activeExam)

  function handleStartSection(section) {
    if (section.premium) { openPremium(section.title); return }
    if (section.testId) {
      navigate(`/mock-test/${section.testId}`)
    } else {
      openPremium(`${activeExam} ${section.title}`)
    }
  }

  function handleStartFull(test) {
    if (test.premium) { openPremium(test.title); return }
    navigate(`/mock-test/${test.id}`)
  }

  const statItems = [
    { label: 'Topshirilgan', value: results.length, icon: ClipboardCheck },
    { label: 'Eng yaxshi ball', value: bestResult?.band ?? '—', icon: BookCheck },
    { label: "O'rtacha", value: results.length ? (results.reduce((s, r) => s + (r.band || 0), 0) / results.length).toFixed(1) : '—', icon: BarChart3 },
    { label: 'Jami vaqt', value: `${results.length * 30}daq`, icon: AlarmClock },
  ]

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <PremiumModal isOpen={premiumOpen} onClose={closePremium} featureName={featureName} />

      <div className="flex w-full gap-5">
        <Sidebar />

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title="Mock Imtihon" subtitle="Haqiqiy imtihon muhitini simulyatsiya qiling" />

          {/* Exam type tabs */}
          <section className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {examTabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    activeTab === index
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
              Barcha darajalar
              <ChevronDown size={14} />
            </button>
          </section>

          {/* Hero + Stats */}
          <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <article className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-6 shadow-sm">
              <div className="grid items-center gap-4 md:grid-cols-[1fr_180px]">
                <div>
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                    <Trophy size={11} />
                    {activeExam} Mock Test
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    To'liq uzunlikdagi mock imtihon
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-slate-600">
                    Haqiqiy {activeExam} imtihon muhitini boshdan kechiring va ball bahoingizni biling.
                  </p>
                  <button
                    onClick={() => handleStartFull(fullTests[0] || { id: 'ielts-reading-1', type: 'IELTS', premium: false })}
                    className="mt-5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.03] hover:shadow-lg"
                  >
                    To'liq Mock Test Boshlash
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
              <h3 className="mb-3 text-base font-semibold text-slate-900">Sizning natijalaringiz</h3>
              <div className="grid grid-cols-2 gap-3">
                {statItems.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="mb-2 flex items-center gap-2 text-slate-400">
                      <Icon size={13} />
                      <span className="text-[11px]">{label}</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          {/* Section types */}
          <section className="mt-5 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900">Bo'limlar bo'yicha mashq</h3>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {currentTypes.map(({ title, questions, time, icon: Icon, testId, premium }) => (
                  <article key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                      <Icon size={17} />
                    </div>
                    <div className="mt-3 flex items-center gap-1.5">
                      <p className="text-base font-semibold text-slate-900">{title}</p>
                      {premium && <Crown size={13} className="text-amber-500" />}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{questions}</p>
                    <p className="text-xs text-slate-500">{time}</p>
                    <button
                      onClick={() => handleStartSection({ title, testId, premium })}
                      className={`mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition ${
                        premium
                          ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                      }`}
                    >
                      {premium && <Lock size={11} />}
                      {testId || !premium ? 'Testni boshlash' : 'Premium kerak'}
                    </button>
                  </article>
                ))}
              </div>

              {/* Full tests list */}
              <h3 className="mb-3 mt-5 text-xl font-semibold text-slate-900">To'liq Mock Testlar</h3>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {fullTests.map((test, index) => (
                  <div
                    key={test.id}
                    className={`flex items-center gap-3 px-4 py-3 ${
                      index !== fullTests.length - 1 ? 'border-b border-slate-100' : ''
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800">{test.title}</p>
                        {test.premium && <Crown size={13} className="text-amber-500" />}
                      </div>
                      <p className="text-xs text-slate-500">
                        {test.sections.join(' · ')} — {test.totalTime} daq · {test.questions} savol
                      </p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-slate-400">
                      <p>Daraja</p>
                      <p className="font-medium text-slate-700">{test.level}</p>
                    </div>
                    <button
                      onClick={() => handleStartFull(test)}
                      className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        test.premium
                          ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                      }`}
                    >
                      {test.premium ? <span className="flex items-center gap-1"><Lock size={10} />Premium</span> : 'Boshlash'}
                    </button>
                  </div>
                ))}
                {fullTests.length === 0 && (
                  <p className="py-6 text-center text-sm text-slate-400">Tez orada qo'shiladi</p>
                )}
              </div>
            </div>

            {/* Performance panel */}
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">Umumiy Ko'rsatkich</h3>
              <div className="mx-auto mt-4 grid h-40 w-40 place-items-center rounded-full bg-[conic-gradient(#4f46e5_72%,#e8eafc_72%)]">
                <div className="grid h-28 w-28 place-items-center rounded-full bg-white">
                  <p className="text-4xl font-bold text-slate-900">
                    {bestResult?.band ?? '—'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {bestResult ? 'Eng yuqori' : 'Hali yo\'q'}
                  </p>
                </div>
              </div>

              {results.length > 0 ? (
                <div className="mt-5 space-y-2">
                  {results.slice(0, 4).map((r, i) => (
                    <div key={r.id} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-600">
                        <span className="h-2 w-2 rounded-full bg-indigo-400" />
                        {r.testTitle?.substring(0, 18) || 'Test'}...
                      </span>
                      <span className="font-semibold text-slate-800">
                        {r.band || `${r.correct}/${r.total}`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-center text-xs text-slate-400">
                  Hali test topshirilmagan. Birinchi testni boshlang!
                </p>
              )}

              <button
                onClick={() => navigate('/progress')}
                className="mt-5 w-full rounded-xl border border-indigo-200 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
              >
                Batafsil ko'rish
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
