import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpenCheck, Bot, ChartColumnBig, Flame, Trophy, UsersRound, Zap } from 'lucide-react'
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

function UnauthenticatedExperience({ onOpenRegister }) {
  const featureCards = useMemo(
    () => [
      { icon: Bot, title: 'AI Speaking Coach', description: 'Practice natural conversations and get instant feedback.' },
      { icon: BookOpenCheck, title: 'Smart Vocabulary', description: 'Spaced repetition and practical topic-based words.' },
      { icon: ChartColumnBig, title: 'Mock Exams', description: 'IELTS/TOEFL style tests with analytics and band estimate.' },
      { icon: UsersRound, title: 'Partner Matching', description: 'Connect with learners at your level and practice daily.' },
    ],
    [],
  )

  return (
    <div className="space-y-5 pb-20 xl:pb-0">
      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-7 shadow-sm">
        <p className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">LINGIFY DEMO</p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Speak English with AI &amp; Real People
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Prepare for IELTS/TOEFL faster with personalized speaking practice, vocabulary training, and real partner conversations.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onOpenRegister}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.03]"
          >
            Get Started Free
          </button>
          <button
            type="button"
            onClick={onOpenRegister}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Try Demo
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <LockedFeatureWrapper onClick={onOpenRegister}>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">Progress Preview</p>
            <div className="mt-4 h-40 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100" />
          </div>
        </LockedFeatureWrapper>
        <div className="space-y-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-600">{item.text}</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{item.name}</p>
            </article>
          ))}
        </div>
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

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar recommendedItem="Partner" />

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
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
            <PartnerLessonSection />
            <LearningModules />
            <BottomPanels />
            <div className="grid gap-3 md:grid-cols-2">
              <article className="rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/60 p-4">
                <p className="font-semibold text-indigo-800">Start your first AI conversation</p>
                <p className="text-sm text-indigo-700">Get instant speaking feedback in under 2 minutes.</p>
              </article>
              <article className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 p-4">
                <p className="font-semibold text-emerald-800">Learn your first 10 words</p>
                <p className="text-sm text-emerald-700">Build daily momentum with quick vocabulary drills.</p>
              </article>
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
