import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlarmClock, BarChart3, BookCheck, BookOpen, ChevronRight,
  ClipboardCheck, Crown, Headphones, Lock, Mic, PenLine,
  PlayCircle, Star, Trophy, Volume2,
} from 'lucide-react'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'
import { PremiumModal, usePremium } from '../components/PremiumModal'
import { CAMBRIDGE_CATALOG } from '../data/cambridgeIELTS'
import { TOEFL_CATALOG, SAT_CATALOG } from '../data/toeflSatTests'
import { getTestResults } from '../data/mockTests'

const EXAM_TABS = ['IELTS', 'TOEFL', 'SAT']

const IELTS_SECTIONS = [
  {
    id: 'listening',
    title: 'Listening',
    icon: Headphones,
    color: 'text-sky-600 bg-sky-100',
    desc: '30 + 10 daqiqa',
    questions: '40 savol',
    tips: ['4 bo\'lim', 'Audio bir marta', 'ONW WORD format'],
    section: 'listening',
  },
  {
    id: 'reading',
    title: 'Reading',
    icon: BookOpen,
    color: 'text-emerald-600 bg-emerald-100',
    desc: '60 daqiqa',
    questions: '40 savol',
    tips: ['3 passage', 'T/F/NG, MCQ, gap fill', 'Academic matnshunoslik'],
    section: 'reading',
  },
  {
    id: 'writing',
    title: 'Writing',
    icon: PenLine,
    color: 'text-amber-600 bg-amber-100',
    desc: '60 daqiqa',
    questions: 'Task 1 + Task 2',
    tips: ['Task 1: 150+ so\'z', 'Task 2: 250+ so\'z', 'Band 9 namunalar'],
    premium: true,
    section: 'writing',
  },
  {
    id: 'speaking',
    title: 'Speaking',
    icon: Mic,
    color: 'text-violet-600 bg-violet-100',
    desc: '11-14 daqiqa',
    questions: '3 qism',
    tips: ['Part 1: tanishuv', 'Part 2: cue card', 'Part 3: munozara'],
    section: 'speaking',
  },
]

const BAND_TABLE = [
  { band: 9.0,  score: '39-40', level: 'Expert',          color: 'bg-emerald-500' },
  { band: 8.5,  score: '37-38', level: 'Very Good',        color: 'bg-emerald-400' },
  { band: 8.0,  score: '35-36', level: 'Very Good',        color: 'bg-teal-400' },
  { band: 7.5,  score: '33-34', level: 'Good',             color: 'bg-sky-500' },
  { band: 7.0,  score: '30-32', level: 'Good',             color: 'bg-sky-400' },
  { band: 6.5,  score: '27-29', level: 'Competent',        color: 'bg-indigo-400' },
  { band: 6.0,  score: '23-26', level: 'Competent',        color: 'bg-indigo-300' },
  { band: 5.5,  score: '20-22', level: 'Modest',           color: 'bg-violet-400' },
  { band: 5.0,  score: '16-19', level: 'Modest',           color: 'bg-amber-400' },
  { band: 4.5,  score: '13-15', level: 'Limited',          color: 'bg-orange-400' },
  { band: 4.0,  score: '10-12', level: 'Limited',          color: 'bg-red-400' },
]

// ── Cambridge Book Card ───────────────────────────────────────────────────────
function CambridgeBookCard({ book, onStart }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}
      className={`rounded-2xl border-2 bg-white p-4 shadow-sm transition ${
        book.available ? 'border-indigo-200 cursor-pointer hover:shadow-md' : 'border-slate-100 opacity-60'
      }`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-xs font-bold text-indigo-600">{book.shortName}</p>
          <h3 className="mt-0.5 text-sm font-bold text-slate-900">{book.book}</h3>
          <p className="text-[11px] text-slate-400">{book.year} yil · {book.tests} test</p>
        </div>
        {book.available
          ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Audio ✓</span>
          : <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400">Tez orada</span>}
      </div>

      {book.available ? (
        <div className="grid grid-cols-2 gap-1.5">
          {book.tests_data.map((testId, i) => (
            <button key={testId} onClick={() => onStart(testId)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition">
              <PlayCircle size={12} />Test {i + 1}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-400">
          <Lock size={12} />Hali mavjud emas
        </div>
      )}
    </motion.div>
  )
}

// ── Section card ──────────────────────────────────────────────────────────────
function SectionCard({ section, onStart, openPremium }) {
  const Icon = section.icon
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${section.color}`}>
          <Icon size={20} />
        </div>
        {section.premium && (
          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
            <Crown size={9} />Premium
          </span>
        )}
      </div>
      <h3 className="font-bold text-slate-900">{section.title}</h3>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{section.questions}</p>
      <p className="text-xs text-slate-400">{section.desc}</p>

      <ul className="mt-3 space-y-1">
        {section.tips.map((t) => (
          <li key={t} className="flex items-start gap-1.5 text-xs text-slate-500">
            <span className="mt-0.5 shrink-0 text-indigo-400">•</span>{t}
          </li>
        ))}
      </ul>

      <button
        onClick={() => section.premium ? openPremium(section.title) : onStart(section.section)}
        className={`mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition ${
          section.premium
            ? 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
            : `border border-transparent ${section.color.replace('text-', 'text-').replace('bg-', 'hover:bg-')} border-current hover:shadow-sm`
        }`}>
        {section.premium ? <><Lock size={11} />Premium kerak</> : <><PlayCircle size={12} />Testni boshlash</>}
      </button>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
function MockExamPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [showBandTable, setShowBandTable] = useState(false)
  const { isOpen: premiumOpen, featureName, openPremium, closePremium } = usePremium()

  const results = getTestResults()
  const bestResult = results.length > 0
    ? results.reduce((b, r) => (!b || (r.band || 0) > (b.band || 0) ? r : b), null)
    : null

  const activeExam = EXAM_TABS[activeTab]

  function startCambridgeSection(testId, section) {
    navigate(`/exam/${testId}?section=${section}`)
  }

  function startFullTest(testId) {
    navigate(`/exam/${testId}?section=listening`)
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <PremiumModal isOpen={premiumOpen} onClose={closePremium} featureName={featureName} />

      <div className="flex w-full gap-5">
        <Sidebar />
        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title="Mock Imtihon" subtitle="Cambridge IELTS 1–19 · TOEFL iBT · SAT Digital" />

          {/* Exam tabs */}
          <div className="mb-5 flex items-center gap-2">
            {EXAM_TABS.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                  activeTab === i
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                {tab}
              </button>
            ))}
          </div>

          {/* ── IELTS ── */}
          {activeExam === 'IELTS' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid gap-3 sm:grid-cols-4">
                {[
                  { label: 'Topshirilgan', value: results.filter((r) => r.testType === 'IELTS').length, icon: ClipboardCheck },
                  { label: 'Eng yuqori band', value: bestResult?.band ?? '—', icon: Trophy },
                  { label: "O'rtacha", value: results.length ? (results.reduce((s, r) => s + (r.band || 0), 0) / results.length).toFixed(1) : '—', icon: BarChart3 },
                  { label: 'Jami vaqt', value: `${results.length * 35}daq`, icon: AlarmClock },
                ].map(({ label, value, icon: Icon }) => (
                  <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2 text-slate-400"><Icon size={13} /><p className="text-xs">{label}</p></div>
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                  </article>
                ))}
              </div>

              {/* Hero */}
              <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 p-6 text-white shadow-sm">
                <div className="grid items-center gap-4 md:grid-cols-[1fr_200px]">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                      <Volume2 size={11} />Real Cambridge Audio bilan
                    </div>
                    <h2 className="text-2xl font-black">Cambridge IELTS 11 — To'liq test</h2>
                    <p className="mt-1 text-sm text-indigo-200">
                      Haqiqiy audio · 4 bo'lim · Rasmiy vaqt · Band score hisoblash
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {['cambridge11-test1','cambridge11-test2','cambridge11-test3','cambridge11-test4'].map((id, i) => (
                        <button key={id} onClick={() => startFullTest(id)}
                          className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-2 text-xs font-bold text-white hover:bg-white/30 transition">
                          <PlayCircle size={12} />Test {i+1}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="hidden text-center md:block">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 text-5xl">
                      📚
                    </div>
                    <p className="mt-2 text-sm font-semibold">C11</p>
                  </div>
                </div>
              </section>

              {/* Section practice */}
              <div>
                <h3 className="mb-3 text-lg font-bold text-slate-900">Bo'limlar bo'yicha mashq</h3>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {IELTS_SECTIONS.map((s) => (
                    <SectionCard key={s.id} section={s}
                      onStart={(sec) => startCambridgeSection('cambridge11-test1', sec)}
                      openPremium={openPremium} />
                  ))}
                </div>
              </div>

              {/* Cambridge catalog */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">
                    Cambridge IELTS 1–19
                  </h3>
                  <span className="text-xs text-slate-400">76 ta to'liq test</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {CAMBRIDGE_CATALOG.map((book) => (
                    <CambridgeBookCard key={book.id} book={book}
                      onStart={(testId) => startFullTest(testId)} />
                  ))}
                </div>
              </div>

              {/* Band score table */}
              <div>
                <button onClick={() => setShowBandTable((v) => !v)}
                  className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline">
                  <BookCheck size={14} />
                  IELTS Band Score jadvali {showBandTable ? '▲' : '▼'}
                </button>
                {showBandTable && (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="grid grid-cols-3 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500">
                      <span>Band</span><span>To'g'ri (L/R)</span><span>Daraja</span>
                    </div>
                    {BAND_TABLE.map((row) => (
                      <div key={row.band} className="grid grid-cols-3 items-center border-t border-slate-100 px-4 py-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className={`h-3 w-3 rounded-full ${row.color}`} />
                          <span className="font-bold text-slate-900">{row.band}</span>
                        </div>
                        <span className="text-slate-600">{row.score}</span>
                        <span className="text-slate-500">{row.level}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TOEFL ── */}
          {activeExam === 'TOEFL' && (
            <div className="space-y-5">
              <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <h2 className="text-2xl font-black">TOEFL iBT Practice Tests</h2>
                <p className="mt-1 text-sm text-blue-200">ETS Official format · 0–120 ball · Reading, Listening, Speaking, Writing</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {[
                    { label: 'Reading', desc: '54 daqiqa · 30 savol', color: 'bg-blue-500/30' },
                    { label: 'Listening', desc: '41-57 daqiqa · 34 savol', color: 'bg-indigo-500/30' },
                    { label: 'Writing', desc: '50 daqiqa · 2 task', color: 'bg-violet-500/30' },
                  ].map(({ label, desc, color }) => (
                    <div key={label} className={`rounded-xl p-3 ${color}`}>
                      <p className="font-bold">{label}</p>
                      <p className="text-xs text-blue-200">{desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid gap-3 sm:grid-cols-3">
                {TOEFL_CATALOG.map((t) => (
                  <div key={t.id} className={`rounded-2xl border-2 p-5 ${t.available ? 'border-blue-200 bg-white cursor-pointer hover:shadow-md' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{t.title}</p>
                        <p className="text-xs text-slate-400">{t.source}</p>
                      </div>
                      {t.available
                        ? <Star size={14} className="text-amber-400" fill="currentColor" />
                        : <Lock size={14} className="text-slate-300" />}
                    </div>
                    <p className="text-xs text-slate-500">Ball: {t.score_range}</p>
                    <button
                      onClick={() => t.available ? navigate(`/mock-test/toefl-full-1`) : openPremium(t.title)}
                      className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition ${
                        t.available
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border border-slate-200 text-slate-400'
                      }`}>
                      {t.available ? <><PlayCircle size={12} />Boshlash</> : <><Lock size={11} />Tez orada</>}
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <h4 className="font-bold text-blue-900 mb-3">TOEFL iBT Ball hisoblash</h4>
                <div className="grid gap-2 sm:grid-cols-4 text-sm text-center">
                  {[
                    { label: 'Reading',   range: '0–30' },
                    { label: 'Listening', range: '0–30' },
                    { label: 'Speaking',  range: '0–30' },
                    { label: 'Writing',   range: '0–30' },
                  ].map(({ label, range }) => (
                    <div key={label} className="rounded-xl bg-white p-3 border border-blue-100">
                      <p className="text-lg font-black text-blue-800">{range}</p>
                      <p className="text-xs text-blue-500">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-blue-700">Jami: 0–120 ball. Ko'pchilik universitetlar 80+ yoki 90+ talab qiladi.</p>
              </div>
            </div>
          )}

          {/* ── SAT ── */}
          {activeExam === 'SAT' && (
            <div className="space-y-5">
              <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 p-6 text-white">
                <h2 className="text-2xl font-black">SAT Digital Practice Tests</h2>
                <p className="mt-1 text-sm text-red-200">College Board Official · 400–1600 ball · Digital SAT format</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {[
                    { label: 'Reading & Writing', desc: '64 daqiqa · 54 savol (2 modul)', color: 'bg-red-500/30' },
                    { label: 'Math', desc: '70 daqiqa · 44 savol (2 modul)', color: 'bg-rose-500/30' },
                  ].map(({ label, desc, color }) => (
                    <div key={label} className={`rounded-xl p-3 ${color}`}>
                      <p className="font-bold">{label}</p>
                      <p className="text-xs text-red-200">{desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid gap-3 sm:grid-cols-3">
                {SAT_CATALOG.map((t) => (
                  <div key={t.id} className={`rounded-2xl border-2 p-5 ${t.available ? 'border-red-200 bg-white cursor-pointer hover:shadow-md' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{t.title}</p>
                        <p className="text-xs text-slate-400">{t.source}</p>
                      </div>
                      {t.available
                        ? <Star size={14} className="text-amber-400" fill="currentColor" />
                        : <Lock size={14} className="text-slate-300" />}
                    </div>
                    <p className="text-xs text-slate-500">Ball: {t.score_range}</p>
                    <button
                      onClick={() => t.available ? navigate(`/mock-test/sat-full-1`) : openPremium(t.title)}
                      className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition ${
                        t.available
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'border border-slate-200 text-slate-400'
                      }`}>
                      {t.available ? <><PlayCircle size={12} />Boshlash</> : <><Lock size={11} />Tez orada</>}
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                <h4 className="font-bold text-red-900 mb-3">SAT Ball tuzilishi</h4>
                <div className="grid gap-2 sm:grid-cols-2 text-sm text-center">
                  {[
                    { label: 'Evidence-Based Reading & Writing', range: '200–800' },
                    { label: 'Math', range: '200–800' },
                  ].map(({ label, range }) => (
                    <div key={label} className="rounded-xl bg-white p-4 border border-red-100">
                      <p className="text-2xl font-black text-red-800">{range}</p>
                      <p className="text-xs text-red-500">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-red-700">
                  Jami: 400–1600. Ivy League universitetlar ko'pincha 1400+ talab qiladi.
                </p>
              </div>

              {/* Math formula sheet hint */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h4 className="mb-3 font-bold text-slate-900">📐 SAT Math — Muhim formulalar</h4>
                <div className="grid gap-2 text-xs sm:grid-cols-3">
                  {[
                    { f: 'A = πr²', l: 'Doira yuzi' },
                    { f: 'C = 2πr', l: 'Doira uzunligi' },
                    { f: 'a² + b² = c²', l: 'Pifagor teoremasi' },
                    { f: 'V = lwh', l: 'Parallelepiped hajmi' },
                    { f: 'A = ½bh', l: 'Uchburchak yuzi' },
                    { f: 'y = mx + b', l: 'To\'g\'ri chiziq tenglamasi' },
                  ].map(({ f, l }) => (
                    <div key={f} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-center">
                      <p className="font-mono font-bold text-slate-800">{f}</p>
                      <p className="text-slate-400">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recent results */}
          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-base font-bold text-slate-900">So'nggi natijalar</h3>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {results.slice(0, 5).map((r, i) => (
                  <div key={r.id} className={`flex items-center gap-3 px-4 py-3 ${i < results.length - 1 && i < 4 ? 'border-b border-slate-100' : ''}`}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-black text-indigo-700">
                      {r.band ?? `${r.correct}/${r.total}`}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{r.testTitle}</p>
                      <p className="text-xs text-slate-400">{r.testType} · {r.correct}/{r.total} to'g'ri</p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">
                      {r.takenAt ? new Date(r.takenAt).toLocaleDateString('uz-UZ') : ''}
                    </span>
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

export default MockExamPage
