import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpenCheck, Bot, Calendar, ChartColumnBig, CirclePlay,
  Flame, GraduationCap, MessagesSquare, Target, Trophy, UsersRound, Zap,
} from 'lucide-react'
import { DailyChallengeWidget } from '../components/DailyChallengeWidget'
import { WordOfTheDay } from '../components/WordOfTheDay'
import { StreakCalendar } from '../components/StreakCalendar'
import BottomPanels from '../components/Cards/BottomPanels'
import LearningModules from '../components/Cards/LearningModules'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import OverviewCards from '../components/Cards/OverviewCards'
import PartnerLessonSection from '../components/Cards/PartnerLessonSection'
import FeatureCard from '../components/FeatureCard'
import { useUser } from '../context/UserContext'
import Header from '../components/Header'
import LockedFeatureWrapper from '../components/LockedFeatureWrapper'
import RegistrationModal from '../components/RegistrationModal'
import Sidebar from '../components/Sidebar'
import { useLessonProgress, useVocabulary } from '../hooks/useVocabulary'
import { getTestResults } from '../data/mockTests'
import { curriculum } from '../data/curriculum'

const testimonials = [
  { name: 'Madina, IELTS 7.5', text: 'Lingify speaking AI gave me confidence before my real IELTS exam.' },
  { name: 'Javohir, TOEFL 102', text: 'Daily micro-lessons and partner chats made my progress super fast.' },
]

const FEATURES = [
  { icon: Bot,          title: 'AI Speaking Coach',  desc: 'Inglizcha gapiring, xatolaringiz tuzatilsin. Har kuni 15 daqiqa.',        color: 'bg-violet-100 text-violet-700' },
  { icon: BookOpenCheck,title: 'Smart Vocabulary',    desc: 'So\'zlarni saqlang, papkalang, flashcard bilan takrorlang.',               color: 'bg-emerald-100 text-emerald-700' },
  { icon: ChartColumnBig,title:'Mock Imtihonlar',     desc: 'IELTS/TOEFL/SAT formatida real test toping. Band score ko\'ring.',         color: 'bg-amber-100 text-amber-700' },
  { icon: UsersRound,   title: 'Partner Matching',    desc: 'O\'z darajangizda partner toping, har kuni speaking mashq qiling.',        color: 'bg-sky-100 text-sky-700' },
  { icon: Target,       title: 'Daraja Testi',        desc: 'A0 dan C1 gacha 15 ta savol — darajangizni bilib oling.',                  color: 'bg-rose-100 text-rose-700' },
  { icon: Trophy,       title: 'Reyting',             desc: 'O\'zbekistondagi boshqa o\'rganuvchilar bilan raqobatlashing.',            color: 'bg-indigo-100 text-indigo-700' },
  { icon: GraduationCap,title: 'O\'qituvchi Kurslari',desc: 'Professional IELTS/TOEFL o\'qituvchilardan kurslar xarid qiling.',         color: 'bg-teal-100 text-teal-700' },
  { icon: MessagesSquare,title:'Real-time Chat',      desc: 'Partnerlar bilan matn va audio xabar almashing.',                          color: 'bg-pink-100 text-pink-700' },
]

const STATS = [
  { value: '5 200+', label: 'Faol o\'quvchilar' },
  { value: '24',     label: 'Professional o\'qituvchilar' },
  { value: '340+',   label: 'Dars va mashqlar' },
  { value: '4.9★',   label: 'O\'rtacha reyting' },
]

const TESTIMONIALS = [
  { name: 'Malika T.',    level: 'IELTS 7.5',  text: 'Speaking bo\'limida 8.0 oldim. Lingify\'dagi partner mashqlari juda foydali bo\'ldi!' },
  { name: 'Jasur K.',     level: 'TOEFL 114',  text: 'Har kuni 20 daqiqa AI speaking bilan mashq qildim. 3 oyda TOEFL ni yechimdim.' },
  { name: 'Dilnoza X.',   level: 'B2 darajasi',text: 'Vocabulary va flashcard tizimi zo\'r. 2 oyda 500+ so\'z o\'rgandim.' },
  { name: 'Sardor M.',    level: 'SAT 1450',   text: 'Mock testlar haqiqiy imtihonga juda o\'xshash. Natijam 200 ballga o\'sdi.' },
]

const PLANS = [
  {
    name: 'Bepul',
    price: '0',
    period: 'abadiy',
    color: 'border-slate-200 bg-white',
    btnColor: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
    features: ['3 ta dars/kun', '1 ta mock test/oy', '50 ta so\'z', 'Partner topish', 'Asosiy statistika'],
    notIncluded: ['AI Writing feedback', 'Cheksiz testlar', 'Sertifikat'],
  },
  {
    name: 'Premium',
    price: '49 000',
    period: '/oy',
    color: 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-violet-50 shadow-xl',
    btnColor: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md',
    badge: '🔥 Eng ko\'p tanlangan',
    features: ['Cheksiz darslar', 'Cheksiz mock testlar', 'Cheksiz vocabulary', 'AI Writing & Speaking feedback', 'Sertifikat', 'PDF natijalar', 'Priority partner matching'],
    notIncluded: [],
  },
]

function UnauthenticatedExperience({ onOpenRegister }) {
  return (
    <div className="space-y-8 pb-24 xl:pb-0">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 text-white shadow-xl md:p-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 right-24 h-40 w-40 rounded-full bg-violet-500/30" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            🇺🇿 O'zbek tilida ingliz tili platformasi
          </span>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Ingliz tilini<br />
            <span className="text-yellow-300">0 dan</span> o'rganing.
          </h1>
          <p className="mt-4 max-w-xl text-base text-indigo-200 md:text-lg">
            IELTS, TOEFL, SAT tayyorlov. AI Speaking Coach. Real partnerlar.
            O'zbek tilida tushuntirishlar bilan — hamma narsa bir joyda.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={onOpenRegister}
              className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow-lg transition hover:scale-[1.03] hover:shadow-xl">
              Bepul Boshlash →
            </button>
            <button onClick={onOpenRegister}
              className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
              Demo ko'rish
            </button>
          </div>
          {/* Mini stats */}
          <div className="mt-8 flex flex-wrap gap-6">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-black text-yellow-300">{value}</p>
                <p className="text-xs text-indigo-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section>
        <div className="mb-5 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Nima olasiz?</h2>
          <p className="mt-1 text-sm text-slate-500">Ingliz tilini o'rganishning barcha zarur vositalar bir platformada</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <article key={title} onClick={onOpenRegister}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                <Icon size={18} />
              </div>
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="rounded-3xl bg-slate-50 p-6 md:p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-slate-900">Qanday ishlaydi?</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { step: '01', icon: Target,       title: 'Daraja aniqlash',    desc: '15 savollik placement test orqali darajangizni biling' },
            { step: '02', icon: BookOpenCheck, title: 'Dars olish',         desc: 'O\'zbekcha tushuntirishli A0-C1 curriculum bo\'yicha o\'rganing' },
            { step: '03', icon: UsersRound,   title: 'Partner bilan mashq', desc: 'Speaking partnerini toping va har kuni gaplashing' },
            { step: '04', icon: CirclePlay,   title: 'Test topshiring',     desc: 'IELTS/TOEFL mock test topshiring, band score oling' },
          ].map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="flex flex-col items-center gap-3 text-center">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
                <Icon size={22} />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-white">
                  {step}
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-900">{title}</p>
                <p className="mt-1 text-xs text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section>
        <h2 className="mb-5 text-center text-2xl font-bold text-slate-900">Ularning natijalari</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    {t.level}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">"{t.text}"</p>
              <div className="mt-3 flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Narxlar</h2>
          <p className="mt-1 text-sm text-slate-500">Bepul boshlab, kerakli paytda Premium ga o'ting</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {PLANS.map((plan) => (
            <article key={plan.name} className={`relative rounded-3xl border-2 p-6 ${plan.color}`}>
              {plan.badge && (
                <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1 text-xs font-bold text-white shadow">
                  {plan.badge}
                </span>
              )}
              <p className="text-lg font-bold text-slate-900">{plan.name}</p>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                <span className="mb-1 text-sm text-slate-400">{plan.price !== '0' ? 'UZS' : ''} {plan.period}</span>
              </div>
              <ul className="mt-5 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-emerald-500">✓</span>{f}
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
                    <span>—</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={onOpenRegister}
                className={`mt-6 w-full rounded-2xl py-3 text-sm font-bold transition ${plan.btnColor}`}>
                {plan.name === 'Bepul' ? 'Bepul Boshlash' : 'Premium Olish'}
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Bugun boshlang. Ertaga kech bo'ladi.</h2>
        <p className="mt-2 text-indigo-200">5 200+ o'zbek yoshlari allaqachon o'rganmoqda.</p>
        <button onClick={onOpenRegister}
          className="mt-5 rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition hover:scale-105">
          Bepul Ro'yxatdan O'tish →
        </button>
      </section>

    </div>
  )
}

function PersonalizedDashboard() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { getTotalXP, getCompletedCount, progress } = useLessonProgress()
  const { totalWords, dueCount } = useVocabulary()
  const testResults = getTestResults()

  const totalXP = getTotalXP()
  const completedLessons = getCompletedCount()

  const nextLesson = curriculum.find((l) => !progress[l.id]?.completed)

  const greetHour = new Date().getHours()
  const greeting = greetHour < 12 ? 'Xayrli tong' : greetHour < 18 ? 'Xayrli kun' : 'Xayrli kech'

  const quickStats = [
    {
      label: 'Jami XP',
      value: totalXP.toLocaleString(),
      icon: Zap,
      color: 'text-indigo-600 bg-indigo-50',
      sub: 'Toplangan ball',
    },
    {
      label: 'Streak',
      value: `${user?.streak || 0} kun`,
      icon: Flame,
      color: 'text-orange-600 bg-orange-50',
      sub: 'Kunlik streak',
    },
    {
      label: 'Darslar',
      value: completedLessons,
      icon: BookOpenCheck,
      color: 'text-emerald-600 bg-emerald-50',
      sub: 'Tugatilgan',
    },
    {
      label: 'Testlar',
      value: testResults.length,
      icon: Trophy,
      color: 'text-violet-600 bg-violet-50',
      sub: 'Topshirilgan',
    },
  ]

  const firstName = user?.name?.split(' ')[0] || 'Omadbek'

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar recommendedItem="Partner" />

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <div className="md:hidden">
            <section className="space-y-4 pb-24">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-indigo-500 bg-indigo-100">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-sm font-bold text-indigo-700">
                        {firstName[0]}
                      </div>
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    B1
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-2xl font-bold text-slate-900">
                    {greeting}, {firstName} 👋
                  </p>
                  <p className="text-sm text-slate-500">Bugungi rejangiz tayyor. Davom eting!</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {quickStats.map(({ label, value, icon: Icon, color, sub }) => (
                  <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                      <Icon size={15} />
                    </div>
                    <p className="text-3xl font-bold leading-none text-slate-900">{value}</p>
                    <p className="mt-2 text-sm font-medium text-slate-700">{sub}</p>
                  </article>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Calendar size={14} />
                  </div>
                  <p className="text-xs font-semibold text-slate-400">KUNLIK REJA</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">Lug'at: {dueCount} so'z</p>
                  <p className="text-sm text-slate-700">Dars: Ingliz alifbosi</p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <CirclePlay size={14} />
                  </div>
                  <p className="text-xs font-semibold text-slate-400">DAVOM ETISH</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 line-clamp-2">
                    {nextLesson?.title || 'Ingliz alifbosi'}
                  </p>
                  {nextLesson && (
                    <button
                      onClick={() => navigate(`/lessons/${nextLesson.id}`)}
                      className="mt-1 text-xs font-medium text-indigo-600"
                    >
                      Davom etish →
                    </button>
                  )}
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <MessagesSquare size={14} />
                  </div>
                  <p className="text-xs font-semibold text-slate-400">FLASHCARD</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">1 ta so'z bugun</p>
                  <button
                    onClick={() => navigate('/flashcards')}
                    className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    Boshlash
                  </button>
                </article>
              </div>

              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Your level</p>
                <div className="mt-2 grid grid-cols-[1fr_1fr] items-center gap-3">
                  <div>
                    <p className="text-4xl font-bold text-slate-900">B1</p>
                    <p className="text-sm text-slate-500">Intermediate</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Target score</p>
                    <p className="text-3xl font-bold text-slate-900">IELTS 7.0</p>
                    <p className="text-sm text-slate-500">in 6 months</p>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[45%] rounded-full bg-indigo-600" />
                </div>
                <p className="mt-1 text-right text-xs text-slate-400">45% Completed</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Bugungi reja</p>
                  <Target size={14} className="text-indigo-500" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                    <span className="flex items-center gap-2"><GraduationCap size={14} className="text-indigo-500" />Speaking Practice</span>
                    <span className="text-slate-500">15 min</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                    <span className="flex items-center gap-2"><BookOpenCheck size={14} className="text-emerald-500" />Vocabulary</span>
                    <span className="text-slate-500">20 words</span>
                  </div>
                </div>
                <button className="mt-3 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 py-2.5 text-sm font-semibold text-white">
                  Start Now
                </button>
              </article>

              <article className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 shadow-sm">
                <p className="text-2xl font-semibold text-slate-900">Find a study partner</p>
                <p className="text-sm text-slate-600">Practice speaking and improve together.</p>
                <button
                  onClick={() => navigate('/partner')}
                  className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Find Partner
                </button>
              </article>
            </section>
          </div>

          <div className="hidden md:block">
            <Header
              title={`${greeting}, ${user?.name?.split(' ')[0] || 'Asadbek'} 👋`}
              subtitle="Bugungi rejangiz tayyor. Davom eting!"
            />

            {/* Real stats */}
            <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {quickStats.map(({ label, value, icon: Icon, color, sub }) => (
                <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                    <Icon size={15} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </article>
              ))}
            </div>

            {/* Action cards */}
            <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Kunlik reja</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">Lug'at: {dueCount} so'z takrorlash</p>
              <p className="text-sm font-semibold text-slate-800">Dars: {nextLesson?.title?.substring(0, 22) || 'Tugatildi ✅'}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Davom etish</p>
              <p className="mt-2 text-sm font-semibold text-slate-800 line-clamp-1">
                {nextLesson?.title || 'Barcha darslar bajarildi!'}
              </p>
              {nextLesson && (
                <button
                  onClick={() => navigate(`/lessons/${nextLesson.id}`)}
                  className="mt-2 text-xs font-medium text-indigo-600 hover:underline"
                >
                  Davom etish →
                </button>
              )}
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Flashcard</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{dueCount} ta so'z bugun</p>
              <button
                onClick={() => navigate('/flashcards')}
                className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white"
              >
                Boshlash
              </button>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Mock Test</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {testResults.length > 0
                  ? `So'nggi: ${testResults[0].testType} — ${testResults[0].band || testResults[0].correct + '/' + testResults[0].total}`
                  : 'Hali topshirilmagan'}
              </p>
              <button
                onClick={() => navigate('/mock-exam')}
                className="mt-2 text-xs font-medium text-indigo-600 hover:underline"
              >
                Testga borish →
              </button>
            </article>
            </div>

            <div className="space-y-4 pb-20 xl:pb-0">
            <OverviewCards />
            <DailyChallengeWidget />
            {/* Word of the Day + Streak Calendar */}
            <div className="grid gap-4 lg:grid-cols-2">
              <WordOfTheDay />
              <StreakCalendar />
            </div>
            <PartnerLessonSection />
            <LearningModules />
            <BottomPanels />
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}

function Dashboard() {
  const { user, registerDemoUser } = useUser()
  const [isRegisterOpen, setRegisterOpen] = useState(false)
  const isUnauthenticated = !user?.isAuthenticated

  if (!isUnauthenticated) return <PersonalizedDashboard />

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar locked onLockedClick={() => setRegisterOpen(true)} />
        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title="Lingify" subtitle="Modern AI-powered English learning platform." />
          <UnauthenticatedExperience onOpenRegister={() => setRegisterOpen(true)} />
        </main>
      </div>
      <MobileBottomNav locked onLockedClick={() => setRegisterOpen(true)} />
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setRegisterOpen(false)}
        onSubmit={(payload) => {
          registerDemoUser(payload)
          setRegisterOpen(false)
        }}
      />
    </div>
  )
}

export default Dashboard
