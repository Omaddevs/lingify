import { BookOpenCheck, ChevronRight, Flame, Star, Volume2 } from 'lucide-react'
import Header from '../components/Header'
import MobileBottomNav from '../components/Cards/MobileBottomNav'
import Sidebar from '../components/Sidebar'

const stats = [
  { title: 'Words Learned', value: '1,248', note: '+24 this week', icon: BookOpenCheck },
  { title: 'Words to Review', value: '56', note: 'Review and reinforce', icon: BookOpenCheck },
  { title: 'Current Streak', value: '12 days', note: 'Keep it up! 🔥', icon: Flame },
  { title: 'Mastery Rate', value: '78%', note: '+6% this week', icon: BookOpenCheck },
]

const categories = [
  { title: 'Academic Words', words: '320 words', progress: 35, color: 'bg-emerald-500' },
  { title: 'Daily Life', words: '280 words', progress: 42, color: 'bg-sky-500' },
  { title: 'Business', words: '250 words', progress: 30, color: 'bg-indigo-500' },
  { title: 'IELTS Words', words: '450 words', progress: 48, color: 'bg-red-500' },
  { title: 'Phrasal Verbs', words: '180 words', progress: 26, color: 'bg-amber-500' },
  { title: 'SAT Words', words: '300 words', progress: 38, color: 'bg-blue-500' },
]

const words = [
  { term: 'Comprehensive', meaning: 'Including or dealing with all or nearly all elements.', level: 'Advanced' },
  { term: 'Meticulous', meaning: 'Showing great attention to detail; very careful.', level: 'Advanced', favorite: true },
  { term: 'Evident', meaning: 'Clearly seen or understood; obvious.', level: 'Intermediate' },
  { term: 'Collaborate', meaning: 'To work jointly on an activity or project.', level: 'Beginner' },
]

function VocabularyPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
      <div className="flex w-full gap-5">
        <Sidebar activeItem="Vocabulary" />

        <main className="min-h-[calc(100vh-40px)] w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-md md:p-6">
          <Header title="Vocabulary" subtitle="Expand your vocabulary. One word at a time." />

          <section className="grid gap-3 md:grid-cols-4">
            {stats.map(({ title, value, note, icon: Icon }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <Icon size={14} />
                  <p className="text-xs">{title}</p>
                </div>
                <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
                <p className="mt-1 text-xs text-emerald-600">{note}</p>
              </article>
            ))}
          </section>

          <section className="mt-4 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-500 to-violet-500 p-5 text-white shadow-sm">
            <div className="grid items-center gap-4 md:grid-cols-[1fr_260px]">
              <div>
                <p className="text-sm text-indigo-100">Today&apos;s Goal</p>
                <h2 className="mt-1 text-3xl font-bold">Learn 20 new words</h2>
                <div className="mt-4 h-2 rounded-full bg-white/30">
                  <div className="h-full w-[70%] rounded-full bg-white" />
                </div>
                <p className="mt-1 text-right text-xs text-indigo-100">14 / 20 words</p>
                <button className="mt-3 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700">Continue Learning</button>
              </div>
              <div className="relative hidden h-28 md:block">
                <div className="absolute right-12 top-2 h-20 w-24 rounded-lg bg-indigo-300/90" />
                <div className="absolute right-6 top-7 h-20 w-24 rounded-lg bg-emerald-300/90" />
                <div className="absolute right-0 top-12 h-20 w-24 rounded-lg bg-violet-300/90" />
              </div>
            </div>
          </section>

          <section className="mt-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Categories</h3>
              <button className="text-sm font-medium text-indigo-600">View all</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
              {categories.map((item) => (
                <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.words}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="h-1.5 w-12 rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.progress}%` }} />
                    </div>
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-4 grid gap-4 pb-16 lg:grid-cols-[1.6fr_0.9fr] xl:pb-0">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Recommended for You</h3>
              </div>
              <div className="space-y-2">
                {words.map((word) => (
                  <div key={word.term} className="flex items-start justify-between rounded-xl border border-slate-100 p-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800">{word.term}</p>
                        <button className="text-slate-400 hover:text-indigo-600">
                          <Volume2 size={14} />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{word.meaning}</p>
                    </div>
                    <div className="ml-3 flex items-center gap-2">
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600">{word.level}</span>
                      <button className={word.favorite ? 'text-amber-500' : 'text-slate-300'}>
                        <Star size={14} fill={word.favorite ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full rounded-xl border border-slate-200 py-2 text-sm font-medium text-indigo-600 hover:bg-slate-50">
                View All Words
              </button>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Word Mastery</h3>
              <div className="mx-auto mt-4 grid h-40 w-40 place-items-center rounded-full bg-[conic-gradient(#34d399_78%,#60a5fa_93%,#c4b5fd_100%)]">
                <div className="grid h-28 w-28 place-items-center rounded-full bg-white">
                  <p className="text-4xl font-bold text-slate-900">78%</p>
                  <p className="text-xs text-slate-500">Overall</p>
                </div>
              </div>
              <div className="mt-5 space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-slate-600">Mastered</span><span className="font-semibold text-slate-800">78%</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-600">Learning</span><span className="font-semibold text-slate-800">15%</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-600">New</span><span className="font-semibold text-slate-800">7%</span></div>
              </div>
              <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg">
                Practice Now
              </button>
              <button className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700">
                Quick Practice
              </button>
            </article>
          </section>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

export default VocabularyPage
