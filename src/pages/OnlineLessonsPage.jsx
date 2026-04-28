import {
  BookOpen,
  BookOpenCheck,
  ChevronRight,
  Filter,
  Globe,
  Headphones,
  Search,
  Trophy,
} from 'lucide-react'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'

const categories = ['All', 'Beginner', 'IELTS', 'TOEFL', 'SAT', 'Speaking', 'Grammar', 'Listening', 'Reading', 'Writing']

const paths = [
  { title: 'Beginner', level: 'A1 - A2', lessons: '120+ Lessons', icon: Globe, color: 'text-emerald-600 bg-emerald-100' },
  { title: 'Intermediate', level: 'B1 - B2', lessons: '150+ Lessons', icon: BookOpenCheck, color: 'text-sky-600 bg-sky-100' },
  { title: 'Advanced', level: 'C1 - C2', lessons: '100+ Lessons', icon: Trophy, color: 'text-amber-600 bg-amber-100' },
  { title: 'IELTS', level: 'Band 0 - 9', lessons: '200+ Lessons', icon: Headphones, color: 'text-violet-600 bg-violet-100' },
  { title: 'TOEFL', level: '0 - 120', lessons: '180+ Lessons', icon: BookOpen, color: 'text-indigo-600 bg-indigo-100' },
  { title: 'SAT', level: '400 - 1600', lessons: '160+ Lessons', icon: Trophy, color: 'text-orange-600 bg-orange-100' },
]

const popularLessons = [
  { title: 'English for Beginners', meta: 'A1 - A2', lessons: '24 Lessons', tag: 'Beginner', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&q=80' },
  { title: 'IELTS Speaking Masterclass', meta: 'Band 6.5+', lessons: '18 Lessons', tag: 'IELTS', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80' },
  { title: 'TOEFL Listening Practice', meta: '80+ Score', lessons: '20 Lessons', tag: 'TOEFL', image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=500&q=80' },
  { title: 'SAT Math Full Course', meta: '600+ Score', lessons: '30 Lessons', tag: 'SAT', image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=500&q=80' },
]

const continueLessons = [
  { title: 'Present Perfect Tense', type: 'Grammar', progress: 65, image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80' },
  { title: 'IELTS Writing Task 2', type: 'IELTS', progress: 40, image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&q=80' },
  { title: 'Listening Short Conversations', type: 'Listening', progress: 75, image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&q=80' },
]

function OnlineLessonsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar /> {/* FIXED: [2] activeItem prop removed */}

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title="Online Lessons" subtitle="Learn with expert teachers and structured lessons" />

          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((item, index) => (
                <button
                  key={item}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    index === 0
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 lg:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-indigo-300"
                  placeholder="Search lessons..."
                />
              </div>
              <button className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50">
                <Filter size={14} />
                Filters
              </button>
            </div>
          </div>

          <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5 shadow-sm">
            <div className="grid items-center gap-4 md:grid-cols-[1fr_260px]">
              <div>
                <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900">
                  Learn step by step.
                  <br />
                  Achieve your goal.
                </h2>
                <p className="mt-2 max-w-md text-sm text-slate-600">
                  Choose your level and start learning with structured lessons.
                </p>
                <button className="mt-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.03] hover:shadow-lg">
                  Start Learning
                </button>
              </div>
              <div className="relative hidden h-32 md:block">
                <div className="absolute inset-0 rounded-full bg-indigo-200/40 blur-xl" />
                <div className="absolute right-10 top-3 h-24 w-20 rounded-[28px] rounded-b-lg bg-gradient-to-b from-indigo-400 to-indigo-700" />
                <div className="absolute right-0 top-5 h-24 w-20 rounded-[28px] rounded-b-lg bg-gradient-to-b from-amber-300 to-amber-500" />
                <div className="absolute left-6 top-6 h-16 w-16 rounded-full bg-indigo-300/30" />
              </div>
            </div>
          </section>

          <section className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Choose your learning path</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
              {paths.map(({ title, level, lessons, icon: Icon, color }) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className={`grid h-8 w-8 place-items-center rounded-lg ${color}`}>
                    <Icon size={15} />
                  </div>
                  <p className="mt-3 text-base font-semibold text-slate-800">{title}</p>
                  <p className="text-sm font-medium text-indigo-600">{level}</p>
                  <p className="mt-1 text-xs text-slate-500">{lessons}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="h-1.5 w-12 rounded-full bg-slate-100">
                      <div className="h-full w-6 rounded-full bg-indigo-500" />
                    </div>
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Popular Lessons</h3>
              <button className="text-sm font-medium text-indigo-600">View all</button>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {popularLessons.map((lesson) => (
                <article key={lesson.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                  <img src={lesson.image} alt={lesson.title} className="h-24 w-full object-cover" />
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-semibold text-slate-800">{lesson.title}</p>
                    <p className="mt-1 text-xs text-indigo-600">{lesson.meta}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{lesson.lessons}</span>
                      <span>{lesson.tag}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-5 pb-16 xl:pb-0">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Continue Learning</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {continueLessons.map((item) => (
                <article key={item.title} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
                  <img src={item.image} alt={item.title} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.type}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700" style={{ width: `${item.progress}%` }} />
                      </div>
                      <span className="text-[11px] font-medium text-slate-500">{item.progress}%</span>
                    </div>
                  </div>
                  <button className="rounded-lg bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">Continue</button>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default OnlineLessonsPage
