import { CalendarClock, Users } from 'lucide-react'

function PartnerLessonSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <article className="dashboard-card overflow-hidden bg-gradient-to-br from-indigo-50/80 to-white">
        <p className="text-xl font-semibold text-slate-900">Find a study partner</p>
        <p className="mt-1 max-w-xs text-sm text-slate-500">
          Practice speaking, make friends and improve together.
        </p>
        <button
          type="button"
          className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          Find Partner
        </button>

        <div className="mt-5 flex items-end justify-end gap-4">
          <div className="grid h-28 w-28 place-items-center rounded-full bg-indigo-100 text-indigo-500">
            <Users size={42} />
          </div>
          <div className="grid h-24 w-24 place-items-center rounded-full bg-violet-100 text-violet-500">
            <Users size={34} />
          </div>
        </div>
      </article>

      <article className="dashboard-card">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Upcoming Lesson</p>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-primary">Live</span>
        </div>

        <h3 className="mt-4 text-lg font-semibold text-slate-900">IELTS Writing Task 2</h3>
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
          <CalendarClock size={16} />
          Today, 19:00
        </div>
        <p className="mt-2 text-sm text-slate-600">Teacher: John Doe</p>

        <button
          type="button"
          className="mt-8 w-full rounded-xl border border-indigo-100 bg-indigo-50 py-2 text-sm font-semibold text-primary transition hover:bg-indigo-100"
        >
          Join Lesson
        </button>
      </article>
    </section>
  )
}

export default PartnerLessonSection
