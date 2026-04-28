import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Globe,
  Headphones,
  Search,
  Trophy,
  Zap,
} from 'lucide-react'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'
import { curriculum, LEVEL_LABELS, getLessonsByLevel, groupByUnit } from '../data/curriculum'
import { useLessonProgress } from '../hooks/useVocabulary'
import { useUser } from '../context/UserContext'

const CATEGORIES = ['Hammasi', 'A0', 'A1', 'A2', 'B1', 'B2', 'C1']

const PATH_META = [
  { level: 'A0', title: 'Mutlaq Boshlang\'ich', icon: Globe,        color: 'text-slate-600 bg-slate-100' },
  { level: 'A1', title: 'Boshlang\'ich',         icon: Globe,        color: 'text-emerald-600 bg-emerald-100' },
  { level: 'A2', title: 'Elementar',             icon: BookOpenCheck, color: 'text-sky-600 bg-sky-100' },
  { level: 'B1', title: 'O\'rta',                icon: BookOpen,     color: 'text-indigo-600 bg-indigo-100' },
  { level: 'B2', title: 'Yuqori O\'rta',         icon: Headphones,   color: 'text-violet-600 bg-violet-100' },
  { level: 'C1', title: 'Ilg\'or',               icon: Trophy,       color: 'text-amber-600 bg-amber-100' },
]

const TYPE_LABELS = {
  grammar: 'Grammatika',
  vocabulary: 'So\'z boyligi',
  listening: 'Tinglash',
  reading: 'O\'qish',
}

const TYPE_COLORS = {
  grammar: 'bg-indigo-100 text-indigo-700',
  vocabulary: 'bg-emerald-100 text-emerald-700',
  listening: 'bg-sky-100 text-sky-700',
  reading: 'bg-amber-100 text-amber-700',
}

const LEVEL_COLORS = {
  A0: 'bg-slate-100 text-slate-600',
  A1: 'bg-emerald-100 text-emerald-700',
  A2: 'bg-sky-100 text-sky-700',
  B1: 'bg-indigo-100 text-indigo-700',
  B2: 'bg-violet-100 text-violet-700',
  C1: 'bg-amber-100 text-amber-700',
}

function LessonCard({ lesson, completed, onClick }) {
  return (
    <article
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        completed ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'
      }`}
    >
      {completed && (
        <div className="absolute right-3 top-3">
          <CheckCircle2 size={16} className="text-emerald-500" />
        </div>
      )}

      <div className="mb-3 flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${LEVEL_COLORS[lesson.level]}`}>
          {lesson.level}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${TYPE_COLORS[lesson.type]}`}>
          {TYPE_LABELS[lesson.type] || lesson.type}
        </span>
      </div>

      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700">
        {lesson.title}
      </h4>
      <p className="mt-1 line-clamp-2 text-xs text-slate-500">{lesson.description}</p>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {lesson.duration}
          </span>
          <span className="flex items-center gap-1">
            <Zap size={10} />
            +{lesson.xp} XP
          </span>
        </div>
        <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500" />
      </div>
    </article>
  )
}

function UnitSection({ unit, progress, onLessonClick }) {
  const [expanded, setExpanded] = useState(true)
  const completedCount = unit.lessons.filter((l) => progress[l.id]?.completed).length

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div>
          <p className="text-xs font-medium text-slate-400">Unit {unit.number}</p>
          <h3 className="mt-0.5 font-semibold text-slate-900">{unit.title}</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-400">
              {completedCount}/{unit.lessons.length} dars
            </p>
            <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${(completedCount / unit.lessons.length) * 100}%` }}
              />
            </div>
          </div>
          <ChevronRight
            size={16}
            className={`shrink-0 text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="grid gap-3 border-t border-slate-100 p-4 sm:grid-cols-2">
          {unit.lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              completed={!!progress[lesson.id]?.completed}
              onClick={() => onLessonClick(lesson)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function OnlineLessonsPage() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { progress, getCompletedCount } = useLessonProgress()

  const [activeCategory, setActiveCategory] = useState('Hammasi')
  const [search, setSearch] = useState('')

  const userLevel = user?.level || 'A0'

  const filteredLessons = useMemo(() => {
    let lessons = activeCategory === 'Hammasi' ? curriculum : getLessonsByLevel(activeCategory)
    if (search) {
      lessons = lessons.filter(
        (l) =>
          l.title.toLowerCase().includes(search.toLowerCase()) ||
          l.description?.toLowerCase().includes(search.toLowerCase()),
      )
    }
    return lessons
  }, [activeCategory, search])

  const unitGroups = useMemo(() => groupByUnit(filteredLessons), [filteredLessons])

  const recentlyCompleted = curriculum.filter((l) => progress[l.id]?.completed).slice(0, 3)

  const currentLevelLessons = getLessonsByLevel(userLevel)
  const nextLesson = currentLevelLessons.find((l) => !progress[l.id]?.completed)

  function handleLessonClick(lesson) {
    navigate(`/lessons/${lesson.id}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar />

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title="Online Darslar" subtitle="O'zbek tilida ingliz tilini 0 dan o'rganing" />

          {/* Search + Filter */}
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 lg:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-indigo-300"
                  placeholder="Dars qidirish..."
                />
              </div>
              <button
                onClick={() => navigate('/placement-test')}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                <Filter size={13} />
                Daraja testi
              </button>
            </div>
          </div>

          {/* Hero banner */}
          <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5 shadow-sm">
            <div className="grid items-center gap-4 md:grid-cols-[1fr_260px]">
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Sizning darajangiz: {LEVEL_LABELS[userLevel] || userLevel}
                </div>
                <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-900">
                  Qadam qadam o'rganing. Maqsadingizga erishing.
                </h2>
                <p className="mt-2 max-w-md text-sm text-slate-600">
                  {getCompletedCount()} ta dars tugatildi. Davom eting!
                </p>
                <div className="mt-4 flex gap-3">
                  {nextLesson && (
                    <button
                      onClick={() => handleLessonClick(nextLesson)}
                      className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.03]"
                    >
                      Davom etish →
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/placement-test')}
                    className="rounded-xl border border-indigo-200 px-4 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                  >
                    Daraja testi
                  </button>
                </div>
              </div>
              <div className="relative hidden h-32 md:block">
                <div className="absolute inset-0 rounded-full bg-indigo-200/40 blur-xl" />
                <div className="absolute right-10 top-3 h-24 w-20 rounded-[28px] bg-gradient-to-b from-indigo-400 to-indigo-700" />
                <div className="absolute right-0 top-5 h-24 w-20 rounded-[28px] bg-gradient-to-b from-amber-300 to-amber-500" />
                <div className="absolute left-6 top-6 h-16 w-16 rounded-full bg-indigo-300/30" />
              </div>
            </div>
          </section>

          {/* Learning paths */}
          {activeCategory === 'Hammasi' && !search && (
            <section className="mt-5">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">O'rganish yo'llari</h3>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                {PATH_META.map(({ level, title, icon: Icon, color }) => {
                  const levelLessons = getLessonsByLevel(level)
                  const completedInLevel = levelLessons.filter((l) => progress[l.id]?.completed).length
                  const pct = levelLessons.length ? Math.round((completedInLevel / levelLessons.length) * 100) : 0
                  const isCurrentLevel = level === userLevel

                  return (
                    <article
                      key={level}
                      onClick={() => setActiveCategory(level)}
                      className={`cursor-pointer rounded-2xl border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                        isCurrentLevel
                          ? 'border-indigo-300 bg-indigo-50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className={`grid h-9 w-9 place-items-center rounded-lg ${color}`}>
                        <Icon size={15} />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-800">{level}</p>
                      <p className="text-xs text-slate-500">{title}</p>
                      <p className="mt-1 text-[11px] text-indigo-600">{levelLessons.length} ta dars</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-indigo-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="ml-2 text-[10px] text-slate-400">{pct}%</span>
                      </div>
                      {isCurrentLevel && (
                        <p className="mt-1 text-[10px] font-semibold text-indigo-600">Joriy daraja ✓</p>
                      )}
                    </article>
                  )
                })}
              </div>
            </section>
          )}

          {/* Continue section */}
          {!search && recentlyCompleted.length > 0 && (
            <section className="mt-5">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">Davom ettirish</h3>
              <div className="grid gap-3 md:grid-cols-3">
                {recentlyCompleted.map((lesson) => (
                  <article
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3 transition hover:bg-emerald-100"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-200 text-emerald-700">
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{lesson.title}</p>
                      <p className="text-xs text-emerald-600">Bajarilgan ✓</p>
                    </div>
                    <button className="rounded-lg bg-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-800">
                      Qaytarish
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Units & Lessons */}
          <section className="mt-5 space-y-4 pb-16 xl:pb-0">
            <h3 className="text-lg font-semibold text-slate-900">
              {activeCategory === 'Hammasi' ? 'Barcha Darslar' : `${activeCategory} — ${LEVEL_LABELS[activeCategory] || ''}`}
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({filteredLessons.length} ta dars)
              </span>
            </h3>

            {unitGroups.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center text-slate-400">
                <BookOpen size={40} className="mb-3 opacity-30" />
                <p>Dars topilmadi</p>
              </div>
            ) : (
              unitGroups.map((unit) => (
                <UnitSection
                  key={unit.id}
                  unit={unit}
                  progress={progress}
                  onLessonClick={handleLessonClick}
                />
              ))
            )}
          </section>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default OnlineLessonsPage
