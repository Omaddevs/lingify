import { Award, ChevronRight, Clock3, FileText, GraduationCap } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

const examItems = [
  { name: 'IELTS Full Mock Test', meta: '2h 45m' },
  { name: 'IELTS Listening', meta: '40 min' },
  { name: 'IELTS Reading', meta: '60 min' },
  { name: 'IELTS Writing', meta: '60 min' },
  { name: 'IELTS Speaking', meta: '11-14 min' },
]

const breakdown = [
  { name: 'Listening', value: 7.5, color: '#22c55e' },
  { name: 'Reading', value: 7.0, color: '#6366f1' },
  { name: 'Writing', value: 6.5, color: '#f59e0b' },
  { name: 'Speaking', value: 7.0, color: '#ec4899' },
]

function BottomPanels() {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr_1fr]">
      <article className="dashboard-card">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Mock Exam</h3>
          <div className="flex rounded-lg bg-indigo-50 p-1 text-xs font-semibold">
            <button className="rounded-md bg-primary px-3 py-1 text-white">IELTS</button>
            <button className="px-3 py-1 text-slate-500">TOEFL</button>
            <button className="px-3 py-1 text-slate-500">SAT</button>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {examItems.map((item) => (
            <button
              key={item.name}
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white/90 px-3 py-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-100 text-primary">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.meta}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          ))}
        </div>
      </article>

      <article className="dashboard-card">
        <h3 className="text-lg font-semibold text-slate-900">Mock Exam Result</h3>
        <p className="mt-2 text-center text-5xl font-bold text-primary">7.0</p>
        <p className="text-center text-sm text-slate-500">Good Job!</p>

        <div className="mx-auto mt-4 h-32 w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={breakdown} dataKey="value" innerRadius={34} outerRadius={50} paddingAngle={4}>
                {breakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <button className="mt-2 w-full rounded-xl bg-primary py-2 text-sm font-semibold text-white">Review Answers</button>
      </article>

      <article className="dashboard-card">
        <h3 className="text-lg font-semibold text-slate-900">Profile</h3>
        <div className="mt-4 flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/100?img=15"
            alt="Asadbek"
            className="h-12 w-12 rounded-xl object-cover"
          />
          <div>
            <p className="font-semibold text-slate-800">Asadbek</p>
            <p className="text-xs text-slate-500">@abdhek_01</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-indigo-50/70 p-3 text-center">
          <div>
            <p className="text-lg font-bold text-slate-900">24</p>
            <p className="text-xs text-slate-500">Lessons</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">6</p>
            <p className="text-xs text-slate-500">Certificates</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">14h</p>
            <p className="text-xs text-slate-500">Study Time</p>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <button className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-slate-600 hover:bg-slate-50">
            <span className="flex items-center gap-2"><GraduationCap size={15} /> My Progress</span>
            <ChevronRight size={14} />
          </button>
          <button className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-slate-600 hover:bg-slate-50">
            <span className="flex items-center gap-2"><Award size={15} /> Achievements</span>
            <ChevronRight size={14} />
          </button>
          <button className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-slate-600 hover:bg-slate-50">
            <span className="flex items-center gap-2"><Clock3 size={15} /> Study History</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </article>
    </section>
  )
}

export default BottomPanels
