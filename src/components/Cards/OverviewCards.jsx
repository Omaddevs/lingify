import { CheckCircle2, Mic, Sparkles } from 'lucide-react'

function CircleProgress() {
  return (
    <div className="relative h-24 w-24">
      <div className="absolute inset-0 rounded-full border-[10px] border-indigo-100" />
      <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-primary border-r-primary rotate-[35deg]" />
      <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-slate-800">60%</div>
    </div>
  )
}

function OverviewCards() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className="dashboard-card">
        <p className="text-sm text-slate-500">Your Level</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold tracking-tight text-slate-900">B1</p>
            <p className="text-sm text-slate-500">Intermediate</p>
          </div>
          <CircleProgress />
        </div>
      </article>

      <article className="dashboard-card">
        <p className="text-sm text-slate-500">Target Score</p>
        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">IELTS 7.0</p>
        <p className="mt-1 text-sm text-slate-500">in 6 months</p>
        <div className="mt-8 h-2 rounded-full bg-indigo-100">
          <div className="h-full w-[45%] rounded-full bg-gradient-to-r from-primary to-indigo-400" />
        </div>
        <p className="mt-2 text-right text-xs text-slate-500">45% Completed</p>
      </article>

      <article className="dashboard-card bg-gradient-to-br from-white/80 to-indigo-50/80">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Today&apos;s Plan</p>
          <Sparkles size={16} className="text-primary" />
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Mic size={15} className="text-primary" />
              Speaking Practice
            </div>
            <span className="text-xs text-slate-500">15 min</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <CheckCircle2 size={15} className="text-emerald-500" />
              Vocabulary
            </div>
            <span className="text-xs text-slate-500">20 words</span>
          </div>
        </div>
        <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-primary to-indigo-400 py-2 text-sm font-semibold text-white transition hover:from-indigo-600 hover:to-indigo-500">
          Start Now
        </button>
      </article>
    </section>
  )
}

export default OverviewCards
